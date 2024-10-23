import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductType, VariantType } from "@/models/Product";
import { AttributeType } from "@/types";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { ChangeEvent, DragEvent, useCallback, useState } from "react";
import { Pin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { productFormDataSchemaErrorType } from "@/zod-schema/product-zod-schema";

export function Variants({
  variants,
  setVariants,
  attributesServer,
  updateAttributes,
  productErrors,
}: {
  variants: (VariantType & { images: File[] })[];
  setVariants: (v: (VariantType & { images: File[] })[]) => void;
  attributesServer: AttributeType[];
  updateAttributes: (attributes: ProductType["attributes"]) => void;
  productErrors: productFormDataSchemaErrorType;
}) {
  const [attributes, setAttributes] = useState<
    (AttributeType & { include: boolean })[]
  >(
    attributesServer.map((attribute) => ({
      ...attribute,
      include: true,
    }))
  );

  const updateAttribute = useCallback(
    (index: number, value: boolean) => {
      if (value === false) {
        setVariants(
          variants.map((v) => {
            delete v.attributes[attributes[index].name];
            return v;
          })
        );
      }
      setAttributes((attb) =>
        attb.map((a, i) => (i === index ? { ...a, include: value } : a))
      );

      // TODO: we have to select at least once
      const newAttributes: { [key: string]: string[] } = {};
      attributes.forEach((attribute) => {
        if (attribute.include) {
          newAttributes[attribute.name] = [...attribute.values];
        }
      });
      updateAttributes(newAttributes);
    },
    [setVariants, variants, attributes]
  );

  return (
    <>
      <FormGroup>
        <Label>Attributes</Label>
        <div className="flex gap-2 py-2">
          {attributes.map((attribute, index) => (
            <Button
              variant="secondary"
              className="cursor-pointer select-none gap-1 px-2"
              key={index}
              asChild
            >
              <label htmlFor={`include-attribute-${index}`}>
                <Checkbox
                  id={`include-attribute-${index}`}
                  checked={attribute.include}
                  onClick={() => {
                    updateAttribute(index, !attribute.include);
                  }}
                />
                <span>{attribute.name}</span>
              </label>
            </Button>
          ))}
        </div>
        <FormError error={productErrors.attributes} />
      </FormGroup>
      <Label className="block pb-8 pt-12 text-xl">Variants</Label>
      <div className="grid gap-8">
        {variants.map((variant, index) => (
          <VariantCard
            key={index}
            attributes={attributes}
            variant={variant}
            productErrors={productErrors}
            index={index}
            setVariant={(v, del) => {
              if (del) {
                setVariants(variants.filter((_, i) => i !== index));
              } else {
                const newVariants = [...variants];
                newVariants[index] = v;
                setVariants(newVariants);
              }
            }}
          />
        ))}
        <Button
          variant="ghost"
          className="flex h-auto min-h-[280px] min-w-[17rem] flex-col items-center justify-center gap-2 rounded-lg bg-card p-4 text-card-foreground"
          onClick={(e) => {
            e.preventDefault();
            setVariants([
              ...variants,
              {
                attributes: attributes.reduce(
                  (acc, attribute) => ({
                    ...acc,
                    [attribute.name]: "",
                  }),
                  {}
                ),
                image: "",
                otherImages: [],
                images: [],
                priceInPaise: 0,
                salePriceInPaise: 0,
                stock: 0,
              },
            ]);
          }}
        >
          <PlusCircledIcon className="size-8" />
          <span>Add a Variant</span>
        </Button>
      </div>
      <FormError error={productErrors.variants} />
    </>
  );
}

function VariantCard({
  attributes,
  variant,
  setVariant,
  productErrors,
  index,
}: {
  attributes: (AttributeType & { include: boolean })[];
  variant: VariantType & { images: File[] };
  setVariant: (v: VariantType & { images: File[] }, del?: boolean) => void;
  productErrors: productFormDataSchemaErrorType;
  index: number;
}) {
  return (
    <div className="relative grid gap-8 md:grid-cols-[23rem,auto]">
      <div className="h-max min-w-[17rem] border p-4 md:sticky md:top-20">
        {attributes
          .filter((a) => a.include)
          .map((attribute, attributeIndex) => (
            <VariantFormGroup key={attributeIndex}>
              <Label>{attribute.name}</Label>
              <Select
                value={variant.attributes[attribute.name]}
                onValueChange={(e) => {
                  setVariant({
                    ...variant,
                    attributes: {
                      ...variant.attributes,
                      [attribute.name]: e.valueOf(),
                    },
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={attribute.name} />
                </SelectTrigger>
                <SelectContent>
                  {attribute.values.map((value, index) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </VariantFormGroup>
          ))}
        <VariantFormError
          error={
            productErrors.variants &&
            productErrors.variants[0] &&
            productErrors.variants[0].attributes
          }
        />
        <VariantFormGroup>
          <Label>Stock</Label>
          <Input
            type="text"
            placeholder="0"
            value={variant.stock || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              e.preventDefault();
              setVariant({
                ...variant,
                stock: parseInt(e.target.value) || 0,
              });
            }}
          />
          <VariantFormError
            error={
              productErrors.variants &&
              productErrors.variants[0] &&
              productErrors.variants[0].stock
            }
          />
        </VariantFormGroup>
        <VariantFormGroup>
          <Label>Price in Paise</Label>
          <Input
            onChange={(e) => {
              setVariant({
                ...variant,
                priceInPaise: parseInt(e.target.value) || 0,
              });
            }}
          />
          <VariantFormError
            error={
              productErrors.variants &&
              productErrors.variants[0] &&
              productErrors.variants[0].priceInPaise
            }
          />
        </VariantFormGroup>
        <VariantFormGroup>
          <Label>Sale Price in Paise</Label>
          <Input
            onChange={(e) => {
              setVariant({
                ...variant,
                salePriceInPaise: parseInt(e.target.value) || 0,
              });
            }}
          />
          <VariantFormError
            error={
              productErrors.variants &&
              productErrors.variants[0] &&
              productErrors.variants[0].salePriceInPaise
            }
          />
        </VariantFormGroup>
        <div className="mt-4 grid items-center gap-1">
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              setVariant(variant, true);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      <DragAndDropImageUploader
        images={variant.images}
        updateImages={(images: File[]) => {
          setVariant({
            ...variant,
            images,
          });
        }}
      />
      <FormError
        error={
          productErrors.variants &&
          productErrors.variants[0] &&
          productErrors.variants[0].image
        }
      />
      <FormError
        error={
          productErrors.variants &&
          productErrors.variants[0] &&
          productErrors.variants[0].otherImages
        }
      />
    </div>
  );
}

function DragAndDropImageUploader({
  images,
  updateImages,
}: {
  images: File[];
  updateImages: (images: File[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    updateImages([...images, ...imageFiles]);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    updateImages([...images, ...files]);
  };

  return (
    <div className="">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        id="fileInput"
      />

      <div className="flex flex-wrap justify-center gap-4 md:justify-start">
        <label
          htmlFor="fileInput"
          className={`flex aspect-square w-full max-w-[17rem] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-2 text-center transition-colors ${isDragging ? "border-gray-400 bg-gray-200" : "border-gray-300 bg-white"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-gray-500">
            Drag & Drop your images here or click to upload
          </p>
        </label>
        {images.map((image, imageIndex) => (
          <div
            key={imageIndex}
            className="group/link relative flex flex-col items-center justify-center"
          >
            <div className="size-[17rem] overflow-hidden border">
              <img
                src={URL.createObjectURL(image)}
                alt={`Selected ${imageIndex}`}
                className={cn(
                  "h-full w-full object-top",
                  imageIndex === 0 ? "object-cover" : "object-contain"
                )}
              />
            </div>
            <div className="absolute right-2 top-2 grid gap-2">
              <Button variant="secondary" size="icon">
                <X
                  onClick={(e) => {
                    e.preventDefault();
                    updateImages(
                      images.filter((_, index) => index !== imageIndex)
                    );
                  }}
                />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  updateImages([
                    ...images.slice(imageIndex, imageIndex + 1),
                    ...images.slice(0, imageIndex),
                    ...images.slice(imageIndex + 1),
                  ]);
                }}
              >
                <Pin
                  strokeWidth={1.25}
                  fill={imageIndex === 0 ? "currentColor" : "transparent"}
                />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid items-center gap-1 py-2 md:grid-cols-[25ch,1fr] md:gap-x-4">
      {children}
    </div>
  );
}

function VariantFormGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid items-center gap-1 py-2">{children}</div>;
}

function FormError({ error }: { error?: { _errors: string[] } | undefined }) {
  return error ? (
    <div className="col-start-2 text-destructive">{error._errors[0]}</div>
  ) : (
    ""
  );
}

function VariantFormError({
  error,
}: {
  error?: { _errors: string[] } | undefined;
}) {
  return error ? (
    <div className="text-sm text-destructive">{error._errors[0]}</div>
  ) : (
    ""
  );
}
