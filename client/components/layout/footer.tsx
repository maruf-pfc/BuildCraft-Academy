import Link from "next/link";
import { RiGraduationCapLine, RiFacebookLine, RiInstagramLine, RiLinkedinLine, RiYoutubeLine } from "react-icons/ri";

const footerLinks = {
  Platform: [
    { label: "Courses", href: "/courses" },
    { label: "Projects", href: "/projects" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Account: [
    { label: "Login", href: "/auth/login" },
    { label: "Register", href: "/auth/register" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <RiGraduationCapLine className="text-primary-foreground text-xl" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                BuildCraft<span className="text-primary">Academy</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Build Knowledge. Build Futures. Expert-led training in construction,
              design, and engineering.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: RiFacebookLine, href: "#" },
                { icon: RiInstagramLine, href: "#" },
                { icon: RiLinkedinLine, href: "#" },
                { icon: RiYoutubeLine, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h4 className="font-semibold text-sm">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} BuildCraft Academy. All rights reserved.</span>
          <span>Dhaka, Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}
