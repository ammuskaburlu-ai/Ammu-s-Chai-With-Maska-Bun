"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("settings").select("key, value").then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach((s) => {
        const val = s.value;
        map[s.key] = typeof val === "string" ? val.replace(/^"|"$/g, "") : JSON.stringify(val);
      });
      setSettings(map);
    });
  }, []);

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setLoading(true);
    const supabase = createClient();
    const keys = [
      "business_name", "business_phone", "business_email", "business_address",
      "delivery_fee", "min_order_value", "loyalty_points_rate", "admin_email", "telegram_chat_id",
    ];

    for (const key of keys) {
      if (settings[key] !== undefined) {
        const isNumeric = ["delivery_fee", "min_order_value", "loyalty_points_rate"].includes(key);
        const value = isNumeric ? settings[key] : JSON.stringify(settings[key]);
        await supabase
          .from("settings")
          .upsert({ key, value: isNumeric ? Number(settings[key]) : value }, { onConflict: "key" });
      }
    }

    if (settings.about) {
      await supabase
        .from("settings")
        .upsert({ key: "about", value: JSON.stringify(settings.about) }, { onConflict: "key" });
    }

    toast.success("Settings saved");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="space-y-6">
        <div>
          <Label>Business Name</Label>
          <Input value={settings.business_name || ""} onChange={(e) => update("business_name", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Phone</Label>
            <Input value={settings.business_phone || ""} onChange={(e) => update("business_phone", e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={settings.business_email || ""} onChange={(e) => update("business_email", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Address</Label>
          <Textarea value={settings.business_address || ""} onChange={(e) => update("business_address", e.target.value)} />
        </div>
        <div>
          <Label>About</Label>
          <Textarea value={settings.about || ""} onChange={(e) => update("about", e.target.value)} rows={4} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Delivery Fee (₹)</Label>
            <Input type="number" value={settings.delivery_fee || ""} onChange={(e) => update("delivery_fee", e.target.value)} />
          </div>
          <div>
            <Label>Min Order (₹)</Label>
            <Input type="number" value={settings.min_order_value || ""} onChange={(e) => update("min_order_value", e.target.value)} />
          </div>
          <div>
            <Label>Loyalty Rate (pts/₹100)</Label>
            <Input type="number" value={settings.loyalty_points_rate || ""} onChange={(e) => update("loyalty_points_rate", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Admin Email (notifications)</Label>
            <Input value={settings.admin_email || ""} onChange={(e) => update("admin_email", e.target.value)} />
          </div>
          <div>
            <Label>Telegram Chat ID</Label>
            <Input value={settings.telegram_chat_id || ""} onChange={(e) => update("telegram_chat_id", e.target.value)} />
          </div>
        </div>
        <Button variant="brand" onClick={save} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
