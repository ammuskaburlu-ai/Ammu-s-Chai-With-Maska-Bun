"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import { createWhyFeature, updateWhyFeature } from "@/lib/marketing/actions";
import { whyFeatureSchema } from "@/lib/marketing/schemas";

const defaults = {
  title: "",
  description: "",
  icon_name: "leaf",
  sort_order: 0,
  is_active: true,
};

export default function MarketingWhyFeaturesPage() {
  return (
    <MarketingCrudPage
      title="Why People Love Us"
      description="Feature cards in the Why People Love Us section."
      table="marketing_why_features"
      schema={whyFeatureSchema}
      defaultValues={defaults}
      onCreate={createWhyFeature}
      onUpdate={updateWhyFeature}
      columns={[
        { key: "title", label: "Title" },
        { key: "sort_order", label: "Order", className: "hidden sm:table-cell" },
      ]}
      renderFields={(register) => (
        <>
          <div>
            <Label>Title</Label>
            <Input {...register("title")} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={2} {...register("description")} />
          </div>
          <div>
            <Label>Icon Name</Label>
            <Input {...register("icon_name")} />
          </div>
          <div>
            <Label>Sort Order</Label>
            <Input type="number" {...register("sort_order")} />
          </div>
        </>
      )}
    />
  );
}
