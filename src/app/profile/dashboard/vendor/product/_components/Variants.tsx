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
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Pin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { productFormDataSchemaErrorType } from "@/zod-schema/product-zod-schema";
import Image from "next/image";

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
  const setVariant = useCallback(
    (
      variantIndex: number,
      v: VariantType & { images: File[] },
      del?: boolean
    ) => {
      if (del) {
        setVariants(variants.filter((_, i) => i !== variantIndex));
      } else {
        const newVariants = [...variants];
        newVariants[variantIndex] = v;
        setVariants(newVariants);
      }
    },
    [setVariants, variants]
  );

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
    },
    [setVariants, variants, attributes]
  );

  useEffect(() => {
    const newAttributes: { [key: string]: string[] } = {};
    attributes.forEach((attribute) => {
      if (attribute.include) {
        newAttributes[attribute.name] = [...attribute.values];
      }
    });
    updateAttributes(newAttributes);
  }, [attributes, updateAttributes]);

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
        {variants.map((variant, variantIndex) => (
          <VariantCard
            key={variantIndex}
            attributes={attributes}
            variant={variant}
            productErrors={productErrors}
            variantIndex={variantIndex}
            setVariant={setVariant}
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
                id: `variant-${variants.length + 1}`, // NOTE:
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
  variantIndex,
}: {
  attributes: (AttributeType & { include: boolean })[];
  variant: VariantType & { images: File[] };
  setVariant: (
    variantIndex: number,
    v: VariantType & { images: File[] },
    del?: boolean
  ) => void;
  productErrors: productFormDataSchemaErrorType;
  variantIndex: number;
}) {
  const updateImages = useCallback(
    (variantIndex: number, images: File[]) => {
      setVariant(variantIndex, {
        ...variant,
        images: [...images],
      });
    },
    [setVariant, variant]
  );

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
                  setVariant(variantIndex, {
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
            (productErrors.variants &&
              productErrors.variants[variantIndex] &&
              "attributes" in productErrors.variants[variantIndex] &&
              productErrors.variants[variantIndex].attributes) ||
            undefined
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
              setVariant(variantIndex, {
                ...variant,
                stock: parseInt(e.target.value) || 0,
              });
            }}
          />
          <VariantFormError
            error={
              (productErrors.variants &&
                productErrors.variants[variantIndex] &&
                "stock" in productErrors.variants[variantIndex] &&
                productErrors.variants[variantIndex].stock) ||
              undefined
            }
          />
        </VariantFormGroup>
        <VariantFormGroup>
          <Label>Price in Paise</Label>
          <Input
            onChange={(e) => {
              setVariant(variantIndex, {
                ...variant,
                priceInPaise: parseInt(e.target.value) || 0,
              });
            }}
          />
          <VariantFormError
            error={
              (productErrors.variants &&
                productErrors.variants[variantIndex] &&
                "priceInPaise" in productErrors.variants[variantIndex] &&
                productErrors.variants[variantIndex].priceInPaise) ||
              undefined
            }
          />
        </VariantFormGroup>
        <VariantFormGroup>
          <Label>Sale Price in Paise</Label>
          <Input
            onChange={(e) => {
              setVariant(variantIndex, {
                ...variant,
                salePriceInPaise: parseInt(e.target.value) || 0,
              });
            }}
          />
          <VariantFormError
            error={
              (productErrors.variants &&
                productErrors.variants[variantIndex] &&
                "salePriceInPaise" in productErrors.variants[variantIndex] &&
                productErrors.variants[variantIndex].salePriceInPaise) ||
              undefined
            }
          />
        </VariantFormGroup>
        <div className="mt-4 grid items-center gap-1">
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              setVariant(variantIndex, variant, true);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      <DragAndDropImageUploader
        key={variantIndex}
        images={variant.images}
        variantIndex={variantIndex}
        updateImages={updateImages}
      />
      <FormError
        error={
          (productErrors.variants &&
            productErrors.variants[variantIndex] &&
            "image" in productErrors.variants[variantIndex] &&
            productErrors.variants[variantIndex].image) ||
          undefined
        }
      />
      <FormError
        error={
          (productErrors.variants &&
            productErrors.variants[variantIndex] &&
            "otherImages" in productErrors.variants[variantIndex] &&
            productErrors.variants[variantIndex].otherImages) ||
          undefined
        }
      />
    </div>
  );
}

function DragAndDropImageUploader({
  images,
  updateImages,
  variantIndex,
}: {
  images: File[];
  updateImages: (variantIndex: number, images: File[]) => void;
  variantIndex: number;
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
    updateImages(variantIndex, [...images, ...imageFiles]);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    updateImages(variantIndex, [...images, ...files]);
  };

  return (
    <div className="">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        id={`fileInput-${variantIndex}`}
      />

      <div className="flex flex-wrap justify-center gap-4 md:justify-start">
        <label
          htmlFor={`fileInput-${variantIndex}`}
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
              <Image
                key={imageIndex}
                src={URL.createObjectURL(image)}
                alt={`Selected ${imageIndex}`}
                width={300}
                height={300}
                className={cn("h-full w-full object-contain object-top")}
              />
            </div>
            <div className="absolute right-2 top-2 grid gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  updateImages(
                    variantIndex,
                    images.filter((_, index) => index !== imageIndex)
                  );
                }}
              >
                <X />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  updateImages(variantIndex, [
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
