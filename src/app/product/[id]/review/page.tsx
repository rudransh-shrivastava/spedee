"use client";

import { mutations } from "@/app/_data/mutations";
import { queries } from "@/app/_data/queries";
import BackButton from "@/components/BackButton";
import Loader from "@/components/Loader";
import { LoadingData } from "@/components/LoadingData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z, ZodFormattedError } from "zod";

const reviewZodSchema = z.object({
  productId: z.string({
    required_error: "Product ID is required.",
    invalid_type_error: "Product ID must be a string.",
  }),
  rating: z
    .number()
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must be at most 5.")
    .refine((val) => Number.isInteger(val), "Rating must be an integer."),
  name: z.string().min(3, "Name must be at least 3 characters long."),
  reviewTitle: z
    .string()
    .min(3, "Review title must be at least 3 characters long."),
  reviewDescription: z
    .string()
    .min(10, "Review description must be at least 10 characters long."),
});

type ErrorType = ZodFormattedError<z.infer<typeof reviewZodSchema>>;

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { data, status } = useQuery(queries.isPurchased(id));

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-secondary-foreground">
        <BackButton />
        Rate the Product
      </h1>
      <LoadingData status={status}>
        {data && !data.purchased ? (
          <ReviewForm productId={id} />
        ) : (
          <div className="py-2 pl-12 text-lg text-secondary-foreground">
            Please Purhase The Product first
          </div>
        )}
      </LoadingData>
    </div>
  );
}

function ReviewForm({ productId }: { productId: string }) {
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState({
    productId: productId,
    rating: 0,
    name: "",
    reviewTitle: "",
    reviewDescription: "",
  });
  const [errors, setErrors] = useState<ErrorType>({
    _errors: [],
  });

  const postReviewMutation = useMutation(mutations.postReview);
  const queryClient = useQueryClient();
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const result = reviewZodSchema.safeParse(review);
        if (result.success) {
          setErrors({ _errors: [] });
          postReviewMutation.mutate(review, {
            onSuccess: () => {
              setReview({
                productId: productId,
                rating: 0,
                name: "",
                reviewTitle: "",
                reviewDescription: "",
              });
              queryClient.invalidateQueries({
                queryKey: queries.reviews(productId).queryKey,
              });
              router.back();
            },
          });
        } else {
          setErrors(result.error.format());
        }
      }}
    >
      <div className="flex flex-col pb-4 pl-10">
        <div className="flex py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex items-center gap-1 hover:bg-transparent"
              size="icon"
              disabled={postReviewMutation.isPending}
              onMouseOver={() => setStars(index + 1)}
              onMouseLeave={() => setStars(review.rating)}
              onClick={(e) => {
                e.preventDefault();
                setReview({ ...review, rating: index + 1 });
              }}
            >
              <Star
                strokeWidth={1.5}
                className={cn(
                  "stroke-primary",
                  index < stars ? "fill-primary" : "fill-transparent"
                )}
              />
            </Button>
          ))}
        </div>
        <FormError error={errors.rating} className="pl-3" />
      </div>
      <FormGroup>
        <Label className="flex h-9 items-center" htmlFor="name">
          Name
        </Label>
        <Input
          type="text"
          id="name"
          disabled={postReviewMutation.isPending}
          value={review.name}
          onChange={(e) => setReview({ ...review, name: e.target.value })}
        />
        <FormError error={errors.name} />
      </FormGroup>
      <FormGroup>
        <Label className="flex h-9 items-center" htmlFor="reviewTitle">
          Review Title
        </Label>
        <Input
          type="text"
          id="reviewTitle"
          disabled={postReviewMutation.isPending}
          value={review.reviewTitle}
          onChange={(e) =>
            setReview({ ...review, reviewTitle: e.target.value })
          }
        />
        <FormError error={errors.reviewTitle} />
      </FormGroup>
      <FormGroup>
        <Label className="flex h-9 items-center" htmlFor="reviewDescription">
          Review Description
        </Label>
        <Textarea
          className="min-h-20"
          id="reviewDescription"
          disabled={postReviewMutation.isPending}
          value={review.reviewDescription}
          onChange={(e) =>
            setReview({ ...review, reviewDescription: e.target.value })
          }
        />
        <FormError error={errors.reviewDescription} />
      </FormGroup>
      <div className="flex justify-end py-4">
        <Button type="submit" disabled={postReviewMutation.isPending}>
          <span className={cn({ "opacity-0": postReviewMutation.isPending })}>
            Submit
          </span>
          {postReviewMutation.isPending && (
            <Loader className="absolute size-6" />
          )}
        </Button>
      </div>
    </form>
  );
}

function FormGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2 md:grid-cols-[25ch,1fr] md:gap-x-4">
      {children}
    </div>
  );
}

function FormError({
  error,
  className,
}: {
  error: { _errors: string[] } | undefined;
  className?: string;
}) {
  return error ? (
    <div className={cn("col-start-2 text-sm text-destructive", className)}>
      {error._errors[0]}
    </div>
  ) : (
    ""
  );
}
