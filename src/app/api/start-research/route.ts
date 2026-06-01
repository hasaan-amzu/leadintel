import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const leads = formData.get("leads") as string;
    const paymentIntentId = formData.get("payment_intent_id") as string;

    if (!file || !email || !leads || !paymentIntentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Forward to the new landing endpoint (no auth required, validates payment)
    const backendForm = new FormData();
    backendForm.append("file", file);
    backendForm.append("payment_intent_id", paymentIntentId);
    backendForm.append("email", email);
    backendForm.append("name", name);
    backendForm.append("leads_count", leads);

    const pipelineRes = await fetch(`${API_URL}/api/landing/process`, {
      method: "POST",
      body: backendForm,
    });

    if (!pipelineRes.ok) {
      const err = await pipelineRes.json();
      return NextResponse.json(
        { error: err.detail || "Pipeline failed to start" },
        { status: 500 }
      );
    }

    const result = await pipelineRes.json();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
