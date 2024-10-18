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
import { EditIcon, MoreHorizontal, PlusIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queries } from "@/app/_data/queries";
import { mutations } from "@/app/_data/mutations";

type AddCategoryToTreeType = (
  tree: CategoryTree[] | null,
  parentId: string | null,
  newCategory: CategoryTree
) => CategoryTree[];

type deleteCategoryFromTreeType = (
  tree: CategoryTree[] | null,
  categoryId: string
) => CategoryTree[];

export function Categories() {
  const { status, data: categories } = useQuery(queries.categories);

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

  const deleteCategoryFromTree = useCallback(
    (tree: CategoryTree[] | null, categoryId: string): CategoryTree[] => {
      let categoryTree = tree;
      if (!tree && categories) {
        categoryTree = categories;
      }
      if (!categoryTree) return [];

      return categoryTree
        .map((category) => {
          if (category.id === categoryId) {
            return null;
          }
          return {
            ...category,
            children: deleteCategoryFromTree(category.children, categoryId),
          };
        })
        .filter(Boolean) as CategoryTree[];
    },
    [categories]
  );

  // Rename a category
  // const renameCategoryInTree = useCallback(
  //   (tree: CategoryTree[] | null, categoryId: string, newName: string): CategoryTree[] => {
  //     if (!tree) return [];

  //     return tree.map((category) => {
  //       if (category.id === categoryId) {
  //         return {
  //           ...category,
  //           name: newName, // Update the category name
  //         };
  //       }
  //       return {
  //         ...category,
  //         children: renameCategoryInTree(category.children, categoryId, newName),
  //       };
  //     });
  //   },
  //   []
  // );

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
        {categories &&
          (categories.length > 0 ? (
            <CategoryList
              deleteCategoryFromTree={deleteCategoryFromTree}
              categories={categories}
              addCategoryToTree={addCategoryToTree}
            />
          ) : (
            <div className="space-y-2">
              <div className="px-2 py-4">No Categories</div>
              <CategoryForm
                category={categories}
                parentId={null}
                addCategoryToTree={addCategoryToTree}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

function CategoryList({
  categories,
  addCategoryToTree,
  deleteCategoryFromTree,
}: {
  categories: CategoryTree[];
  addCategoryToTree: AddCategoryToTreeType;
  deleteCategoryFromTree: deleteCategoryFromTreeType;
}) {
  return categories.length > 0 ? (
    <Accordion type="multiple" className="space-y-2">
      <CategoryListItem
        category={categories}
        parentId={null}
        addCategoryToTree={addCategoryToTree}
        deleteCategoryFromTree={deleteCategoryFromTree}
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
  deleteCategoryFromTree,
}: {
  category: CategoryTree[];
  parentId: CategoryTree["parentCategoryId"];
  addCategoryToTree: AddCategoryToTreeType;
  deleteCategoryFromTree: deleteCategoryFromTreeType;
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
              <span>{categoryChild.name}</span>
              <ActionMenu
                categoryChild={categoryChild}
                deleteCategoryFromTree={deleteCategoryFromTree}
              />
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pb-4 pl-5 pr-2 pt-1">
              <CategoryListItem
                addCategoryToTree={addCategoryToTree}
                parentId={categoryChild.id}
                category={categoryChild.children}
                deleteCategoryFromTree={deleteCategoryFromTree}
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

function ActionMenu({
  categoryChild,
  deleteCategoryFromTree,
}: {
  categoryChild: CategoryTree;
  deleteCategoryFromTree: deleteCategoryFromTreeType;
}) {
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { mutate: deleteCategory, status: deleteCategoryStatus } = useMutation(
    mutations.deleteCategory
  );

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={(open) => setDropdownOpen(open)}
    >
      <DropdownMenuTrigger asChild>
        <Button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="ml-auto rounded-full"
          variant="ghost"
          size="icon"
          disabled={deleteCategoryStatus === "pending"}
          asChild
        >
          <div>
            {deleteCategoryStatus === "pending" ? (
              <Loader className="size-4" />
            ) : (
              <MoreHorizontal className="size-4" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer gap-1"
          onClick={(e) => {
            e.preventDefault();
            deleteCategory(categoryChild.id, {
              onSuccess: (data) => {
                if (data.success) {
                  queryClient.setQueryData(
                    ["categories"],
                    deleteCategoryFromTree(null, categoryChild.id)
                  );
                }
              },
            });
            setDropdownOpen(false);
          }}
        >
          <TrashIcon className="mb-1 size-4" />
          <span>Delete</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-1"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <EditIcon className="size-4 cursor-pointer" />
          {/* TODO: Implement Rename */}
          Rename
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
  const createCategoryMutation = useMutation(mutations.createCategory);

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
