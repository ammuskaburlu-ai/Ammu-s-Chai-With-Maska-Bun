"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import {
  createTrustBadge,
  updateTrustBadge,
} from "@/lib/marketing/actions";
import { trustBadgeSchema } from "@/lib/marketing/schemas";

const defaults = {
  title: "",
  description: "",
  icon_name: "shield-check",
  sort_order: 0,
  is_active: true,
};

export default function MarketingTrustBadgesPage() {
  return (
    <MarketingCrudPage
      title="Trust Badges"
      description="Cards in the trust bar below the hero section."
      table="marketing_trust_badges"
      schema={trustBadgeSchema}
      defaultValues={defaults}
      onCreate={createTrustBadge}
      onUpdate={updateTrustBadge}
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
            <Input {...register("icon_name")} placeholder="coffee, star, truck, heart..." />
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
