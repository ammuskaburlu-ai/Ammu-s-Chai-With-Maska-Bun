"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import { createHeroTrustItem, updateHeroTrustItem } from "@/lib/marketing/actions";
import { heroTrustItemSchema } from "@/lib/marketing/schemas";

const defaults = {
  label: "",
  icon_name: "star",
  sort_order: 0,
  is_active: true,
};

export default function MarketingHeroTrustPage() {
  return (
    <MarketingCrudPage
      title="Hero Trust Items"
      description="Small trust indicators under the homepage hero CTA."
      table="marketing_hero_trust_items"
      schema={heroTrustItemSchema}
      defaultValues={defaults}
      onCreate={createHeroTrustItem}
      onUpdate={updateHeroTrustItem}
      columns={[
        { key: "label", label: "Label" },
        { key: "sort_order", label: "Order", className: "hidden sm:table-cell" },
      ]}
      renderFields={(register) => (
        <>
          <div>
            <Label>Label</Label>
            <Input {...register("label")} />
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
