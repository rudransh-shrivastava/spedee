import queries from "@/app/_getdata";
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
import { useQuery } from "@tanstack/react-query";

export function Variants({
  variants,
  setVariants,
}: {
  variants: VariantType[];
  setVariants: (v: VariantType[]) => void;
}) {
  const { data: attributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: queries.getAttributes,
  });

  return (
    <div className="grid gap-2 py-4 sm:grid-cols-2 lg:grid-cols-3">
      {attributes &&
        variants.map((variant, index) => (
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
  );
}

function VariantCard({
  attributes,
  variant,
  setVariant,
}: {
  attributes: AttributeType[];
  variant: VariantType;
  setVariant: (v: VariantType, del?: boolean) => void;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground">
      {attributes.map((attribute, index) => (
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
