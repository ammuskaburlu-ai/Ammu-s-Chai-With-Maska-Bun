"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { toggleHomepageSection, updateHomepageSection } from "@/lib/marketing/actions";
import { homepageSectionSchema } from "@/lib/marketing/schemas";
import { PreviewHomeLink } from "@/components/admin/marketing/preview-link";
import { toast } from "sonner";
import type { MarketingHomepageSection } from "@/types/marketing-db";

type SectionForm = {
  section_key: string;
  title_override: string;
  subtitle_override: string;
  sort_order: number;
  is_enabled: boolean;
};

const defaults: SectionForm = {
  section_key: "",
  title_override: "",
  subtitle_override: "",
  sort_order: 0,
  is_enabled: true,
};

export default function MarketingSectionsPage() {
  const [rows, setRows] = useState<MarketingHomepageSection[]>([]);
  const [editing, setEditing] = useState<MarketingHomepageSection | null>(null);
  const [pending, startTransition] = useTransition();

  const { register, handleSubmit, reset, setValue, watch } = useForm<SectionForm>({
    resolver: zodResolver(homepageSectionSchema),
    defaultValues: defaults,
  });

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("marketing_homepage_sections")
      .select("*")
      .order("sort_order");
    setRows((data as MarketingHomepageSection[]) || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = (data: SectionForm) => {
    if (!editing) return;
    startTransition(async () => {
      const result = await updateHomepageSection(editing.id, data);
      if (!result.ok) {
        toast.error(result.error || "Save failed");
        return;
      }
      toast.success("Section updated");
      setEditing(null);
      reset(defaults);
      load();
    });
  };

  const startEdit = (row: MarketingHomepageSection) => {
    setEditing(row);
    setValue("section_key", row.section_key);
    setValue("title_override", row.title_override || "");
    setValue("subtitle_override", row.subtitle_override || "");
    setValue("sort_order", row.sort_order);
    setValue("is_enabled", row.is_enabled);
  };

  const handleToggle = (id: string, enabled: boolean) => {
    startTransition(async () => {
      const result = await toggleHomepageSection(id, enabled);
      if (!result.ok) {
        toast.error(result.error || "Update failed");
        return;
      }
      load();
    });
  };

  const isEnabled = watch("is_enabled");

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Homepage Sections</h1>
          <p className="text-muted-foreground mt-1">
            Enable, disable, and reorder homepage sections. Section keys are fixed.
          </p>
        </div>
        <PreviewHomeLink />
      </div>

      {editing && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border p-6 mb-8 space-y-4 max-w-2xl"
        >
          <h2 className="font-semibold">Edit Section: {editing.section_key}</h2>
          <div>
            <Label>Section Key</Label>
            <Input {...register("section_key")} disabled />
          </div>
          <div>
            <Label>Title Override</Label>
            <Input {...register("title_override")} placeholder="Leave blank for default" />
          </div>
          <div>
            <Label>Subtitle Override</Label>
            <Input {...register("subtitle_override")} placeholder="Leave blank for default" />
          </div>
          <div>
            <Label>Sort Order</Label>
            <Input type="number" {...register("sort_order")} />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={Boolean(isEnabled)}
              onCheckedChange={(checked) => setValue("is_enabled", checked)}
            />
            <Label>Enabled</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="brand" disabled={pending}>
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                reset(defaults);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Section</th>
              <th className="text-left p-4 hidden sm:table-cell">Order</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-4 font-medium">{row.section_key}</td>
                <td className="p-4 hidden sm:table-cell">{row.sort_order}</td>
                <td className="p-4">
                  <Badge variant={row.is_enabled ? "success" : "destructive"}>
                    {row.is_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggle(row.id, !row.is_enabled)}
                      disabled={pending}
                    >
                      {row.is_enabled ? "Disable" : "Enable"}
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => startEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
