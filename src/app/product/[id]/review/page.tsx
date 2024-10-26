"use client";

import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";
import { z, ZodFormattedError } from "zod";

const reviewSchema = z.object({
  prouctId: z.string({
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

type ErrorType = ZodFormattedError<z.infer<typeof reviewSchema>>;

export default function Page({ params: { id } }: { params: { id: string } }) {
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState({
    prouctId: id,
    rating: 0,
    name: "",
    reviewTitle: "",
    reviewDescription: "",
  });
  const [errors, setErrors] = useState<ErrorType>({
    _errors: [],
  });

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-secondary-foreground">
        <BackButton />
        Rate the Product
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = reviewSchema.safeParse(review);
          if (result.success) {
            setErrors({ _errors: [] });
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
            id="reviewDescription"
            className="min-h-20"
            value={review.reviewDescription}
            onChange={(e) =>
              setReview({ ...review, reviewDescription: e.target.value })
            }
          />
          <FormError error={errors.reviewDescription} />
        </FormGroup>
        <div className="flex justify-end py-4">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
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
