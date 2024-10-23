import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductType, VariantType } from "@/models/Product";
import { FormEvent, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import Loader from "@/components/Loader";
import { Variants } from "./Variants";
import { Category } from "./Category";
import {
  productFormDataSchema,
  productFormDataSchemaErrorType,
} from "@/zod-schema/product-zod-schema";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/app/_data/queries";
import { LoadingData } from "@/components/LoadingData";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm({
  productProps,
  onSave,
  saving,
}: {
  productProps: ProductType & { id: string };
  onSave: (product: FormData) => void;
  saving: boolean;
}) {
  const { status: attributesStatus, data: attributesServer } = useQuery(
    queries.attributes
  );

  const [product, setProduct] = useState<
    ProductType & {
      variants: (ProductType["variants"][number] & { images: File[] })[];
    }
  >({
    ...productProps,
    id: productProps.id || "",
    variants: productProps.variants.map((variant) => ({
      ...variant,
      images: [] as File[],
    })),
    attributes: productProps.attributes || {},
  });

  const [productErrors, setErrors] = useState<productFormDataSchemaErrorType>({
    _errors: [],
  });

  const productToFormdata = useCallback(
    (
      product: ProductType & {
        variants: (ProductType["variants"][number] & { images: File[] })[];
      }
    ) => {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("productId", product.id);
      formData.append("description", product.description);
      formData.append("bestSeller", product.bestSeller.toString());
      formData.append(
        "bestSellerPriority",
        product.bestSellerPriority.toString()
      );
      formData.append("category", product.category);
      formData.append("attributes", JSON.stringify(product.attributes));

      product.variants.forEach(
        (variant: VariantType & { images: File[] }, index) => {
          formData.append(
            `variants[${index}].attributes`,
            JSON.stringify(variant.attributes)
          );
          formData.append(`variants[${index}].stock`, variant.stock.toString());
          formData.append(
            `variants[${index}].priceInPaise`,
            variant.priceInPaise.toString()
          );
          formData.append(
            `variants[${index}].salePriceInPaise`,
            variant.salePriceInPaise.toString()
          );
          formData.append(`variants[${index}].image`, variant.images[0]);
        }
      );
      return formData;
    },
    []
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = productToFormdata(product);
      const validationResult = productFormDataSchema.safeParse(formData);
      if (!validationResult.success) {
        const formattedErrors = validationResult.error.format();
        setErrors(formattedErrors);
      } else {
        setErrors({ _errors: [] });
        onSave(formData);
      }
    },
    [product, productToFormdata, onSave]
  );

  const updateAttributes = useCallback(
    (attributes: ProductType["attributes"]) => {
      setProduct((p) => ({ ...p, attributes }));
    },
    []
  );

  return (
    <LoadingData status={attributesStatus}>
      {attributesServer ? (
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name</Label>
            <Input
              value={product.name}
              onChange={(e) => {
                setProduct((p) => ({ ...p, name: e.target.value }));
              }}
            />
            <FormError error={productErrors.name} />
          </FormGroup>
          <FormGroup>
            <Label>Description</Label>
            <Textarea
              className="h-20"
              value={product.description}
              onChange={(e) => {
                setProduct((p) => ({ ...p, description: e.target.value }));
              }}
            />
            <FormError error={productErrors.description} />
          </FormGroup>
          <FormGroup>
            <Label>Best Seller Priority</Label>
            <div className="flex items-center gap-8">
              <Switch
                checked={product.bestSeller}
                onCheckedChange={(e) => {
                  setProduct((p) => ({
                    ...p,
                    bestSeller: e.valueOf(),
                  }));
                }}
              />
              <Input
                value={product.bestSellerPriority}
                disabled={!product.bestSeller}
                className="w-full max-w-[200px]"
                onChange={(e) => {
                  setProduct((p) => ({
                    ...p,
                    bestSellerPriority: parseInt(e.target.value)
                      ? parseInt(e.target.value)
                      : 0,
                  }));
                }}
              />
            </div>
            <FormError error={productErrors.bestSellerPriority} />
          </FormGroup>
          <FormGroup>
            <Label>Category</Label>
            <div>
              <Category
                value={product.category}
                setValue={(category) => {
                  setProduct((p) => ({
                    ...p,
                    category,
                  }));
                }}
              />
            </div>
            <FormError error={productErrors.category} />
          </FormGroup>
          <Variants
            updateAttributes={updateAttributes}
            attributesServer={attributesServer}
            variants={product.variants}
            setVariants={(variants) => {
              setProduct((p) => ({ ...p, variants }));
            }}
            productErrors={productErrors}
          />
          <FormError error={productErrors} />
          <div className="flex justify-end py-2">
            <Button
              type="submit"
              disabled={saving}
              className={cn(saving ? "disabled:opacity-100" : "")}
            >
              <span className={cn(saving ? "text-transparent" : "")}>Save</span>
              {saving && <Loader className="absolute size-6" />}
            </Button>
          </div>
        </form>
      ) : (
        ""
      )}
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

function FormError({ error }: { error?: { _errors: string[] } | undefined }) {
  return error ? (
    <div className="col-start-2 text-destructive">{error._errors[0]}</div>
  ) : (
    ""
  );
}
