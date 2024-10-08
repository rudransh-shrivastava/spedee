"use client";
import queries from "@/app/_getdata";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { AttributeType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Page() {
  return (
    <div>
      <h1 className="mb-4 text-2xl">Dashboard</h1>
      <Tabs defaultValue="attributes">
        <TabsList>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="attributes">
          <Attributes />
        </TabsContent>
        <TabsContent value="categories">
          <Categories />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Attributes() {
  const queryClient = useQueryClient();
  const [newAttributeName, setNewAttributeName] = useState("");
  const { status, data: attributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: queries.getAttributes,
  });

  const createAttributeMutation = useMutation({
    mutationFn: queries.createAttribute,
  });

  if (status === "pending") {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }
  if (status === "error") {
    <div className="flex justify-center py-12">Something Went Wrong</div>;
  }

  return (
    <>
      <h1 className="mb-4 px-4 text-xl">Attributes</h1>
      {attributes && (
        <>
          <div className="space-y-2">
            {attributes.length === 0 ? (
              <div className="p-4">No Attributes Found</div>
            ) : (
              attributes.map((attribute, index) => (
                <Attribute
                  key={index}
                  attribute={attribute}
                  index={index}
                  setAttributes={() => {}}
                />
              ))
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newAttributeName) return;
              createAttributeMutation.mutate(newAttributeName, {
                onSuccess: (data) => {
                  if (data.success) {
                    queryClient.setQueryData(
                      ["attributes"],
                      [...attributes, data.attribute]
                    );
                    setNewAttributeName("");
                  }
                },
              });
            }}
          >
            <div className="mt-4 flex max-w-[25rem] gap-[1px]">
              <Input
                className="rounded-r-none border-r-0"
                value={newAttributeName}
                disabled={createAttributeMutation.status === "pending"}
                onChange={(e) => {
                  e.preventDefault();
                  setNewAttributeName(e.target.value);
                }}
              />
              <Button
                variant="outline"
                type="submit"
                className="shrink-0 rounded-l-none"
                disabled={createAttributeMutation.status === "pending"}
                size="icon"
              >
                <PlusIcon />
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  );
}

function Attribute({
  attribute,
  setAttributes,
  index,
}: {
  attribute: AttributeType;
  setAttributes: React.Dispatch<React.SetStateAction<AttributeType[]>>;
  index: number;
}) {
  const [newAttributeValue, setNewAttributeValue] = useState("");
  const setValues = useCallback(
    (values: AttributeType["values"], del?: boolean) => {
      const newAttribute = { ...attribute, values: values };
      setAttributes((prev) => {
        if (del) {
          // TODO: no api for deleting an attribute
          const newAttributes = [...prev];
          newAttributes.splice(index, 1);
          return newAttributes;
        }
        const newAttributes = [...prev];
        newAttributes[index] = newAttribute;
        return newAttributes;
      });
    },
    [attribute, setAttributes, index]
  );
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 rounded-lg border border-b-2 p-4 sm:flex-row",
        false ? "pointer-events-none opacity-50" : ""
      )}
    >
      <div className="w-full">
        <h3 className="text-lg font-medium">{attribute.name}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {attribute.values.length === 0 ? (
            <div className="flex h-10 items-center pl-4">No Values</div>
          ) : (
            attribute.values.map((value, index) => (
              <div
                key={index}
                className="flex h-10 items-center rounded-full bg-secondary pl-4"
              >
                <span>{value}</span>
                <Button
                  variant="ghost"
                  className="relative rounded-full"
                  size="icon"
                  onClick={() => {
                    const newValues = attribute.values.filter(
                      (v) => v !== value
                    );
                    setValues(newValues);
                  }}
                >
                  <Cross1Icon className="size-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newAttributeValue) return;
            setValues([...attribute.values, newAttributeValue]);
            setNewAttributeValue("");
          }}
        >
          <div className="mt-4 flex max-w-[20rem] gap-[1px]">
            <Input
              className="rounded-r-none border-r-0"
              value={newAttributeValue}
              onChange={(e) => {
                e.preventDefault();
                setNewAttributeValue(e.target.value);
              }}
            />
            <Button
              variant="outline"
              type="submit"
              className="shrink-0 rounded-l-none"
              size="icon"
            >
              <PlusIcon />
            </Button>
          </div>
        </form>
      </div>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}
function Categories() {
  return (
    <div>
      <h1 className="mb-4 text-2xl">Categories</h1>
    </div>
  );
}
