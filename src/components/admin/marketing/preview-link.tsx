"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreviewHomeLink() {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/" target="_blank" rel="noopener noreferrer">
        Preview Site <ExternalLink className="ml-2 h-3.5 w-3.5" />
      </Link>
    </Button>
  );
}
