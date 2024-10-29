import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type VariantType = {
  id: string;
  attributes: Record<string, string>;
  stock: number;
  image: string;
  priceInPaise: number;
  salePriceInPaise: number;
  otherImages: string[];
};

export function ProductVariants({
  attributes,
  variants,
  currentVariant,
}: {
  attributes: Record<string, string[]>;
  variants: VariantType[];
  currentVariant: VariantType;
}) {
  const doesProductVariantExist = useCallback(
    (attributeValues: Record<string, string>) => {
      return variants.some((variant) => {
        return Object.keys(attributeValues).every((key) => {
          return variant.attributes[key] === attributeValues[key];
        });
      });
    },
    [variants]
  );

  let checkedAttributes: { [key: string]: string } = {};

  const searchParams = useSearchParams();
  const pathName = usePathname();

  return Object.keys(attributes).map((attribute, attributeIndex) => {
    if (currentVariant.attributes[attribute]) {
      checkedAttributes = {
        ...checkedAttributes,
        [attribute]: currentVariant.attributes[attribute],
      };
    }

    return (
      <div key={attributeIndex}>
        <div className="text-xl font-bold text-secondary-foreground">
          Select {attribute}
        </div>
        <div className="flex gap-2 py-2">
          {attributes[attribute].map((attbValue, attbValueIndex) => {
            const currentCheckedAttributes = {
              ...checkedAttributes,
              [attribute]: attbValue,
            };

            let variantLink = "";
            const variantDoesntExist = !doesProductVariantExist(
              currentCheckedAttributes
            );
            if (!variantDoesntExist) {
              const checkedAttributesAndCurrentAttributes = {
                ...currentVariant.attributes,
                ...currentCheckedAttributes,
              };
              // try to get a variant with current selected attributes + the attribute we clicked
              let variant = variants.find((variant) => {
                return Object.keys(checkedAttributesAndCurrentAttributes).every(
                  (key) => {
                    return (
                      variant.attributes[key] ===
                      checkedAttributesAndCurrentAttributes[key]
                    );
                  }
                );
              });
              if (!variant) {
                // just get any variant with the attribute we clicked and attributes above it
                variant = variants.find((variant) => {
                  return Object.keys(currentCheckedAttributes).every((key) => {
                    return (
                      variant.attributes[key] === currentCheckedAttributes[key]
                    );
                  });
                });
              }

              const currentParams = new URLSearchParams(
                searchParams.toString()
              );
              if (variant) {
                Object.keys(variant.attributes).forEach((key) => {
                  currentParams.set(key, variant.attributes[key]);
                });
                variantLink = `${pathName}?${currentParams.toString()}`;
              }
            }

            return (
              <Link
                href={variantLink || "#"}
                key={attbValueIndex}
                onClick={() => {}}
                className={cn(
                  "flex size-16 cursor-pointer items-center justify-center rounded-full border",
                  {
                    "cursor-not-allowed opacity-50": variantDoesntExist,
                    "border-primary":
                      currentVariant.attributes[attribute] === attbValue,
                  }
                )}
              >
                {attbValue}
              </Link>
            );
          })}
        </div>
      </div>
    );
  });
}
