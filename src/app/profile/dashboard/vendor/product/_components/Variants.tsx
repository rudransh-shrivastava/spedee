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
import { VariantType } from "@/models/Product";
import { AttributeType } from "@/types";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { useCallback, useState } from "react";

export function Variants({
  variants,
  setVariants,
  attributesServer,
}: {
  variants: VariantType[];
  setVariants: (v: VariantType[]) => void;
  attributesServer: AttributeType[];
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
      </FormGroup>
      <FormGroup>
        <Label>Variants</Label>
        <div className="grid gap-2 py-2 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant, index) => (
            <VariantCard
              key={index}
              attributes={attributes}
              variant={variant}
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
            className="flex h-auto min-h-[280px] flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 text-card-foreground"
            onClick={(e) => {
              e.preventDefault();
              setVariants([
                ...variants,
                {
                  attributes: {},
                  stock: 0,
                  image: null,
                },
              ]);
            }}
          >
            <PlusCircledIcon className="size-8" />
            <span>Add a Variant</span>
          </Button>
        </div>
      </FormGroup>
    </>
  );
}

function VariantCard({
  attributes,
  variant,
  setVariant,
}: {
  attributes: (AttributeType & { include: boolean })[];
  variant: VariantType;
  setVariant: (v: VariantType, del?: boolean) => void;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground">
      {attributes
        .filter((a) => a.include)
        .map((attribute, index) => (
          <VariantFormGroup key={index}>
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
      </VariantFormGroup>
      <VariantFormGroup>
        <Label>Price in Paise</Label>
        <Input />
      </VariantFormGroup>
      <VariantFormGroup>
        <Label>Sale Price in Paise</Label>
        <Input />
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
