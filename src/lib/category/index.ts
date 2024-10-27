// takes in categoryId

import axios from "axios";

// returns category full name (e.g. "Men/Tshirts/Oversized")
export async function convertCategoryIdtoCategory(
  categoryId: string
): Promise<string> {
  const categoryList: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get(
    `${process.env.NEXTAUTH_URL}/api/v1/categories`
  );
  const categories = response.data;
  searchCategory(categoryId, categories, categoryList);
  return categoryList.join("/");
}

function searchCategory(
  categoryId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[],
  categoryList: string[]
): boolean {
  for (const category of categories) {
    categoryList.push(category.name);
    if (category.id === categoryId) {
      return true;
    }
    if (category.children) {
      const found = searchCategory(categoryId, category.children, categoryList);
      if (found) {
        return true;
      }
    }
    categoryList.pop();
  }
  return false;
}
