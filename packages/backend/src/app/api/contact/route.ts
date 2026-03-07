import { ContactFormSchema } from "@jp/common";
import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, message } = parsed.data;

  const { error } = await getSupabase().from("contacts").insert({ email, message });
  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
