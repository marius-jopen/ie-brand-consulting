import { NextRequest, NextResponse } from "next/server";

const STATIC_FORMS_ENDPOINT = "https://api.staticforms.dev/submit";

export async function POST(request: NextRequest) {
  const apiKey = process.env.STATIC_FORM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "Contact form is not configured yet." },
      { status: 500 }
    );
  }

  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(STATIC_FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...payload,
        apiKey,
      }),
    });

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        responseBody?.message ??
        "Static Forms rejected the submission. Please try again later.";

      return NextResponse.json({ message }, { status: response.status });
    }

    return NextResponse.json(
      {
        message:
          responseBody?.message ??
          "Thanks for your message! We'll be in touch shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}

