import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ points: 0 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("loyalty_points")
    .eq("id", user.id)
    .single();

  return NextResponse.json({ points: profile?.loyalty_points || 0 });
}
