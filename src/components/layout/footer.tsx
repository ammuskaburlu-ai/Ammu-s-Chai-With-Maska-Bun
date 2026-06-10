import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

interface FooterProps {
  businessName?: string;
  businessPhone?: string;
  businessEmail?: string;
}

export function Footer({
  businessName = APP_NAME,
  businessPhone,
  businessEmail,
}: FooterProps) {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-brand mb-4">{businessName}</h3>
            <p className="text-sm text-muted-foreground">
              Fresh food delivered to your doorstep. Order online and enjoy quick delivery.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/menu" className="hover:text-brand">Menu</Link></li>
              <li><Link href="/about" className="hover:text-brand">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-brand">Login</Link></li>
              <li><Link href="/register" className="hover:text-brand">Register</Link></li>
              <li><Link href="/account/orders" className="hover:text-brand">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {businessPhone && <li>{businessPhone}</li>}
              {businessEmail && <li>{businessEmail}</li>}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {businessName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
