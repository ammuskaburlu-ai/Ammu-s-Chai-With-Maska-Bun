"use client";

import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import { createSeoPage, updateSeoPage } from "@/lib/marketing/actions";
import { seoFormSchema } from "@/lib/marketing/schemas";
import { SEOFormFields, seoFormDefaults } from "@/components/admin/marketing/forms/seo-form";

export default function MarketingSeoPage() {
  return (
    <MarketingCrudPage
      title="SEO"
      description="Per-page metadata for home, menu, community, and more."
      table="marketing_seo_pages"
      schema={seoFormSchema}
      defaultValues={seoFormDefaults}
      onCreate={createSeoPage}
      onUpdate={updateSeoPage}
      columns={[
        { key: "page_key", label: "Page" },
        { key: "meta_title", label: "Title", className: "hidden md:table-cell" },
      ]}
      renderFields={(register) => <SEOFormFields register={register} />}
    />
  );
}
