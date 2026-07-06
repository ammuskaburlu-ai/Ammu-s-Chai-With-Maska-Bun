"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm, type Path, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { deleteMarketingRow, toggleMarketingActive } from "@/lib/marketing/actions";
import type { MarketingTable } from "@/lib/marketing/schemas";
import { toast } from "sonner";
import { PreviewHomeLink } from "@/components/admin/marketing/preview-link";

type Row = Record<string, unknown> & { id: string };

interface Column<T extends Row> {
  key: keyof T | string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface MarketingCrudPageProps<TSchema extends z.ZodTypeAny> {
  title: string;
  description?: string;
  table: MarketingTable;
  schema: TSchema;
  defaultValues: z.input<TSchema>;
  columns: Column<Row>[];
  renderFields: (
    register: UseFormRegister<z.input<TSchema>>,
    editing: Row | null
  ) => React.ReactNode;
  onCreate: (data: z.input<TSchema>) => Promise<{ ok: boolean; error?: string }>;
  onUpdate: (id: string, data: z.input<TSchema>) => Promise<{ ok: boolean; error?: string }>;
  orderBy?: string;
}

export function MarketingCrudPage<TSchema extends z.ZodTypeAny>({
  title,
  description,
  table,
  schema,
  defaultValues,
  columns,
  renderFields,
  onCreate,
  onUpdate,
  orderBy = "sort_order",
}: MarketingCrudPageProps<TSchema>) {
  type TForm = z.input<TSchema>;
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<TForm>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from(table).select("*").order(orderBy);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((data as Row[]) || []);
  }, [table, orderBy]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (row: Row) => {
    setEditing(row);
    Object.entries(defaultValues).forEach(([key]) => {
      const val = row[key];
      setValue(key as Path<TForm>, (val ?? "") as never);
    });
    if ("is_active" in row) {
      setValue("is_active" as Path<TForm>, Boolean(row.is_active) as never);
    }
    if ("is_enabled" in row) {
      setValue("is_enabled" as Path<TForm>, Boolean(row.is_enabled) as never);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    reset(defaultValues);
  };

  const onSubmit = (data: TForm) => {
    startTransition(async () => {
      const result = editing
        ? await onUpdate(editing.id, data)
        : await onCreate(data);
      if (!result.ok) {
        toast.error(result.error || "Save failed");
        return;
      }
      toast.success(editing ? "Updated" : "Created");
      cancelEdit();
      load();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this item?")) return;
    startTransition(async () => {
      const result = await deleteMarketingRow(table, id);
      if (!result.ok) {
        toast.error(result.error || "Delete failed");
        return;
      }
      toast.success("Deleted");
      if (editing?.id === id) cancelEdit();
      load();
    });
  };

  const handleToggle = (id: string, active: boolean) => {
    startTransition(async () => {
      const result = await toggleMarketingActive(table, id, active);
      if (!result.ok) {
        toast.error(result.error || "Update failed");
        return;
      }
      load();
    });
  };

  const isActiveField = watch("is_active" as Path<TForm>) as boolean | undefined;

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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border p-6 mb-8 space-y-4 max-w-2xl"
      >
        <h2 className="font-semibold">{editing ? "Edit Item" : "Add Item"}</h2>
        {renderFields(register, editing)}
        {"is_active" in defaultValues && (
          <div className="flex items-center gap-3">
            <Switch
              id="is_active"
              checked={Boolean(isActiveField)}
              onCheckedChange={(checked) => setValue("is_active" as Path<TForm>, checked as never)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button type="submit" variant="brand" disabled={isSubmitting || pending}>
            {editing ? "Save" : "Create"}
          </Button>
          {editing && (
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className={`text-left p-4 ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                {columns.map((col) => (
                  <td key={String(col.key)} className={`p-4 ${col.className || ""}`}>
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as string] ?? "—")}
                  </td>
                ))}
                <td className="p-4">
                  {"is_active" in row && (
                    <Badge variant={row.is_active ? "success" : "destructive"}>
                      {row.is_active ? "Active" : "Inactive"}
                    </Badge>
                  )}
                  {"is_enabled" in row && (
                    <Badge variant={row.is_enabled ? "success" : "destructive"}>
                      {row.is_enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    {"is_active" in row && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggle(row.id, !row.is_active)}
                        disabled={pending}
                      >
                        {row.is_active ? "Disable" : "Enable"}
                      </Button>
                    )}
                    <Button type="button" variant="ghost" size="icon" onClick={() => startEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(row.id)}
                      disabled={pending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="p-8 text-center text-muted-foreground">
                  No items yet. Create one above or preview the site for placeholder content.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
