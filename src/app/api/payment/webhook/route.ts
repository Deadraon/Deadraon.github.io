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
    
    // Retrieve signature header
    const signature = 
      req.headers.get("x-signature") || 
      req.headers.get("signature") || 
      req.headers.get("x-mymobpay-signature") || 
      req.headers.get("x-hub-signature-256");

    const webhookSecret = process.env.MYMOBPAY_WEBHOOK_SECRET;

    console.log("Webhook callback received. Signature header:", signature);

    // Signature verification logic
    if (webhookSecret && webhookSecret !== "your_webhook_secret_key") {
      if (!signature) {
        console.error("Webhook verification failed: Missing signature header.");
        return NextResponse.json({ error: "Missing signature header" }, { status: 401 });
      }

      const hmac = crypto.createHmac("sha256", webhookSecret);
      const computedSignature = hmac.update(rawBody).digest("hex");

      try {
        const isValid = crypto.timingSafeEqual(
          Buffer.from(computedSignature, "hex"),
          Buffer.from(signature, "hex")
        );
        if (!isValid) {
          console.error("Webhook verification failed: Invalid signature mismatch.");
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      } catch (err) {
        console.error("Webhook signature comparison error:", err);
        return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
      }
    } else {
      console.warn(
        "WARNING: Webhook signature verification skipped. MYMOBPAY_WEBHOOK_SECRET is not configured or contains the default placeholder."
      );
    }

    // Parse the payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Webhook failed to parse raw body as JSON:", parseError);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    console.log("Webhook payload parsed successfully:", payload);

    const orderId = payload.order_id || payload.orderId;
    const status = payload.status || payload.payment_status; // Handle potential status key variations
    const amount = Number(payload.amount);

    if (!orderId) {
      console.error("Webhook error: Missing orderId in payload.");
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Find transaction log in DB
    let payment = await Payment.findOne({ orderId });

    if (!payment) {
      console.warn(`Payment not found for orderId: ${orderId}. Creating ad-hoc payment log.`);
      // If payment was not logged initially, create a fallback payment record
      payment = await Payment.create({
        orderId,
        clientName: payload.customer_name || payload.name || "Unknown Client",
        clientEmail: payload.customer_email || payload.email || "unknown@example.com",
        clientPhone: payload.customer_phone || payload.phone || "N/A",
        amount: isNaN(amount) ? 0 : amount,
        note: payload.note || "Ad-hoc payment via webhook",
        status: "pending",
      });
    }

    // Handle payment status updates
    const isSuccess = 
      status === "success" || 
      status === "completed" || 
      status === "paid" || 
      status === "SUCCESS";
      
    const isFailed = 
      status === "failed" || 
      status === "failure" || 
      status === "FAILED";

    if (isSuccess) {
      payment.status = "success";
      console.log(`Payment success confirmed for orderId: ${orderId}`);
      
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
        
        // Update paymentStatus to paid (or partial depending on budget)
        if (project.budget && payment.amount < project.budget) {
          project.paymentStatus = "partial";
        } else {
          project.paymentStatus = "paid";
        }

        // Push new entry to changelog
        project.changelog.push({
          id: Date.now().toString(),
          message: `Payment of ₹${payment.amount} received successfully via UPI (MyMobPay). Order ID: ${orderId}`,
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
      console.log(`Payment failure confirmed for orderId: ${orderId}`);
    }

    await payment.save();
    console.log("Payment transaction logged/updated in DB.");

    return NextResponse.json({ received: true, status: payment.status });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
