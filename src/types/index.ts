export type AttributeType = {
  id: string;
  name: string;
  values: string[];
};

export type CategoryTree = {
  id: string;
  name: string;
  isParent: boolean;
  parentCategoryId: string | null;
  children: CategoryTree[];
};
