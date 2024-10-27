"use client";

import { queries } from "@/app/_data/queries";
import { AddToCartButton } from "@/components/AddToCartButton";
import { LoadingData } from "@/components/LoadingData";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ProductType, VariantType } from "@/models/Product";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronRight,
  CopyIcon,
  Share2,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BackButton from "@/components/BackButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { status: productStatus, data: product } = useQuery(
    queries.product(id)
  );
  return (
    <LoadingData status={[productStatus]}>
      {product && <ProductComponent product={product} />}
    </LoadingData>
  );
}

function ProductComponent({ product }: { product: ProductType }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateVariantURLParams = useCallback(
    (variant: VariantType) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.keys(variant.attributes).forEach((key) => {
        currentParams.set(key, variant.attributes[key]);
      });
      router.push(`${pathname}?${currentParams.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const getVariantFromURLParams = useCallback(() => {
    const matchedVariant = product.variants.find((variant) => {
      const attributes = variant.attributes;
      return Object.keys(product.attributes).every((key) => {
        return attributes[key] === searchParams.get(key);
      });
    });
    if (matchedVariant) return matchedVariant;
    return null;
  }, [product, searchParams]);

  const [currentVariant, setCurrentVariant] = useState<VariantType>(
    product.variants[0]
  );

  const switchVariant = useCallback(
    (variant: VariantType) => {
      updateVariantURLParams(variant);
    },
    [updateVariantURLParams]
  );

  useEffect(() => {
    let variant = getVariantFromURLParams();
    if (!variant) {
      variant = product.variants[0];
      updateVariantURLParams(variant);
    }
    setCurrentVariant(variant);
    setCurrentProductImage(variant.image);
  }, [
    searchParams,
    getVariantFromURLParams,
    product.variants,
    updateVariantURLParams,
  ]);

  const [currentProductImage, setCurrentProductImage] = useState(
    currentVariant.image
  );

  return (
    <div className="grid grid-cols-[34rem,auto] gap-4">
      <div className="col-span-2 flex items-center gap-2 text-sm text-secondary-foreground">
        <BackButton />
        Home <ChevronRight className="size-4" />
        {product.category}
      </div>
      <div className="sticky top-24 h-max">
        <div className="flex gap-4">
          <div className="py-8">
            <Carousel orientation="vertical">
              <CarouselPrevious
                className="-top-14 h-20 w-8 rounded-none border-none p-0"
                variant="ghost"
              />
              <CarouselContent className="mt-0 max-h-[calc(28rem-4rem)]">
                <CarouselItem>
                  <ProductImageCard
                    alt={product.name}
                    url={currentVariant.image}
                    className={
                      currentVariant.image === currentProductImage
                        ? "border-primary"
                        : ""
                    }
                    onMouseOver={() => {
                      setCurrentProductImage(currentVariant.image);
                    }}
                  />
                </CarouselItem>

                {currentVariant.otherImages.map((otherImage, index) => {
                  return (
                    <CarouselItem key={index}>
                      <ProductImageCard
                        alt={product.name}
                        url={otherImage}
                        className={
                          otherImage === currentProductImage
                            ? "border-primary"
                            : ""
                        }
                        onMouseOver={() => {
                          setCurrentProductImage(otherImage);
                        }}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselNext
                className="-bottom-14 h-20 w-8 rounded-none p-0"
                variant="ghost"
              />
            </Carousel>
          </div>
          <div className="relative size-[28rem] overflow-hidden bg-secondary">
            <Image
              src={currentProductImage}
              width={500}
              height={500}
              alt={product.name}
              className="absolute block size-full object-contain object-center"
            />
          </div>
        </div>
        <div className="flex gap-2 py-4">
          <AddToCartButton
            product={product}
            variantId={currentVariant.id}
            className="h-10 w-full"
          />
          <Button className="h-10 w-full" asChild>
            <Link href={`/product/${product.id}/checkout`}>Buy Now</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-2 p-4 pt-0">
        <h1 className="flex justify-between gap-2 text-3xl font-bold text-secondary-foreground">
          {product.name}
          <ShareDialog
            productName={product.name}
            productLink={window.location.href}
          />
        </h1>
        <ProductPrice
          price={currentVariant.priceInPaise}
          salePrice={currentVariant.salePriceInPaise}
        />
        <p className="font-medium text-secondary-foreground">
          {product?.description}
        </p>
        <ProductVariants
          switchVariant={switchVariant}
          attributes={product.attributes}
          variants={product.variants}
          currentVariant={currentVariant}
        />
        <RatingsAndReviews productId={product.id} />
      </div>
    </div>
  );
}

function ProductImageCard({
  url,
  alt,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  url: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-20 shrink-0 overflow-hidden border-2 transition-colors",
        className
      )}
      {...props}
    >
      <Image
        src={url}
        width={500}
        height={500}
        className="size-20 object-contain object-center"
        alt={alt}
      />
    </div>
  );
}

function ProductPrice({
  price,
  salePrice,
}: {
  price: number;
  salePrice: number;
}) {
  const isSale = price > salePrice;
  return (
    <>
      {isSale && <div className="text-green-500">Special Price in Sale</div>}
      <div
        className={cn(
          "flex items-end gap-2",
          isSale ? "grid-cols-[1fr,auto]" : ""
        )}
      >
        {isSale && (
          <span className="relative inline-block text-2xl font-semibold text-secondary-foreground">
            &#8377;{salePrice}
          </span>
        )}
        <span
          className={cn(
            "relative inline-block px-1 text-2xl font-bold text-foreground",
            isSale ? "text-lg opacity-75" : ""
          )}
        >
          {isSale && (
            <span
              className={cn(
                "absolute left-0 top-[calc(50%-1px)] block h-[1.5px] w-[0%] bg-current",
                isSale ? "w-full" : ""
              )}
            ></span>
          )}
          &#8377;{price}
        </span>
      </div>
    </>
  );
}

function ProductVariants({
  attributes,
  variants,
  currentVariant,
  switchVariant,
}: {
  attributes: Record<string, string[]>;
  variants: VariantType[];
  currentVariant: VariantType;
  switchVariant: (variant: VariantType) => void;
}) {
  const doesProductVariantExist = useCallback(
    (attributeValues: Record<string, string>) => {
      return variants.some((variant) => {
        const x = Object.keys(attributeValues).every((key) => {
          return variant.attributes[key] === attributeValues[key];
        });
        return x;
      });
    },
    [variants]
  );

  let checkedAttributes: { [key: string]: string } = {};

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
            const variantExists = !doesProductVariantExist(
              currentCheckedAttributes
            );
            return (
              <div
                key={attbValueIndex}
                onClick={() => {
                  if (variantExists) return;
                  const checkedAttributesAndCurrentAttributes = {
                    ...currentVariant.attributes,
                    ...currentCheckedAttributes,
                  };
                  // try to get a variant with current selected attributes + the attribute we clicked
                  let varaint = variants.find((variant) => {
                    return Object.keys(
                      checkedAttributesAndCurrentAttributes
                    ).every((key) => {
                      return (
                        variant.attributes[key] ===
                        checkedAttributesAndCurrentAttributes[key]
                      );
                    });
                  });
                  if (!varaint) {
                    // just get any variant with the attribute we clicked and attributes above it
                    varaint = variants.find((variant) => {
                      return Object.keys(currentCheckedAttributes).every(
                        (key) => {
                          return (
                            variant.attributes[key] ===
                            currentCheckedAttributes[key]
                          );
                        }
                      );
                    });
                  }
                  switchVariant(varaint || currentVariant);
                }}
                className={cn(
                  "flex size-16 cursor-pointer items-center justify-center rounded-full border",
                  {
                    "cursor-not-allowed opacity-50": variantExists,
                    "border-primary":
                      currentVariant.attributes[attribute] === attbValue,
                  }
                )}
              >
                {attbValue}
              </div>
            );
          })}
        </div>
      </div>
    );
  });
}

function RatingsAndReviews({ productId }: { productId: string }) {
  return (
    <div className="pt-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-secondary-foreground">
          Ratings and Reviews
        </div>
        <Button variant="secondary" asChild>
          <Link href={`/product/${productId}/review`}>Rate</Link>
        </Button>
      </div>
      <div className="flex items-center p-4">
        <div className="flex w-max min-w-40 flex-col items-center gap-4 border-r-2 p-4">
          <div className="flex items-center gap-2 text-secondary-foreground">
            <span className="text-4xl">4.6</span>
            <Star fill="currentColor" className="size-8 text-primary" />
          </div>
          <span className="text-center">10,756 Ratings</span>
        </div>
        <div className="w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="flex w-full items-center gap-2 p-1 px-4" key={i}>
              <div className="flex items-center gap-1">
                <span>{i + 1}</span>
                <Star className="size-4" />
              </div>
              <div className="w-full">
                <Progress value={10 + i * 5} className="rounded-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="border-t p-4" key={i}>
              <div className="flex items-center gap-2">
                <div className="flex w-max items-center gap-1 bg-secondary px-3 py-1">
                  <span>4</span>
                  <Star className="size-4" />
                </div>
                <span className="font-semibold text-secondary-foreground">
                  Best product I have ever seen
                </span>
              </div>
              <div className="pt-2">
                Best product I have ever seen or will ever use buy it asap
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-foreground">
                  A random name you will not remember
                </span>
                <div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ThumbsUp className="size-5" strokeWidth={1.5} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ThumbsDown className="size-5" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShareDialog({
  productName,
  productLink,
}: {
  productName: string;
  productLink: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
          <Share2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Share {productName}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={productLink} readOnly />
          </div>
          <Button
            type="submit"
            size="icon"
            onClick={() => {
              navigator.clipboard
                .writeText(productLink)
                .then(() => {
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 5000);
                })
                .catch((err) => {
                  console.error("Failed to copy: ", err);
                });
            }}
          >
            <span className="sr-only">Copy</span>
            {copied ? (
              <Check className="size-5" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
