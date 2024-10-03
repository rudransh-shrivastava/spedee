import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductType } from "@/models/Product";
import { useCallback, useRef, useState } from "react";
import {
  ProductSchema,
  ProductSchemaFormattedError,
} from "@/schema/product-schema";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { PlusIcon, XIcon } from "lucide-react";
import Loader from "@/components/Loader";
import axios from "axios";

export function ProductForm({
  productProps,
  submitUrl,
}: {
  productProps: ProductType & { id: string };
  submitUrl: string;
}) {
  const [product, setProduct] = useState<ProductType & { id: string }>({
    ...productProps,
    id: productProps.id || "",
    vendorEmail: "idk",
    attributes: productProps.attributes || {},
  });

  const [productErrors, setErrors] = useState<ProductSchemaFormattedError>({
    _errors: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [newAttribute, setNewAttribute] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const otherImagesInputRef = useRef<HTMLInputElement | null>(null);

  const setAttributeValue = useCallback(
    (attribute: string, value: string[]) => {
      setProduct((p) => ({
        ...p,
        attributes: {
          ...p.attributes,
          [attribute]: value,
        },
      }));
    },
    []
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const validationResult = ProductSchema.safeParse(product);
        if (!validationResult.success) {
          const formattedErrors = validationResult.error.format();
          setErrors(formattedErrors);
        } else {
          setErrors({ _errors: [] });
          setSubmitting(true);

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
          formData.append("vendorEmail", product.vendorEmail);
          formData.append("category", product.category);
          formData.append("stock", product.stock.toString());
          formData.append("bestSeller", product.bestSeller.toString());
          formData.append(
            "bestSellerPriority",
            product.bestSellerPriority.toString()
          );

          setSubmitting(false);
          if (submitUrl) {
            axios
              .post(submitUrl, formData)
              .then((res) => console.log(res))
              .catch((err) => console.log("Error occured", err));
          }
        }
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
        <Label>Attributes</Label>
        <div className="grid grid-cols-3 items-center gap-2">
          {Object.keys(product.attributes).length === 0 && (
            <div className="col-span-3 py-2">No attribute Values</div>
          )}
          {Object.keys(product.attributes).map((attribute) => {
            return (
              <Attribute
                setAttributeValue={setAttributeValue}
                key={attribute}
                attribute={attribute}
                attributes={product.attributes}
              />
            );
          })}
          <div className="flex gap-[1px]">
            <Input
              className="rounded-r-none border-r-0"
              value={newAttribute}
              onChange={(e) => {
                e.preventDefault();
                setNewAttribute(e.target.value);
              }}
            />
            <Button
              variant="outline"
              className="shrink-0 rounded-l-none"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                setProduct((p) => ({
                  ...p,
                  attributes: {
                    ...p.attributes,
                    [newAttribute]: [],
                  },
                }));
                setNewAttribute("");
              }}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <Label>Image</Label>
        <Input className="h-20" type="file" accept="image/*" />
        {productErrors.image && (
          <div className="col-start-2 text-destructive">Image is required</div>
        )}
      </FormGroup>
      <FormGroup>
        <Label>Other Images</Label>
        <Input className="h-20" type="file" accept="image/*" multiple />
        {productErrors.otherImages && (
          <div className="col-start-2 text-destructive">
            Other Images is required
          </div>
        )}
      </FormGroup>
      <FormGroup>
        <Label>Category</Label>
        <Input
          value={product.category}
          onChange={(e) => {
            setProduct((p) => ({ ...p, category: e.target.value }));
          }}
        />
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
          disabled={submitting}
          className={cn(submitting ? "disabled:opacity-100" : "")}
        >
          <span className={cn(submitting ? "text-transparent" : "")}>Save</span>
          {submitting && <Loader className="absolute size-6" />}
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

function Attribute({
  attribute,
  attributes,
  setAttributeValue,
}: {
  attribute: string;
  attributes: ProductType["attributes"];
  setAttributeValue: (attribute: string, value: string[]) => void;
}) {
  const [newAttribute, setNewAttribute] = useState("");
  return (
    <>
      <div>{attribute}</div>
      <div className="col-span-2">
        <div className="flex flex-wrap gap-2 py-2">
          {attributes[attribute].length === 0 && <div>No Attributes</div>}
          {attributes[attribute].map((attributeValue, index) => {
            return (
              <div
                className="flex h-9 items-center overflow-hidden rounded-full bg-secondary pl-4"
                key={index}
              >
                {attributeValue}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    attributes[attribute].splice(index, 1);
                  }}
                >
                  <XIcon className="size-5" />
                </Button>
              </div>
            );
          })}
        </div>
        <div className="flex gap-[1px]">
          <Input
            className="rounded-r-none border-r-0"
            value={newAttribute}
            onChange={(e) => {
              e.preventDefault();
              setNewAttribute(e.target.value);
            }}
          />
          <Button
            variant="outline"
            className="shrink-0 rounded-l-none"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              setAttributeValue(attribute, [
                ...attributes[attribute],
                newAttribute,
              ]);
              setNewAttribute("");
            }}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
    </>
  );
}
