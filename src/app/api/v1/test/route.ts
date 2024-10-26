import { convertCategoryIdtoCategory } from "@/lib/category";

export async function GET() {
  const s = await convertCategoryIdtoCategory("671b4848ecdb26b99e973266");
  console.log(s);
  return new Response("Hello World");
}
