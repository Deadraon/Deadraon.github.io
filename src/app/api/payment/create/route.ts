import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, note, amount, projectId, gateway = "mymobpay" } = body;

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://deadraon.dev";

    // Handle Cashfree Payment Gateway
    if (gateway === "cashfree") {
      const clientId = process.env.CASHFREE_CLIENT_ID;
      const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
      const cashfreeEnv = process.env.CASHFREE_ENV || "sandbox";

      if (!clientId || !clientSecret) {
        console.error("CRITICAL: CASHFREE_CLIENT_ID or CASHFREE_CLIENT_SECRET environment variables are not configured.");
        return NextResponse.json(
          { error: "Cashfree payment gateway is currently misconfigured on the server." },
          { status: 500 }
        );
      }

      const cashfreeUrl = cashfreeEnv === "production"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

      const orderId = `cf_${Date.now()}`;

      const cashfreePayload = {
        order_id: orderId,
        order_amount: numericAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${phone.replace(/\D/g, "") || "anon"}_${Date.now()}`,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
        },
        order_meta: {
          return_url: `${appUrl}/pay`,
          notify_url: `${appUrl}/api/payment/webhook/cashfree`,
        },
        order_note: note || `Payment for ${name}`,
      };

      console.log("Calling Cashfree API at:", cashfreeUrl, "with payload:", {
        ...cashfreePayload,
        customer_details: {
          ...cashfreePayload.customer_details,
          customer_phone: "***REDACTED***",
          customer_email: "***REDACTED***",
        }
      });

      const response = await fetch(cashfreeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": clientId,
          "x-client-secret": clientSecret,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify(cashfreePayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cashfree API returned error status:", response.status, errorText);
        return NextResponse.json(
          { error: `Cashfree gateway error: ${errorText || response.statusText}` },
          { status: 502 }
        );
      }

      const data = await response.json();
      console.log("Cashfree API response received:", data);

      const paymentSessionId = data.payment_session_id;

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
        paymentMode: "CASHFREE",
      });

      console.log("Pending Cashfree payment record logged in DB:", payment._id);

      return NextResponse.json({
        success: true,
        isCashfree: true,
        paymentSessionId,
        orderId,
      });
    }

    // Default: Handle MyMobPay Gateway
    const apiKey = process.env.MYMOBPAY_API_KEY;
    const apiUrl = process.env.MYMOBPAY_API_URL || "https://mymob.tech/api/orders";

    if (!apiKey) {
      console.error("CRITICAL: MYMOBPAY_API_KEY environment variable is not configured.");
      return NextResponse.json(
        { error: "Payment gateway is currently misconfigured on the server." },
        { status: 500 }
      );
    }

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

    // Construct the checkout/payment URL dynamically using the pre-created order ID
    const gatewayBaseUrl = apiUrl.replace(/\/api\/orders\/?$/, "");
    const paymentUrl = `${gatewayBaseUrl}/pay?id=${orderId}`;

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
      paymentMode: "UPI",
    });

    console.log("Pending MyMobPay payment record logged in DB:", payment._id);

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
