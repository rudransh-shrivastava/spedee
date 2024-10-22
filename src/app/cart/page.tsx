"use client";

import { Cart } from "./_components/Cart";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto,19rem]">
      <h2 className="py-4 text-3xl font-bold text-foreground/70 md:col-span-2">
        Cart
      </h2>
      <Cart />
    </div>
  );
}
