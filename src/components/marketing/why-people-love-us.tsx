import { Clock, IndianRupee, Leaf, ShieldCheck, Truck } from "lucide-react";
import { SectionHeader } from "@/components/marketing/section-header";

const FEATURES = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Chai and snacks prepared fresh for every order",
  },
  {
    icon: IndianRupee,
    title: "Affordable",
    description: "Great value combos without compromising on taste",
  },
  {
    icon: Clock,
    title: "Authentic Taste",
    description: "Classic maska bun and chai the Nellore way",
  },
  {
    icon: Truck,
    title: "Quick Delivery",
    description: "Fast local delivery when you crave comfort food",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "Safe online payments with trusted partners",
  },
];

export function WhyPeopleLoveUs() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Why People Love Us"
          subtitle="Everything that makes Ammu's a local favourite"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-xl border bg-card p-5 text-center hover:border-brand/40 hover:shadow-sm transition-all"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">{title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
