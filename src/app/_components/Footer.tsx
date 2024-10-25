import { cn } from "@/lib/utils";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="sticky top-full w-full border-t">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 p-4 pb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="py-10">
          <h3 className="flex h-12 items-center justify-center px-4 text-lg font-bold lg:justify-start">
            Spedee
          </h3>
          <div className="flex flex-col">
            <FooterLink>About</FooterLink>
            <FooterLink>Blog</FooterLink>
            <FooterLink>FAQ</FooterLink>
            <FooterLink>Contact</FooterLink>
          </div>
        </div>
        <div className="py-10">
          <h3 className="flex h-12 items-center justify-center px-4 text-lg font-bold lg:justify-start">
            Spedee
          </h3>
          <div className="flex flex-col">
            <FooterLink>About</FooterLink>
            <FooterLink>Blog</FooterLink>
            <FooterLink>FAQ</FooterLink>
            <FooterLink>Contact</FooterLink>
          </div>
        </div>{" "}
        <div className="py-10">
          <h3 className="flex h-12 items-center justify-center px-4 text-lg font-bold lg:justify-start">
            Spedee
          </h3>
          <div className="flex flex-col">
            <FooterLink>About</FooterLink>
            <FooterLink>Blog</FooterLink>
            <FooterLink>FAQ</FooterLink>
            <FooterLink>Contact</FooterLink>
          </div>
        </div>{" "}
        <div className="py-10">
          <h3 className="flex h-12 items-center justify-center px-4 text-lg font-bold lg:justify-start">
            Spedee
          </h3>
          <div className="flex flex-col">
            <FooterLink>About</FooterLink>
            <FooterLink>Blog</FooterLink>
            <FooterLink>FAQ</FooterLink>
            <FooterLink>Contact</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  className,
  href,
  children,
}: {
  className?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href || "/"}
      className={cn(
        "flex h-10 cursor-pointer items-center justify-center rounded px-4 text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground lg:justify-start",
        className
      )}
    >
      {children}
    </Link>
  );
}
