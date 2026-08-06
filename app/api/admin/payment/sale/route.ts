import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Check if user has access to route
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { amount, paymentType, referenceId, register } = await req.json();

    const payment = await fetch(`${process.env.STAX_API_URL}/v2/Payment/Sale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Amount: amount,
        PaymentType: paymentType,
        ReferenceId: referenceId,
        AuthKey: process.env.STAX_API_KEY,
        Tpn:
          register === "register_01"
            ? process.env.STAX_TPN_1
            : process.env.STAX_TPN_2,
        RegisterId:
          register === "register_01"
            ? process.env.STAX_REGISTER_ID_1
            : process.env.STAX_REGISTER_ID_2,
      }),
    });

    const data = await payment.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Payment request failed" },
      { status: 500 },
    );
  }
}
