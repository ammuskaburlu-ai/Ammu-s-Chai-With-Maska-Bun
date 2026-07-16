import { SectionHeader } from "@/components/marketing/section-header";
import type { MarketingFaq } from "@/types/marketing-db";

interface FaqSectionProps {
  faqs: MarketingFaq[];
  title?: string;
  subtitle?: string;
}

export function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know",
}: FaqSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-xl border bg-card p-6 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-lg font-medium">
                {faq.question}
                <span className="shrink-0 rounded-full bg-brand/10 p-1.5 text-brand sm:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
