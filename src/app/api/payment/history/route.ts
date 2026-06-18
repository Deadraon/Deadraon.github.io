import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Project from "@/models/Project";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    await connectDB();

    // Fetch projects to search by project IDs too
    const clientProjects = await Project.find({ clientId: userId }).lean() as any[];
    const projectIds = clientProjects.map((p) => p._id.toString());

    const payments = await Payment.find({
      $or: [
        { clientEmail: email },
        { projectId: { $in: projectIds } }
      ]
    }).sort({ createdAt: -1 });

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const cashfreeEnv = process.env.CASHFREE_ENV || "sandbox";

    // Dynamic sync check for pending Cashfree payments
    for (const payment of payments) {
      if (payment.status === "pending" && payment.paymentMode === "CASHFREE" && clientId && clientSecret) {
        try {
          const cashfreeUrl = (cashfreeEnv === "production"
            ? "https://api.cashfree.com/pg/orders"
            : "https://sandbox.cashfree.com/pg/orders") + `/${payment.orderId}`;

          const cfResponse = await fetch(cashfreeUrl, {
            headers: {
              "x-client-id": clientId,
              "x-client-secret": clientSecret,
              "x-api-version": "2023-08-01",
            }
          });

          if (cfResponse.ok) {
            const cfData = await cfResponse.json();
            if (cfData.order_status === "PAID") {
              payment.status = "success";
              
              // Get UTR/CF Order ID if available
              if (cfData.cf_order_id) {
                payment.utr = cfData.cf_order_id.toString();
              }
              
              await payment.save();
              console.log(`Payment history sync: Updated orderId ${payment.orderId} status to success.`);
              
              // Update linked project if exists
              if (payment.projectId) {
                const project = await Project.findById(payment.projectId);
                if (project) {
                  if (project.budget && payment.amount < project.budget) {
                    project.paymentStatus = "partial";
                  } else {
                    project.paymentStatus = "paid";
                  }
                  
                  // Check if this changelog message already exists to avoid duplicates
                  const hasLog = project.changelog.some((log: any) => log.message?.includes(payment.orderId));
                  if (!hasLog) {
                    project.changelog.push({
                      id: Date.now().toString(),
                      message: `Payment of ₹${payment.amount} synced successfully via Cashfree. Order ID: ${payment.orderId}`,
                      type: "status",
                      createdAt: new Date(),
                    });
                    await project.save();
                  }
                }
              }
            } else if (cfData.order_status === "EXPIRED" || cfData.order_status === "CANCELLED") {
              payment.status = "failed";
              await payment.save();
              console.log(`Payment history sync: Updated orderId ${payment.orderId} status to failed.`);
            }
          }
        } catch (syncError) {
          console.error(`Failed to sync cashfree status for order ${payment.orderId}:`, syncError);
        }
      }
    }

    const paymentsJson = payments.map((p) => p.toJSON());

    return NextResponse.json({ success: true, payments: paymentsJson });
  } catch (error) {
    console.error("Fetch payment history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
