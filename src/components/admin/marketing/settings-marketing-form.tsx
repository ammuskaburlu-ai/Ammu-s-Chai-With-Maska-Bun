"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { PreviewHomeLink } from "@/components/admin/marketing/preview-link";
import { toast } from "sonner";

interface SettingsMarketingFormProps<T extends z.ZodType> {
  title: string;
  description?: string;
  schema: T;
  defaultValues: z.infer<T>;
  loadValues: () => Promise<z.infer<T>>;
  onSave: (data: z.infer<T>) => Promise<{ ok: boolean; error?: string }>;
  renderFields: (form: ReturnType<typeof useForm<z.infer<T>>>) => React.ReactNode;
}

export function SettingsMarketingForm<T extends z.ZodType>({
  title,
  description,
  schema,
  defaultValues,
  loadValues,
  onSave,
  renderFields,
}: SettingsMarketingFormProps<T>) {
  const [pending, startTransition] = useTransition();
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    loadValues().then((values) => {
      form.reset(values);
    });
  }, [form, loadValues]);

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await onSave(data);
      if (!result.ok) {
        toast.error(result.error || "Save failed");
        return;
      }
      toast.success("Saved");
    });
  });

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1 max-w-2xl">{description}</p>
          )}
        </div>
        <PreviewHomeLink />
      </div>
      <form onSubmit={onSubmit} className="rounded-xl border p-6 space-y-4 max-w-2xl">
        {renderFields(form)}
        <div className="flex gap-2 pt-2">
          <Button type="submit" variant="brand" disabled={pending || form.formState.isSubmitting}>
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(defaultValues)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
