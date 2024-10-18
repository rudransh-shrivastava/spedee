"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { CategoryTree } from "@/types";
import { queries } from "@/app/_data/queries";

export function Category({
  value,
  setValue,
}: {
  value: string;
  setValue: (categoryId: string) => void;
}) {
  const { data: categories } = useQuery(queries.categories);

  const buildCategoryArray = React.useCallback(
    (
      categories: CategoryTree[],
      currentPath: string[] = []
    ): { id: string; path: string[] }[] => {
      let paths: { id: string; path: string[] }[] = [];

      categories.forEach((category) => {
        const newPath = [...currentPath, category.name];
        paths.push({ id: category.id, path: newPath });

        if (category.children && category.children.length > 0) {
          paths = paths.concat(buildCategoryArray(category.children, newPath));
        }
      });

      return paths;
    },
    []
  );

  const categoryArray = categories ? buildCategoryArray(categories) : [];

  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? categoryArray
                .find((category) => category.id === value)
                ?.path.join(" / ")
            : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categoryArray.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.path.join(" / ")}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
