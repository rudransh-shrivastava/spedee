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
    <div>
      <div>
        <span className="text-lg">Attributes</span>
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
      </div>
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
    </div>
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
          <div key={index} className="grid items-center gap-1 py-2">
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
          </div>
        ))}
      <div className="grid items-center gap-1 py-2">
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
            console.log(parseInt(e.target.value) || 0);
            setVariant({
              ...variant,
              stock: parseInt(e.target.value) || 0,
            });
          }}
        />
      </div>
      <div className="grid items-center gap-1 py-2">
        <Button
          variant="outline"
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
