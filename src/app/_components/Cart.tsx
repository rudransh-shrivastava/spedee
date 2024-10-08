import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ProductType } from "@/models/Product";

export default function Cart() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h440q17 0 28.5 11.5T760-320q0 17-11.5 28.5T720-280H280q-45 0-68-39.5t-2-78.5l54-98-144-304H80q-17 0-28.5-11.5T40-840q0-17 11.5-28.5T80-880h65q11 0 21 6t15 17l27 57Zm134 280h280-280Z" />
          </svg>
          My Cart
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>Your cart</SheetDescription>
        </SheetHeader>
        <CartContent />
      </SheetContent>
    </Sheet>
  );
}

function CartContent() {
  const cartProducts: (ProductType & { quantity: number })[] = [];
  return (
    <div className="flex flex-col py-8">
      {cartProducts.map((product, index) => (
        <CartItemCard key={index} product={product} />
      ))}
    </div>
  );
}

function CartItemCard({
  product,
}: {
  product: ProductType & { quantity: number };
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border p-2",
        false ? "pointer-events-none opacity-50" : ""
      )}
    >
      <div className="size-12 rounded-lg bg-secondary shadow">
        <Image
          src={product.image}
          width={48}
          height={48}
          alt=""
          className="size-12 rounded-lg"
        />
      </div>
      <span>{product.name}</span>
      <div className="ml-auto flex h-9 items-center overflow-hidden rounded-lg border bg-background">
        <Button
          className="rounded-r-none px-2 text-2xl font-medium leading-none"
          variant="ghost"
          onClick={() => {}}
        >
          -
        </Button>
        <span className="px-2">{product.quantity}</span>
        <Button
          className="rounded-l-none px-2 text-lg font-medium leading-none"
          variant="ghost"
          onClick={() => {}}
        >
          +
        </Button>
      </div>
      <div className="flex flex-col items-center px-2">
        <span>{product.priceInPaise * product.quantity}</span>
        <span className="text-sm text-secondary-foreground line-through">
          {product.salePriceInPaise * product.quantity}
        </span>
      </div>
    </div>
  );
}
