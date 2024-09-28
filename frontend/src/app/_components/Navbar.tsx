import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="h-16 w-full border-b flex gap-4 px-4">
      <Link href="/" className="shrink-0">
        <div className="p-2">
          <Image src="/spedee-logo.png" alt="Logo" width={48} height={48} />
        </div>
      </Link>
      <div className="flex items-center justify-center shrink-0">
        <span className="text-sm">Select Location</span>
      </div>
      <div className="flex items-center w-full shrink justify-center">
        <div className="h-9 w-full bg-secondary rounded-lg"></div>
      </div>
      <div className="flex items-center justify-center"><Button variant="secondary">Login</Button></div>
      <div className="flex items-center justify-center"><Button className="gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h440q17 0 28.5 11.5T760-320q0 17-11.5 28.5T720-280H280q-45 0-68-39.5t-2-78.5l54-98-144-304H80q-17 0-28.5-11.5T40-840q0-17 11.5-28.5T80-880h65q11 0 21 6t15 17l27 57Zm134 280h280-280Z"/></svg>
        My Cart</Button></div>
    </nav>
  );
}
