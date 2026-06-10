import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateDiscount } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = schema.parse(body);

    const supabase = await createClient();
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    if (subtotal < coupon.min_order_value) {
      return NextResponse.json(
        { error: `Minimum order value is ₹${coupon.min_order_value}` },
        { status: 400 }
      );
    }

    const discount = calculateDiscount(subtotal, coupon);

    return NextResponse.json({
      valid: true,
      discount,
      coupon: {
        code: coupon.code,
        description: coupon.description,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
