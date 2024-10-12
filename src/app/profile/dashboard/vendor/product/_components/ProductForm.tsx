import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductType } from "@/models/Product";
import { useRef, useState } from "react";
import {
  ProductSchema,
  ProductSchemaFormattedError,
} from "@/zod-schema/product-schema";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import Loader from "@/components/Loader";
import { Variants } from "./Variants";
// import { productFormDataSchema } from "@/zod-schema/product-zod-schema";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Category } from "./Category";
import { productFormDataSchema } from "@/zod-schema/product-zod-schema";

export function ProductForm({
  productProps,
  onSave,
  saving,
}: {
  productProps: ProductType & { id: string };
  onSave: (product: FormData) => void;
  saving: boolean;
}) {
  const [product, setProduct] = useState<ProductType>({
    ...productProps,
    id: productProps.id || "",
    attributes: productProps.attributes || {},
  });
  const [productErrors, setErrors] = useState<ProductSchemaFormattedError>({
    _errors: [],
  });
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const otherImagesInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // const validationResult = ProductSchema.safeParse(product);
        // if (!validationResult.success) {
        //   const formattedErrors = validationResult.error.format();
        //   setErrors(formattedErrors);
        // } else {
        // setErrors({ _errors: [] });

        // TODO: convert to the better one(simplify)
        const formData = new FormData();
        formData.append("productId", product.id);
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("priceInPaise", product.priceInPaise.toString());
        formData.append(
          "salePriceInPaise",
          product.salePriceInPaise.toString()
        );
        formData.append("attributes", JSON.stringify(product.attributes));
        // images
        if (
          imageInputRef.current?.files &&
          otherImagesInputRef.current?.files
        ) {
          formData.append("image", imageInputRef.current.files[0]);
          for (let i = 0; i < otherImagesInputRef.current.files.length; i++) {
            formData.append(
              "otherImages",
              otherImagesInputRef.current.files[i]
            );
          }
        }
        // ^images
        formData.append("category", product.category);
        formData.append("stock", product.stock.toString());
        formData.append("bestSeller", product.bestSeller.toString());
        formData.append(
          "bestSellerPriority",
          product.bestSellerPriority.toString()
        );
        const validationResult = productFormDataSchema.safeParse(formData);
        if (!validationResult.success) {
          const formattedErrors = validationResult.error.format();
          setErrors(formattedErrors);
        } else {
          setErrors({ _errors: [] });
          onSave(formData);
        }
        // const validationResult = productFormDataSchema.safeParse(product);
        // if (!validationResult.success) {
        //   const formattedErrors = validationResult.error.format();
        //   setErrors(formattedErrors);
        // } else {
        //   setErrors({ _errors: [] });
        // }
        // console.log(validationResult.error?.format());

        // onSave(formData);
        // } i commented this
      }}
    >
      <FormGroup>
        <Label>Name</Label>
        <Input
          value={product.name}
          onChange={(e) => {
            setProduct((p) => ({ ...p, name: e.target.value }));
          }}
        />
        {productErrors.name && (
          <div className="col-start-2 text-destructive">name is required</div>
        )}
      </FormGroup>
      <FormGroup>
        <Label>Description</Label>
        <Input
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
        <Label>Variants</Label>
        <Variants
          variants={product.variants}
          setVariants={(variants) => {
            setProduct((p) => ({ ...p, variants }));
          }}
        />
      </FormGroup>
      <FormGroup>
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
          <div className="col-start-2 text-destructive">Price is required</div>
        )}
      </FormGroup>
      <FormGroup>
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
      </FormGroup>
      <FormGroup>
        <Label>Image</Label>
        <Input
          className="h-20"
          type="file"
          ref={imageInputRef}
          accept="image/*"
        />
        {productErrors.image && (
          <div className="col-start-2 text-destructive">Image is required</div>
        )}
      </FormGroup>
      <FormGroup>
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
      </FormGroup>
      <FormGroup>
        <Label>Category</Label>
        {/* <Input
          value={product.category}
          onChange={(e) => {
            setProduct((p) => ({ ...p, category: e.target.value }));
          }}
        /> */}
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
      <FormGroup>
        <Label>Stock</Label>
        <Input
          value={product.stock}
          onChange={(e) => {
            setProduct((p) => ({
              ...p,
              stock: parseInt(e.target.value) ? parseInt(e.target.value) : 0,
            }));
          }}
        />
        {productErrors.stock && (
          <div className="col-start-2 text-destructive">Stock is required</div>
        )}
      </FormGroup>
      <FormGroup>
        <Label>Best Seller</Label>
        <Switch
          checked={product.bestSeller}
          onCheckedChange={(e) => {
            setProduct((p) => ({
              ...p,
              bestSeller: e.valueOf(),
            }));
          }}
        />
        {productErrors.bestSeller && (
          <div className="col-start-2 text-destructive">
            Best Seller is required
          </div>
        )}
      </FormGroup>
      <FormGroup>
        <Label>Best Seller Priority</Label>
        <Input
          value={product.bestSellerPriority}
          onChange={(e) => {
            setProduct((p) => ({
              ...p,
              bestSellerPriority: parseInt(e.target.value)
                ? parseInt(e.target.value)
                : 0,
            }));
          }}
        />
        {productErrors.bestSellerPriority && (
          <div className="col-start-2 text-destructive">
            Best Seller Priority is required
          </div>
        )}
      </FormGroup>
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
  );
}

function FormGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid items-center gap-1 py-2 md:grid-cols-[25ch,1fr] md:gap-x-4">
      {children}
    </div>
  );
}
