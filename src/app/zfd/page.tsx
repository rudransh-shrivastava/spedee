"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { productFormDataSchema } from "@/zod-schema/product-zod-schema";
import { ChangeEvent, useState } from "react";
// import { z, ZodFormattedError } from "zod";
// import { zfd } from "zod-form-data";

export default function ZFD() {
  const [files, setFiles] = useState<File[]>([]);
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleSubmit = () => {
    const formData = new FormData();

    // Simulated form data (replace this with real form input in production)
    const data1 = {
      productId: "1",
      name: "Product 1",
      description: "Product 1 description",
      attributes: {
        color: ["red", "blue"],
        size: ["small", "medium"],
      },
      category: "Category 1",
      bestSeller: "true",
      bestSellerPriority: 1,
      variants: [
        {
          attributes: {
            color: "red",
            size: "small",
          },
          stock: 100,
          priceInPaise: 1000,
          salePriceInPaise: 900,
        },
      ],
    };

    // Append basic fields (non-files)
    formData.append("productId", data1.productId);
    formData.append("name", data1.name);
    formData.append("description", data1.description);
    formData.append("category", data1.category);
    formData.append("bestSeller", data1.bestSeller);
    formData.append("bestSellerPriority", data1.bestSellerPriority.toString());
    formData.append("attributes", JSON.stringify(data1.attributes));

    // Manually handle the `variants` array (exclude files initially)
    const variantsWithoutFiles = data1.variants.map(
      ({ attributes, stock, priceInPaise, salePriceInPaise }) => ({
        attributes,
        stock,
        priceInPaise,
        salePriceInPaise,
      })
    );
    // formData.append("variants", JSON.stringify(variantsWithoutFiles));

    // Append files directly to FormData with flattened keys
    formData.append(
      "variants[0].attributes",
      JSON.stringify(variantsWithoutFiles[0].attributes)
    );

    formData.append(
      "variants[0].stock",
      variantsWithoutFiles[0].stock.toString()
    );

    formData.append(
      "variants[0].salePriceInPaise",
      variantsWithoutFiles[0].salePriceInPaise.toString()
    );

    formData.append(
      "variants[0].priceInPaise",
      variantsWithoutFiles[0].priceInPaise.toString()
    );

    formData.append("variants[0].image", files[0]); // Main image file for the first variant
    formData.append("variants[0].otherImages[0]", files[1]); // First additional image
    formData.append("variants[0].otherImages[1]", files[2]); // Second additional image

    // Rebuild the object structure to match the Zod schema

    // Validate with Zod schema
    const res = productFormDataSchema.safeParse(formData);
    setResult(JSON.stringify(res.error?.format() || "NO ERRORS", null, 2));
  };

  return (
    <div className="max-w-screen-sm p-4">
      <Textarea
        className="h-80 font-mono"
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
      />
      <pre className="font-mono">{result}</pre>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        id="fileInput"
      />

      <Button onClick={handleSubmit}>Check Schema 1</Button>
    </div>
  );
}
