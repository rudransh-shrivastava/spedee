export type VariantType = {
  id: string;
  attributes: Record<string, string>;
  stock: number;
  image: string;
  priceInPaise: number;
  salePriceInPaise: number;
  otherImages: string[];
};

export default function useProductPath({
  variant,
  id,
}: {
  id: string;
  variant: VariantType;
}) {
  const productPageParams = new URLSearchParams();
  Object.keys(variant.attributes).forEach((key) => {
    productPageParams.set(key, variant.attributes[key]);
  });
  return `/product/${id}?${productPageParams.toString()}`;
}
