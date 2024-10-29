"use client";

import { PaginatedData, queries } from "@/app/_data/queries";
import { AddToCartButton } from "@/components/AddToCartButton";
import { LoadingData } from "@/components/LoadingData";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ProductType, VariantType } from "@/models/Product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CopyIcon,
  Share2,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
import { ReviewType } from "@/models/Review";
import axios from "axios";

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

  const currentVariant = getVariantFromURLParams() || product.variants[0];

  useEffect(() => {
    setCurrentProductImage(currentVariant.image);
  }, [currentVariant]);

  const reviewPageParam = searchParams.get("reviewPage");
  const reviewPage = reviewPageParam ? parseInt(reviewPageParam) : 1;
  const { data: reviewData, status: reviewsStatus } = useQuery(
    queries.reviews(product.id, reviewPage)
  );

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
          attributes={product.attributes}
          variants={product.variants}
          currentVariant={currentVariant}
        />
        <LoadingData status={reviewsStatus}>
          {reviewData && (
            <RatingsAndReviews
              reviewPage={reviewPage}
              productId={product.id}
              reviews={reviewData}
            />
          )}
        </LoadingData>
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
}: {
  attributes: Record<string, string[]>;
  variants: VariantType[];
  currentVariant: VariantType;
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

function RatingsAndReviews({
  productId,
  reviews: { data: reviews, stats },
  reviewPage,
}: {
  productId: string;
  reviews: {
    data: PaginatedData<ReviewType>;
    stats: {
      totalRatings: number;
      averageRating: number;
      ratings: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
      };
    };
  };
  reviewPage: number;
}) {
  const queryClient = useQueryClient();

  const updateReview = useCallback(
    (id: string, cb: (prevReview: ReviewType) => ReviewType) => {
      queryClient.setQueryData(
        queries.reviews(productId, reviewPage).queryKey,
        (prev: {
          data: PaginatedData<ReviewType>;
          stats: {
            totalRatings: number;
            averageRating: number;
            ratings: {
              1: number;
              2: number;
              3: number;
              4: number;
              5: number;
            };
          };
        }) => {
          return {
            ...prev,
            data: {
              ...prev.data,
              results: prev.data.results.map((r) => {
                if (r.id !== id) return r;
                return cb(r);
              }),
            },
          };
        }
      );
    },
    [queryClient, productId, reviewPage]
  );

  const reactReview = useCallback(
    (id: string, reaction: "like" | "dislike") => {
      updateReview(id, (prevReview) => {
        let newR = { ...prevReview };
        switch (reaction) {
          case "like":
            newR = { ...newR, likeCount: newR.likeCount + 1, isLiked: true };
            if (newR.isDisliked) {
              newR = {
                ...newR,
                dislikeCount: newR.dislikeCount - 1,
                isDisliked: false,
              };
            }
            break;
          case "dislike":
            newR = {
              ...newR,
              dislikeCount: newR.dislikeCount + 1,
              isDisliked: true,
            };
            if (newR.isLiked) {
              newR = {
                ...newR,
                likeCount: newR.likeCount - 1,
                isLiked: false,
              };
            }
        }
        return newR;
      });
    },
    [updateReview]
  );

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const currentParams = new URLSearchParams(searchParams.toString());
  let nextPageLink = "";
  let previousPageLink = "";
  if (reviews.next) {
    currentParams.set("reviewPage", reviews.next.page.toString());
    nextPageLink = `${pathName}?${currentParams.toString()}`;
  }
  if (reviews.previous) {
    currentParams.set("reviewPage", reviews.previous.page.toString());
    previousPageLink = `${pathName}?${currentParams.toString()}`;
  }

  return (
    <div className="scroll-m-20 pt-4" id="reviews">
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
            <span className="text-4xl">{stats.averageRating}</span>
            <Star fill="currentColor" className="size-8 text-primary" />
          </div>
          <span className="text-center">{stats.totalRatings} Ratings</span>
        </div>
        <div className="grid w-full grid-cols-[2rem,auto,max-content] items-center gap-2 p-1 px-4">
          {Object.entries(stats.ratings).map(([rating, ratingValue], i) => (
            <RatingProgressBar
              key={i}
              rating={rating}
              ratingValue={ratingValue}
              totalRatings={stats.totalRatings}
            />
          ))}
        </div>
      </div>

      <div>
        {reviews.results.map((review, i) => (
          <ReviewCard key={i} review={review} reactReview={reactReview} />
        ))}
        <div className="flex w-full items-center py-2">
          {previousPageLink && (
            <Button variant="outline" className="gap-1 pl-1" asChild>
              <Link href={previousPageLink + "#reviews"}>
                <ChevronLeft />
                <span>Previous</span>
              </Link>
            </Button>
          )}
          <div className="mx-auto">Page {reviewPage}</div>
          {nextPageLink && (
            <Button variant="outline" className="gap-1 pr-1" asChild>
              <Link href={nextPageLink + "#reviews"}>
                <span>Next</span>
                <ChevronRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function RatingProgressBar({
  rating,
  ratingValue,
  totalRatings,
}: {
  rating: string;
  ratingValue: number;
  totalRatings: number;
}) {
  return (
    <>
      <div className="flex items-center gap-1">
        <span>{rating}</span>
        <Star className="size-4" />
      </div>
      <Progress
        value={(100 * ratingValue) / totalRatings}
        className="rounded-none"
      />
      <span>{ratingValue}</span>
    </>
  );
}

function ReviewCard({
  review,
  reactReview,
}: {
  review: ReviewType;
  reactReview: (id: string, reaction: "like" | "dislike") => void;
}) {
  const likeReviewMutation = useMutation({
    mutationFn: (reviewId: string) => {
      return axios.post(`/api/v1/review/like`, { reviewId });
    },
  });

  const disLikeReviewMutation = useMutation({
    mutationFn: (reviewId: string) => {
      return axios.post(`/api/v1/review/dislike`, { reviewId });
    },
  });

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        <div className="flex w-max items-center gap-1 bg-secondary px-3 py-1">
          <span>{review.rating}</span>
          <Star className="size-4" />
        </div>
        <span className="font-semibold text-secondary-foreground">
          {review.reviewTitle}
        </span>
      </div>
      <div className="pt-2">{review.reviewDescription}</div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondary-foreground">{review.name}</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={
              review.isLiked ||
              likeReviewMutation.isPending ||
              disLikeReviewMutation.isPending
            }
            className={cn("w-auto min-w-9 gap-1 px-2", {
              "disabled:opacity-100": review.isLiked,
            })}
            onClick={() => {
              likeReviewMutation.mutate(review.id);
              reactReview(review.id, "like");
            }}
          >
            <ThumbsUp
              className={cn("size-5 shrink-0 stroke-secondary-foreground", {
                "fill-primary stroke-primary": review.isLiked,
              })}
              strokeWidth={1.5}
            />
            <span className="">{review.likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={
              review.isDisliked ||
              likeReviewMutation.isPending ||
              disLikeReviewMutation.isPending
            }
            className={cn("w-auto min-w-9 gap-1 px-2", {
              "disabled:opacity-100": review.isDisliked,
            })}
            onClick={() => {
              disLikeReviewMutation.mutate(review.id);
              reactReview(review.id, "dislike");
            }}
          >
            <ThumbsDown
              className={cn("size-5 shrink-0 stroke-secondary-foreground", {
                "fill-primary stroke-primary": review.isDisliked,
              })}
              strokeWidth={1.5}
            />
            <span className="">{review.dislikeCount}</span>
          </Button>
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
