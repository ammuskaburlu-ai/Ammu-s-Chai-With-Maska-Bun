"use client";

import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import { createFaq, updateFaq } from "@/lib/marketing/actions";
import { faqSchema } from "@/lib/marketing/schemas";
import { FAQFormFields, faqFormDefaults } from "@/components/admin/marketing/forms/faq-form";

export default function MarketingFaqPage() {
  return (
    <MarketingCrudPage
      title="FAQ"
      description="Frequently asked questions — ready for future FAQ sections."
      table="marketing_faqs"
      schema={faqSchema}
      defaultValues={faqFormDefaults}
      onCreate={createFaq}
      onUpdate={updateFaq}
      columns={[{ key: "question", label: "Question" }]}
      renderFields={(register) => <FAQFormFields register={register} />}
    />
  );
}
