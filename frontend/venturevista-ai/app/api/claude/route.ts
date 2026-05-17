import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROK_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        max_tokens: 1500,
        messages: body.messages,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Grok API error" },
        { status: res.status }
      );
    }

    // Convert Grok response to Anthropic format so frontend works unchanged
    const text = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({
      content: [{ type: "text", text }],
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
