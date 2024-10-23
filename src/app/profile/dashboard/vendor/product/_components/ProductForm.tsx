import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductType } from "@/models/Product";
import { FormEvent, useCallback, useRef, useState } from "react";
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

  const [product, setProduct] = useState<ProductType>({
    ...productProps,
    id: productProps.id || "",
    attributes: productProps.attributes || {},
  });

  const [productErrors, setErrors] = useState<productFormDataSchemaErrorType>({
    _errors: [],
  });

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("productId", product.id);
      formData.append("name", product.name);
      formData.append("description", product.description);
      const variantsArray = product.variants.map((variant) => ({
        attributes: JSON.stringify(variant.attributes),
        stock: variant.stock.toString(),
        image: variant.image ?? "",
      }));
      formData.append("variants", JSON.stringify(variantsArray));
      formData.append("attributes", JSON.stringify(product.attributes));
      console.log(product.attributes);
      // images
      if (imageInputRef.current?.files && otherImagesInputRef.current?.files) {
        formData.append("image", imageInputRef.current.files[0]);
        for (let i = 0; i < otherImagesInputRef.current.files.length; i++) {
          formData.append("otherImages", otherImagesInputRef.current.files[i]);
        }
      }
      // ^images
      formData.append("category", product.category);
      formData.append("bestSeller", product.bestSeller.toString());
      formData.append(
        "bestSellerPriority",
        product.bestSellerPriority.toString()
      );
      const validationResult = productFormDataSchema.safeParse(formData);
      console.log(validationResult);
      if (!validationResult.success) {
        const formattedErrors = validationResult.error.format();
        setErrors(formattedErrors);
      } else {
        setErrors({ _errors: [] });
        onSave(formData);
      }
    },
    [product, onSave]
  );

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const otherImagesInputRef = useRef<HTMLInputElement | null>(null);

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
            {productErrors.name && (
              <div className="col-start-2 text-destructive">
                name is required
              </div>
            )}
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
            {productErrors.description && (
              <div className="col-start-2 text-destructive">
                Description is required
              </div>
            )}
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
            {productErrors.bestSellerPriority && (
              <div className="col-start-2 text-destructive">
                Best Seller Priority is required
              </div>
            )}
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
            {productErrors.category && (
              <div className="col-start-2 text-destructive">
                Category is required
              </div>
            )}
          </FormGroup>
          <Variants
            attributesServer={attributesServer}
            variants={product.variants}
            setVariants={(variants) => {
              setProduct((p) => ({ ...p, variants }));
            }}
          />
          {/* <FormGroup>
            <Label>Price in Paise</Label>
            <Input
              value={product.priceInPaise || 0}
              onChange={(e) => {
                setProduct((p) => ({
                  ...p,
                  priceInPaise: parseInt(e.target.value)
                    ? parseInt(e.target.value)
                    : 0,
                }));
              }}
            />
            {productErrors.priceInPaise && (
              <div className="col-start-2 text-destructive">
                Price is required
              </div>
            )}
          </FormGroup> */}
          {/* <FormGroup>
            <Label>Sale Price in Paise</Label>
            <Input
              value={product.salePriceInPaise}
              onChange={(e) => {
                setProduct((p) => ({
                  ...p,
                  salePriceInPaise: parseInt(e.target.value)
                    ? parseInt(e.target.value)
                    : 0,
                }));
              }}
            />
          </FormGroup> */}
          {/* <FormGroup>
            <Label>Image</Label>
            <Input
              className="h-20"
              type="file"
              ref={imageInputRef}
              accept="image/*"
            />
            {productErrors.image && (
              <div className="col-start-2 text-destructive">
                Image is required
              </div>
            )}
          </FormGroup> */}
          {/* <FormGroup>
            <Label>Other Images</Label>
            <Input
              className="h-20"
              type="file"
              ref={otherImagesInputRef}
              accept="image/*"
              multiple
            />
            {productErrors.otherImages && (
              <div className="col-start-2 text-destructive">
                Other Images is required
              </div>
            )}
          </FormGroup> */}
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
