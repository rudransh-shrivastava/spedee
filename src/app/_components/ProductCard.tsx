import { ProductType } from "@/models/Product";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function ProductCard({
  product,
}: {
  product: ProductType & { id: string };
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={cn(
        "group flex w-full max-w-[19rem] flex-col border border-transparent p-4 transition-all duration-500 focus-within:border-border hover:border-border",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
    >
      <Link href={`/product/${product.id}`}>
        <div className="group/link overflow-hidden p-0">
          <div className="relative mx-auto flex size-[17rem] items-center justify-center overflow-hidden">
            <Image
              src={product.variants[0].image}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover object-top group-hover/link:object-contain group-hover/link:object-center"
            />
          </div>
          <div className="pt-2 font-medium group-hover/link:underline">
            {product.name}
          </div>
        </div>
      </Link>
      <div className="mt-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 py-4">
          <div className="flex items-center gap-2">
            <span className="font-bold">
              &#8377;{product.variants[0].salePriceInPaise}
            </span>
            <span className="text-sm text-secondary-foreground line-through">
              &#8377;{product.variants[0].priceInPaise}
            </span>
          </div>
          <AddToCartButton product={product} />
        </div>
        <Button variant="secondary" className="w-full" asChild>
          <Link href={`/product/${product.id}/checkout`}>Buy Now</Link>
        </Button>
      </div>
    </div>
  );
}
