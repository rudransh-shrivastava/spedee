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

type AddCategoryToTreeType = (
  tree: CategoryTree[] | null,
  parentId: string | null,
  newCategory: CategoryTree
) => CategoryTree[];

export function Categories() {
  const { status, data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: queries.getCategories,
  });

  const addCategoryToTree = useCallback(
    (
      tree: CategoryTree[] | null,
      parentId: string | null,
      newCategory: CategoryTree
    ): CategoryTree[] => {
      let categoryTree = tree;
      if (!tree && categories) {
        categoryTree = categories;
      }
      if (!categoryTree) return [];
      if (!parentId) return [...categoryTree, newCategory];

      return categoryTree.map((category) => {
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
    [categories]
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
    <div>
      <h1 className="mb-4 px-4 text-xl">Categories</h1>
      <div>
        {categories && (
          <CategoryList
            categories={categories}
            addCategoryToTree={addCategoryToTree}
          />
        )}
      </div>
    </div>
  );
}

function CategoryList({
  categories,
  addCategoryToTree,
}: {
  categories: CategoryTree[];
  addCategoryToTree: AddCategoryToTreeType;
}) {
  return categories.length > 0 ? (
    <Accordion type="multiple" className="space-y-2">
      <CategoryListItem
        addCategoryToTree={addCategoryToTree}
        category={categories}
        parentId={null}
      />
    </Accordion>
  ) : (
    ""
  );
}

function CategoryListItem({
  category,
  parentId,
  addCategoryToTree,
}: {
  category: CategoryTree[];
  parentId: CategoryTree["parentCategoryId"];
  addCategoryToTree: AddCategoryToTreeType;
}) {
  return (
    <>
      {category.length ? (
        category.map((categoryChild, index) => (
          <AccordionItem
            value={categoryChild.id}
            className="rounded-lg border"
            key={index}
          >
            <AccordionTrigger className="px-2">
              {categoryChild.name}
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pb-4 pl-5 pr-1 pt-1">
              <CategoryListItem
                addCategoryToTree={addCategoryToTree}
                parentId={categoryChild.id}
                category={categoryChild.children}
              />
            </AccordionContent>
          </AccordionItem>
        ))
      ) : (
        <div className="pb-2">No SubCategories</div>
      )}
      <CategoryForm
        category={category}
        parentId={parentId}
        addCategoryToTree={addCategoryToTree}
      />
    </>
  );
}

function CategoryForm({
  category,
  parentId,
  addCategoryToTree,
}: {
  category: CategoryTree[];
  parentId: CategoryTree["parentCategoryId"];
  addCategoryToTree: AddCategoryToTreeType;
}) {
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState("");
  const createCategoryMutation = useMutation({
    mutationFn: queries.createCategory,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!newCategoryName) {
          setError("Attribute Name is Required");
        } else if (category?.find((c) => c.name === newCategoryName)) {
          setError("Attribute with this Name Already Exists");
        } else {
          setError("");
          createCategoryMutation.mutate(
            {
              name: newCategoryName,
              id: "no-id",
              isParent: false,
              parentCategoryId: parentId,
            },
            {
              onSuccess: (data) => {
                if (data.success) {
                  queryClient.setQueryData(
                    ["categories"],
                    addCategoryToTree(null, parentId, {
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
      <div className="grid max-w-[25rem] grid-cols-[1fr,2.25rem] gap-x-[1px] gap-y-1">
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
  );
}
