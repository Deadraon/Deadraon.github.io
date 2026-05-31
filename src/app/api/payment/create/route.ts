import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, note, amount, projectId } = body;

    // Validate inputs
    if (!name || !email || !phone || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, phone, and amount are required." },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Amount must be a positive number." },
        { status: 400 }
      );
    }

    const apiKey = process.env.MYMOBPAY_API_KEY;
    const apiUrl = process.env.MYMOBPAY_API_URL || "https://mymob.tech/api/orders";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://deadraon.dev";

    if (!apiKey) {
      console.error("CRITICAL: MYMOBPAY_API_KEY environment variable is not configured.");
      return NextResponse.json(
        { error: "Payment gateway is currently misconfigured on the server." },
        { status: 500 }
      );
    }

    // Call MyMobPay orders API
    const myMobPayload = {
      api_key: apiKey,
      amount: numericAmount,
      customer_name: name,
      customer_phone: phone,
      note: note || `Payment for ${name}`,
      callback_url: `${appUrl}/api/payment/webhook`,
    };

    console.log("Calling MyMobPay API at:", apiUrl, "with payload:", {
      ...myMobPayload,
      api_key: "***REDACTED***",
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myMobPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("MyMobPay API returned error status:", response.status, errorText);
      return NextResponse.json(
        { error: `Payment gateway error: ${errorText || response.statusText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("MyMobPay API response received:", data);

    const orderId = data.orderId || data.order_id;
    const orderAmount = data.orderAmount || numericAmount;

    // Construct the checkout/payment URL dynamically
    const gatewayBaseUrl = apiUrl.replace(/\/api\/orders\/?$/, "");
    const paymentUrl = `${gatewayBaseUrl}/pay?api_key=${apiKey}&amount=${orderAmount}&ref=${orderId}`;

    // Create a pending payment log in MongoDB
    const payment = await Payment.create({
      orderId,
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      amount: numericAmount,
      note: note || "",
      status: "pending",
      projectId: projectId || undefined,
    });

    console.log("Pending payment record logged in DB:", payment._id);

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId,
    });
  } catch (error) {
    console.error("Create payment API error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
