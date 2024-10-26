// takes in categoryId

import axios from "axios";

// returns category full name (e.g. "Men/Tshirts/Oversized")
const categoryList: string[] = [];
export async function convertCategoryIdtoCategory(
  categoryId: string
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get(
    `${process.env.NEXTAUTH_URL}/api/v1/categories`
  );
  const categories = response.data;
  searchCategory(categoryId, categories);
  return categoryList.join("/");
}

function searchCategory(categoryId: string, categories: any[]): boolean {
  for (const category of categories) {
    categoryList.push(category.name);
    if (category.id === categoryId) {
      return true;
    }
    if (category.children) {
      const found = searchCategory(categoryId, category.children);
      if (found) {
        return true;
      }
    }
    categoryList.pop();
  }
  return false;
}
