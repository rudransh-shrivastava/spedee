"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductType } from "@/models/Product";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";

export default function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    try {
      axios.get(`/api/product?productId=${id}`).then((res) => {
        if (res.status === 200 && res.data) {
          setProduct(res.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  return product ? (
    <>
      <div className="flex items-center gap-2 pb-8 pt-4">
        <BackButton />
        <h1 className="text-2xl">Edit Product</h1>
      </div>
      <EditProductForm product={product} />
    </>
  ) : (
    <div className="flex justify-center py-20">
      <Loader className="size-12" />
    </div>
  );
}

function EditProductForm({ product }: { product: ProductType }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* title: z.string(),
description: z.string(),
priceInPaise: z.number(),
salePriceInPaise: z.number().optional(),
attributes: z.record(z.array(z.string())),
image: z.string(),
otherImages: z.array(z.string()),
vendorId: z.string(),
category: z.string(),
stock: z.number(),
bestSeller: z.boolean(),
bestSellerPriority: z.number(), */}
      <FormGroup>
        <Label>Title</Label>
        <Input value={product.title} />
      </FormGroup>
      <FormGroup>
        <Label>Description</Label>
        <Input value={product.description} />
      </FormGroup>
      <FormGroup>
        <Label>Price in Paise</Label>
        <Input value={product.priceInPaise} />
      </FormGroup>
      <FormGroup>
        <Label>Sale Price in Paise</Label>
        <Input value={product.salePriceInPaise} />
      </FormGroup>
      {/* <FormGroup>
    <Label>Attributes</Label>
    <Input value={product.attributes} />
  </FormGroup> */}
      <FormGroup>
        <Label>Image</Label>
        <Input value={product.image} />
      </FormGroup>
      <FormGroup>
        <Label>Other Images</Label>
        <Input value={product.otherImages} />
      </FormGroup>
      <FormGroup>
        <Label>Vendor Id</Label>
        <Input value={product.vendorId} />
      </FormGroup>
      <FormGroup>
        <Label>Category</Label>
        <Input value={product.category} />
      </FormGroup>
      <FormGroup>
        <Label>Stock</Label>
        <Input value={product.stock} />
      </FormGroup>
      <FormGroup>
        <Label>Best Seller</Label>
        <Input />
      </FormGroup>
      <FormGroup>
        <Label>Best Seller Priority</Label>
        <Input value={product.bestSellerPriority} />
      </FormGroup>
      <div className="flex justify-end py-2">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

function FormGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid items-center gap-1 py-2 md:grid-cols-[25ch,1fr] md:gap-4">
      {children}
    </div>
  );
}
