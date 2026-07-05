import { Coffee, Heart, ShieldCheck, Truck } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Coffee, title: "Freshly Brewed Daily", description: "Chai & snacks made fresh for every order" },
  { icon: ShieldCheck, title: "Secure Payments", description: "Safe checkout with trusted payment partners" },
  { icon: Truck, title: "Fast Delivery", description: "Quick local delivery across Nellore" },
  { icon: Heart, title: "Loved Across Nellore", description: "A local favourite for chai & maska bun" },
];

export function TrustBar() {
  return (
    <section className="border-y bg-card/50">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border bg-background p-4 md:p-5 text-center md:text-left hover:border-brand/40 transition-colors"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">{title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
