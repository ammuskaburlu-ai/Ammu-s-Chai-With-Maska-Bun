"use client";

import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import { createInfluencer, updateInfluencer } from "@/lib/marketing/actions";
import { influencerSchema } from "@/lib/marketing/schemas";
import {
  InfluencerFormFields,
  influencerFormDefaults,
} from "@/components/admin/marketing/forms/influencer-form";

export default function MarketingInfluencersPage() {
  return (
    <MarketingCrudPage
      title="Influencers"
      description="Featured creators in the Featured By section."
      table="marketing_influencers"
      schema={influencerSchema}
      defaultValues={influencerFormDefaults}
      onCreate={createInfluencer}
      onUpdate={updateInfluencer}
      columns={[
        { key: "name", label: "Name" },
        { key: "handle", label: "Handle", className: "hidden md:table-cell" },
        { key: "sort_order", label: "Order", className: "hidden sm:table-cell" },
      ]}
      renderFields={(register) => <InfluencerFormFields register={register} />}
    />
  );
}
