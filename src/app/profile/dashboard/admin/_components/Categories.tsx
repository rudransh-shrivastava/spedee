import queries from "@/app/_getdata";
import Loader from "@/components/Loader";
import { CategoryTree } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AccordionTrigger } from "./CategoriesAccrodionTrigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function Categories() {
  const { status, data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: queries.getCategories,
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
    <div>
      <h1 className="mb-4 px-4 text-xl">Categories</h1>
      <div>{categories && <CategoryList categories={categories} />}</div>
    </div>
  );
}

function CategoryList({ categories }: { categories: CategoryTree[] }) {
  return categories.length > 0 ? (
    <Accordion type="multiple" className="space-y-2">
      {categories.map((category, index) => (
        <CategoryListItem
          key={index}
          category={category}
          categories={categories}
        />
      ))}
    </Accordion>
  ) : (
    ""
  );
}

function CategoryListItem({
  category,
  categories,
}: {
  category: CategoryTree;
  categories: CategoryTree[];
}) {
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState("");

  const createCategoryMutation = useMutation({
    mutationFn: queries.createCategory,
  });

  const addCategoryToTree = useCallback(
    (
      tree: CategoryTree[],
      parentId: string,
      newCategory: CategoryTree
    ): CategoryTree[] => {
      return tree.map((category) => {
        if (category.id === parentId) {
          return {
            ...category,
            children: [...category.children, newCategory],
          };
        }
        return {
          ...category,
          children: addCategoryToTree(category.children, parentId, newCategory),
        };
      });
    },
    []
  );

  return (
    <AccordionItem value={category.id} className="rounded-lg border">
      <AccordionTrigger className="px-2">{category.name}</AccordionTrigger>
      <AccordionContent className="space-y-2 pb-4 pl-5 pr-1 pt-1">
        {category.children.length > 0 &&
          category.children.map((categoryChild, index) => (
            <CategoryListItem
              key={index}
              category={categoryChild}
              categories={categories}
            />
          ))}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newCategoryName) {
              setError("Attribute Name is Required");
            } else if (
              category.children?.find((c) => c.name === newCategoryName)
            ) {
              setError("Attribute with this Name Already Exists");
            } else {
              setError("");
              createCategoryMutation.mutate(
                {
                  name: newCategoryName,
                  id: "no-id",
                  isParent: false,
                  parentCategoryId: category.id,
                },
                {
                  onSuccess: (data) => {
                    if (data.success) {
                      queryClient.setQueryData(
                        ["categories"],
                        addCategoryToTree(categories, category.id, {
                          ...data.category,
                          children: [],
                        })
                      );
                      setNewCategoryName("");
                    }
                  },
                }
              );
            }
          }}
        >
          <div className="mt-4 grid max-w-[25rem] grid-cols-[1fr,2.25rem] gap-x-[1px] gap-y-1">
            <Input
              className="rounded-r-none border-r-0 shadow-none"
              value={newCategoryName}
              disabled={createCategoryMutation.status === "pending"}
              onChange={(e) => {
                e.preventDefault();
                setNewCategoryName(e.target.value);
              }}
            />
            <Button
              variant="outline"
              type="submit"
              className="shrink-0 rounded-l-none shadow-none"
              disabled={createCategoryMutation.status === "pending"}
              size="icon"
            >
              <PlusIcon />
            </Button>
            <div className="col-span-2 text-sm text-destructive">{error}</div>
          </div>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
}
