import { queries } from "@/app/_data/queries";
import { LoadingData } from "@/components/LoadingData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z, ZodFormattedError } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CouponZodSchema = z.object({
  code: z.string(),
  discount: z.number(),
  discountType: z.enum(["percentage", "fixed", "delivery-free"], {
    message: "Discount Type is required",
  }),
  productIds: z.array(z.string()),
  categoryIds: z.array(z.string()),
  isActive: z.boolean(),
});

type CouponErrorsType = ZodFormattedError<z.infer<typeof CouponZodSchema>>;

export default function Coupons() {
  const { data: products, status: productStatus } = useQuery({
    ...queries.filteredProducts(""),
  });

  const [couponData, setCouponData] = useState<{
    code: string;
    discount: number;
    discountType: "percentage" | "fixed" | "delivery-free" | "";
    productIds: string[];
    categoryIds: string[];
    isActive: boolean;
  }>({
    code: "",
    discount: 0,
    discountType: "",
    productIds: [],
    categoryIds: [],
    isActive: false,
  });

  const [couponErrors, setCouponErrors] = useState<CouponErrorsType>({
    _errors: [],
  });

  return (
    <LoadingData status={productStatus}>
      <h2 className="mb-4 px-4 text-xl font-medium text-secondary-foreground">
        Attributes
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = CouponZodSchema.safeParse(couponData);
          if (result.success) {
            setCouponErrors({ _errors: [] });
          } else {
            setCouponErrors(result.error.format());
          }
        }}
      >
        <pre>
          <code className="text-destructive">
            {JSON.stringify(couponErrors, null, 2)}
          </code>
        </pre>
        <div>
          <FormGroup>
            <Label>Code</Label>
            <Input
              value={couponData.code}
              onChange={(e) =>
                setCouponData({ ...couponData, code: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label>Code</Label>
            <Input
              value={couponData.discount}
              onChange={(e) =>
                setCouponData({
                  ...couponData,
                  discount: parseFloat(e.target.value),
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Discount Type</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Discount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="delivery-free">Delivery Free</SelectItem>
              </SelectContent>
            </Select>
          </FormGroup>
        </div>
        <div className="flex justify-end">
          <Button>Save</Button>
        </div>
      </form>
    </LoadingData>
  );
}

function FormGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid items-center gap-1 py-2 md:grid-cols-[25ch,1fr] md:gap-x-4">
      {children}
    </div>
  );
}

function FormError({ error }: { error: { _errors: string[] } | undefined }) {
  return error ? (
    <div className="col-start-2 text-sm text-destructive">
      {error._errors[0]}
    </div>
  ) : (
    ""
  );
}
