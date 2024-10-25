"use client";

import { ProductCard } from "@/app/_components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { queries } from "../_data/queries";
import { LoadingData } from "@/components/LoadingData";

export default function Page() {
  const { data: products, status: productStatus } = useQuery({
    ...queries.filteredProducts(""),
  });
  return (
    <div className="grid grid-cols-[19rem,auto] gap-4">
      <div className="border"></div>
      <div className="flex flex-wrap justify-center gap-2 py-4 sm:justify-center xl:justify-start">
        <LoadingData status={productStatus}>
          {products &&
            products.map((product, productIndex) => (
              <ProductCard product={product} key={productIndex} />
            ))}
        </LoadingData>
      </div>
    </div>
  );
}
