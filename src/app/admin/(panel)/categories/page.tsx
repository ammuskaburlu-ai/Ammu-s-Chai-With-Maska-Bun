"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/types/database";

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  sort_order: z.coerce.number().default(0),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories((data as Category[]) || []);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: CategoryForm) => {
    const supabase = createClient();
    const slug = slugify(data.name);

    if (editing) {
      const { error } = await supabase.from("categories").update({ ...data, slug }).eq("id", editing);
      if (error) { toast.error(error.message); return; }
      toast.success("Category updated");
    } else {
      const { error } = await supabase.from("categories").insert({ ...data, slug });
      if (error) { toast.error(error.message); return; }
      toast.success("Category created");
    }
    reset();
    setEditing(null);
    load();
  };

  const startEdit = (cat: Category) => {
    setEditing(cat.id);
    setValue("name", cat.name);
    setValue("description", cat.description || "");
    setValue("sort_order", cat.sort_order);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Category deleted");
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border p-6 mb-8 space-y-4 max-w-lg">
        <h2 className="font-semibold">{editing ? "Edit Category" : "Add Category"}</h2>
        <div>
          <Label>Name</Label>
          <Input {...register("name")} />
        </div>
        <div>
          <Label>Description</Label>
          <Input {...register("description")} />
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input type="number" {...register("sort_order")} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="brand" disabled={isSubmitting}>
            {editing ? "Update" : "Add"}
          </Button>
          {editing && (
            <Button type="button" variant="outline" onClick={() => { setEditing(null); reset(); }}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4 hidden sm:table-cell">Order</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 hidden sm:table-cell">{cat.sort_order}</td>
                <td className="p-4">
                  <Badge variant={cat.is_active ? "success" : "destructive"}>
                    {cat.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(cat)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
