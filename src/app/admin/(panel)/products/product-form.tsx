"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import type { Product, Category } from "@/types/database";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  compare_at_price: z.coerce.number().optional(),
  category_id: z.string().uuid(),
  image_url: z.string().optional(),
  is_available: z.boolean(),
  is_featured: z.boolean(),
  is_special: z.boolean(),
  is_popular: z.boolean(),
  sort_order: z.coerce.number().default(0),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description || "",
      price: product.price,
      compare_at_price: product.compare_at_price || undefined,
      category_id: product.category_id,
      image_url: product.image_url || "",
      is_available: product.is_available,
      is_featured: product.is_featured,
      is_special: product.is_special,
      is_popular: product.is_popular,
      sort_order: product.sort_order,
    } : {
      is_available: true,
      is_featured: false,
      is_special: false,
      is_popular: false,
      sort_order: 0,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    const supabase = createClient();
    const slug = slugify(data.name);
    const payload = { ...data, slug, compare_at_price: data.compare_at_price || null };

    if (product) {
      const { error } = await supabase.from("products").update(payload).eq("id", product.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Product updated");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Product created");
    }
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div>
        <Label>Name</Label>
        <Input {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price (₹)</Label>
          <Input type="number" step="0.01" {...register("price")} />
        </div>
        <div>
          <Label>Compare at Price</Label>
          <Input type="number" step="0.01" {...register("compare_at_price")} />
        </div>
      </div>
      <div>
        <Label>Category</Label>
        <Select
          value={watch("category_id")}
          onValueChange={(v) => setValue("category_id", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Image URL</Label>
        <Input {...register("image_url")} placeholder="https://..." />
      </div>
      <div>
        <Label>Sort Order</Label>
        <Input type="number" {...register("sort_order")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {(["is_available", "is_featured", "is_special", "is_popular"] as const).map((field) => (
          <div key={field} className="flex items-center justify-between rounded-lg border p-3">
            <Label className="capitalize">{field.replace("is_", "").replace("_", " ")}</Label>
            <Switch
              checked={watch(field)}
              onCheckedChange={(v) => setValue(field, v)}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <Button type="submit" variant="brand" disabled={isSubmitting}>
          {product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
