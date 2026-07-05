import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  id?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, id, action }: SectionHeaderProps) {
  return (
    <div id={id} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
