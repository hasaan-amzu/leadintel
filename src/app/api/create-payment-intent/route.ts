import { NextRequest, NextResponse } from "next/server";
import { TIERS } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const { leads, email, name } = await req.json();

    const tier = TIERS.find((t) => t.leads === leads);
    if (!tier) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    if (!email || !name) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    // Create PaymentIntent via Stripe API directly (no SDK needed)
    const params = new URLSearchParams();
    params.append("amount", String(Math.round(tier.price * 100))); // cents
    params.append("currency", "usd");
    params.append("receipt_email", email);
    params.append("metadata[leads]", String(tier.leads));
    params.append("metadata[customer_name]", name);
    params.append("metadata[customer_email]", email);

    const stripeRes = await fetch(
      "https://api.stripe.com/v1/payment_intents",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!stripeRes.ok) {
      const err = await stripeRes.json();
      return NextResponse.json(
        { error: err.error?.message || "Stripe error" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripeRes.json();

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
