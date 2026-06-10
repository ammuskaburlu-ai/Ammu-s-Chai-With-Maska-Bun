import { getSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our food business and our commitment to quality.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">About {settings.businessName}</h1>
      <div className="prose prose-lg text-muted-foreground">
        <p className="text-lg leading-relaxed">{settings.about}</p>
        {settings.openingHours && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Opening Hours</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(settings.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between border-b py-2">
                  <span className="capitalize font-medium text-foreground">{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
