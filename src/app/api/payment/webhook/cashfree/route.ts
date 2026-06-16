import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Project from "@/models/Project";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Read the raw body as a string for HMAC verification
    const rawBody = await req.text();
    
    // Retrieve headers
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

    console.log("Cashfree webhook callback received. Signature:", signature, "Timestamp:", timestamp);

    if (!signature || !timestamp) {
      console.error("Webhook verification failed: Missing signature or timestamp headers.");
      return NextResponse.json({ error: "Missing verification headers" }, { status: 401 });
    }

    if (!clientSecret) {
      console.error("CRITICAL: CASHFREE_CLIENT_SECRET is not configured on the server.");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Verify signature (Cashfree timestamp + raw body base64 HMAC signature check)
    const dataToVerify = timestamp + rawBody;
    const computedSignature = crypto
      .createHmac("sha256", clientSecret)
      .update(dataToVerify)
      .digest("base64");

    if (computedSignature !== signature) {
      console.error("Webhook verification failed: Signature mismatch.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("Cashfree webhook signature verified successfully!");

    // Parse the payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Webhook failed to parse raw body as JSON:", parseError);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { type, data } = payload;
    console.log("Parsed webhook event:", type);

    if (!data || !data.order || !data.payment) {
      console.error("Webhook payload structure is unrecognized:", payload);
      return NextResponse.json({ error: "Unrecognized payload structure" }, { status: 400 });
    }

    const orderId = data.order.order_id;
    const paymentStatus = data.payment.payment_status;
    const amount = Number(data.payment.payment_amount || data.order.order_amount);
    const utr = data.payment.bank_reference || data.payment.cf_payment_id || "";
    const paymentMode = data.payment.payment_group || "CASHFREE";

    if (!orderId) {
      console.error("Webhook error: Missing order ID in data.");
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    // Find transaction log in DB
    let payment = await Payment.findOne({ orderId });

    if (!payment) {
      console.warn(`Payment not found for orderId: ${orderId}. Creating ad-hoc payment log.`);
      payment = await Payment.create({
        orderId,
        clientName: data.customer_details?.customer_name || "Unknown Client",
        clientEmail: data.customer_details?.customer_email || "unknown@example.com",
        clientPhone: data.customer_details?.customer_phone || "N/A",
        amount: isNaN(amount) ? 0 : amount,
        note: data.order.order_note || "Ad-hoc payment via Cashfree webhook",
        status: "pending",
        utr,
        paymentMode: "CASHFREE",
      });
    } else {
      payment.utr = utr || payment.utr;
      payment.paymentMode = paymentMode || payment.paymentMode;
    }

    const isSuccess = paymentStatus === "SUCCESS";
    const isFailed = paymentStatus === "FAILED" || paymentStatus === "USER_DROPPED" || paymentStatus === "CANCELLED";

    if (isSuccess) {
      payment.status = "success";
      console.log(`Cashfree payment success confirmed for orderId: ${orderId}`);
      
      // Update linked project if exists
      let project = null;
      if (payment.projectId) {
        project = await Project.findById(payment.projectId);
      }

      // If not linked but note contains project ID
      if (!project && payment.note) {
        const objectIdRegex = /[0-9a-fA-F]{24}/;
        const match = payment.note.match(objectIdRegex);
        if (match) {
          project = await Project.findById(match[0]);
          if (project) {
            payment.projectId = project._id.toString();
          }
        }
      }

      // Fallback matching by client email & note matching name
      if (!project && payment.clientEmail) {
        project = await Project.findOne({
          clientEmail: payment.clientEmail,
          $or: [
            { projectName: { $regex: new RegExp(payment.note || "", "i") } }
          ]
        });
        if (project) {
          payment.projectId = project._id.toString();
        }
      }

      if (project) {
        console.log(`Updating project '${project.projectName}' (${project._id}) paymentStatus`);
        
        if (project.budget && payment.amount < project.budget) {
          project.paymentStatus = "partial";
        } else {
          project.paymentStatus = "paid";
        }

        project.changelog.push({
          id: Date.now().toString(),
          message: `Payment of ₹${payment.amount} received successfully via Cashfree. Order ID: ${orderId}`,
          type: "status",
          createdAt: new Date(),
        });

        await project.save();
        console.log("Project updated successfully in DB.");
      } else {
        console.log("No matching client project found to link with this transaction.");
      }
    } else if (isFailed) {
      payment.status = "failed";
      console.log(`Cashfree payment failure confirmed for orderId: ${orderId}`);
    }

    await payment.save();
    console.log("Payment transaction logged/updated in DB.");

    return NextResponse.json({ received: true, status: payment.status });
  } catch (error) {
    console.error("Cashfree webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
