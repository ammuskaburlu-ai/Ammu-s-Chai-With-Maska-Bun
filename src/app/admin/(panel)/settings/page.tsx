/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({ is_store_open: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("settings").select("key, value").then(({ data }) => {
      const map: Record<string, any> = {};
      data?.forEach((s) => {
        let val = s.value;
        if (typeof val === "string") {
          try {
            val = JSON.parse(val);
          } catch {
            val = val.replace(/^"|"$/g, "");
          }
        }
        map[s.key] = val;
      });
      // Flatten contact into root state for easy binding
      const contactObj = map.contact as Record<string, string> | undefined;
      if (contactObj) {
        map.whatsapp = contactObj.whatsapp || "";
        map.maps_url = contactObj.maps_url || "";
        map.instagram = contactObj.instagram || "";
        map.youtube = contactObj.youtube || "";
      }
      setSettings((prev) => ({ ...prev, ...map }));
    });
  }, []);

  const update = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setLoading(true);
    const supabase = createClient();
    const keys = [
      "business_name", "business_phone", "business_email", "business_address",
      "delivery_fee", "min_order_value", "admin_email", "telegram_chat_id",
      "free_delivery_threshold", "is_store_open"
    ];

    for (const key of keys) {
      if (settings[key] !== undefined) {
        const isNumeric = ["delivery_fee", "min_order_value", "free_delivery_threshold"].includes(key);
        const value = isNumeric ? Number(settings[key]) : settings[key];
        await supabase
          .from("settings")
          .upsert({ key, value }, { onConflict: "key" });
      }
    }

    if (settings.about) {
      await supabase
        .from("settings")
        .upsert({ key: "about", value: JSON.stringify(settings.about) }, { onConflict: "key" });
    }

    // Build contact object
    const contactObj = {
      whatsapp: settings.whatsapp || "",
      maps_url: settings.maps_url || "",
      instagram: settings.instagram || "",
      youtube: settings.youtube || ""
    };
    await supabase
      .from("settings")
      .upsert({ key: "contact", value: contactObj }, { onConflict: "key" });

    toast.success("Settings saved");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl pb-16">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-8">
        {/* Store Status */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Store Status</h2>
          <div className="flex items-center space-x-4 border rounded-md p-4 bg-muted/30">
            <Switch 
              checked={settings.is_store_open !== false} 
              onCheckedChange={(c) => update("is_store_open", c)} 
            />
            <div>
              <Label className="text-base">Accept Orders (Store Open)</Label>
              <p className="text-sm text-muted-foreground">Toggle to close the store temporarily. Customers will not be able to check out.</p>
            </div>
          </div>
        </section>

        {/* Business Info */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Business Information</h2>
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
            <Textarea value={settings.about || ""} onChange={(e) => update("about", e.target.value)} rows={3} />
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Pricing & Delivery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label>Delivery Fee (₹)</Label>
              <Input type="number" value={settings.delivery_fee || ""} onChange={(e) => update("delivery_fee", e.target.value)} />
            </div>
            <div>
              <Label>Min Order (₹)</Label>
              <Input type="number" value={settings.min_order_value || ""} onChange={(e) => update("min_order_value", e.target.value)} />
            </div>
            <div>
              <Label>Free Delivery &gt; (₹)</Label>
              <Input type="number" value={settings.free_delivery_threshold || ""} onChange={(e) => update("free_delivery_threshold", e.target.value)} placeholder="e.g. 500" />
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Social & Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Google Maps URL</Label>
              <Input value={settings.maps_url || ""} onChange={(e) => update("maps_url", e.target.value)} placeholder="https://maps.google.com/..." />
            </div>
            <div>
              <Label>WhatsApp Number</Label>
              <Input value={settings.whatsapp || ""} onChange={(e) => update("whatsapp", e.target.value)} placeholder="e.g. +919876543210" />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input value={settings.instagram || ""} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <Label>YouTube URL</Label>
              <Input value={settings.youtube || ""} onChange={(e) => update("youtube", e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </div>
        </section>

        {/* System */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">System Settings</h2>
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
        </section>

        <Button variant="brand" size="lg" className="w-full sm:w-auto" onClick={save} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
