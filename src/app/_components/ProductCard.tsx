import { ProductType } from "@/models/Product";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useProductPath from "../product/[id]/_components/useProductPath";

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

  const variant = product.variants[0];

  const productPath = useProductPath({
    id: product.id,
    variant,
  });

  return (
    <div
      ref={elementRef}
      className={cn(
        "group flex w-full max-w-[19rem] flex-col border border-transparent p-4 transition-all duration-500 focus-within:border-border hover:border-border",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
    >
      <Link href={productPath}>
        <div className="group/link overflow-hidden p-0">
          <div className="relative mx-auto flex size-[17rem] items-center justify-center overflow-hidden">
            <Image
              src={variant.image}
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
            <span className="font-bold">&#8377;{variant.salePriceInPaise}</span>
            <span className="text-sm text-secondary-foreground line-through">
              &#8377;{variant.priceInPaise}
            </span>
          </div>
          <AddToCartButton product={product} variantId={variant.id} />
        </div>
        <Button variant="secondary" className="w-full" asChild>
          <Link href={`/product/${product.id}/checkout`}>Buy Now</Link>
        </Button>
      </div>
    </div>
  );
}
