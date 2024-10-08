"use client";
import queries from "@/app/_getdata";
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

type UpdateAttribute = (
  attribute: Partial<AttributeType> & { id: string },
  del?: boolean
) => void;

export function Attributes() {
  const queryClient = useQueryClient();
  const [newAttributeName, setNewAttributeName] = useState("");
  const { status, data: attributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: queries.getAttributes,
  });

  const createAttributeMutation = useMutation({
    mutationFn: queries.createAttribute,
  });

  const updateAttributeMutation = useMutation({
    mutationFn: queries.updateAttribute,
  });

  const updateAttribute = useCallback(
    (attribute: Partial<AttributeType> & { id: string }, del?: boolean) => {
      if (del) {
        queryClient.setQueryData(
          ["attributes"],
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
                    ["attributes"],
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
    [attributes]
  );

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
                  updateAttribute={updateAttribute}
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
  updateAttribute,
}: {
  attribute: AttributeType;
  updateAttribute: UpdateAttribute;
}) {
  const [newAttributeValue, setNewAttributeValue] = useState("");
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
            if (!newAttributeValue) return;
            updateAttribute({
              id: attribute.id,
              values: [...attribute.values, newAttributeValue],
            });
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
    mutationFn: queries.deleteAttribute,
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
          variant="destructive"
          disabled={status === "pending"}
          className={cn(
            "relative",
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
