"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { AttributeType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";

type UpdateAttribute = (
  attribute: Partial<AttributeType> & { id: string },
  del?: boolean
) => void;

export function Attributes() {
  const queryClient = useQueryClient();
  const [newAttributeName, setNewAttributeName] = useState("");
  const { status, data: attributes } = useQuery(queries.attributes);
  const [error, setError] = useState("");

  const createAttributeMutation = useMutation(mutations.createAttribute);

  const updateAttributeMutation = useMutation(mutations.updateAttribute);

  const updateAttribute = useCallback(
    (attribute: Partial<AttributeType> & { id: string }, del?: boolean) => {
      if (del) {
        queryClient.setQueryData(
          queries.attributes.queryKey,
          attributes?.filter((a) => a.id !== attribute.id)
        );
      } else {
        const foundAttribute = attributes?.find((a) => a.id === attribute.id);
        if (foundAttribute) {
          updateAttributeMutation.mutate(
            {
              ...foundAttribute,
              ...attribute,
            },
            {
              onSuccess: (data) => {
                if (data.success) {
                  queryClient.setQueryData(
                    queries.attributes.queryKey,
                    attributes?.map((a) => {
                      return a.id === attribute.id ? { ...a, ...attribute } : a;
                    })
                  );
                }
              },
            }
          );
        }
      }
    },
    [attributes, queryClient, updateAttributeMutation]
  );

  if (status === "pending") {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex justify-center py-12">Something Went Wrong</div>
    );
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
                  updateAttribute={updateAttribute}
                />
              ))
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newAttributeName) {
                setError("Attribute Name is Required");
              } else if (attributes?.find((a) => a.name === newAttributeName)) {
                setError("Attribute with this Name Already Exists");
              } else {
                setError("");
                createAttributeMutation.mutate(newAttributeName, {
                  onSuccess: (data) => {
                    if (data.success) {
                      queryClient.setQueryData(queries.attributes.queryKey, [
                        ...attributes,
                        data.attribute,
                      ]);
                      setNewAttributeName("");
                    }
                  },
                });
              }
            }}
          >
            <div className="mt-4 grid max-w-[25rem] grid-cols-[1fr,2.25rem] gap-x-[1px] gap-y-1">
              <Input
                className="rounded-r-none border-r-0 shadow-none"
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
                className="shrink-0 rounded-l-none shadow-none"
                disabled={createAttributeMutation.status === "pending"}
                size="icon"
              >
                <PlusIcon />
              </Button>
              <div className="col-span-2 text-sm text-destructive">{error}</div>
            </div>
          </form>
        </>
      )}
    </>
  );
}

function Attribute({
  attribute,
  updateAttribute,
}: {
  attribute: AttributeType;
  updateAttribute: UpdateAttribute;
}) {
  const [newAttributeValue, setNewAttributeValue] = useState("");
  const [error, setError] = useState("");
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
                    updateAttribute({ id: attribute.id, values: newValues });
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
            if (!newAttributeValue) {
              setError("Value is Required");
            } else if (attribute.values.includes(newAttributeValue)) {
              setError("Value Already Exists");
            } else {
              setError("");
              updateAttribute({
                id: attribute.id,
                values: [...attribute.values, newAttributeValue],
              });
              setNewAttributeValue("");
            }
          }}
        >
          <div className="mt-4 grid max-w-[20rem] grid-cols-[1fr,2.25rem] gap-x-[1px] gap-y-1">
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
            <div className="col-span-2 text-sm text-destructive">{error}</div>
          </div>
        </form>
      </div>
      <DeleteAttributeButton
        attributeId={attribute.id}
        updateAttribute={updateAttribute}
      />
    </div>
  );
}

function DeleteAttributeButton({
  attributeId,
  updateAttribute,
}: {
  attributeId: string;
  updateAttribute: UpdateAttribute;
}) {
  const { mutate: deleteAttribute, status } = useMutation({
    ...mutations.deleteAttribute,
    onSuccess: (data) => {
      if (data.success) {
        updateAttribute({ id: attributeId }, true);
      }
    },
  });

  const [open, setOpen] = useState(false);
  return (
    <AlertDialog
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
      open={open}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={status === "pending"}
          className={cn(
            "border-destructive text-destructive hover:text-destructive",
            status === "pending" ? "disabled:opacity-100" : ""
          )}
        >
          <span className={cn(status === "pending" ? "text-transparent" : "")}>
            Delete
          </span>
          {status === "pending" && <Loader className="absolute size-6" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            Attribute
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteAttribute(attributeId);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
