import { OrderType, columns } from "./columns";
import { DataTable } from "./DataTable";

export default function OrdersTable() {
  const data: OrderType[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      priority: "low",
      products: {
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        priceInPaise: 1200,
        salePriceInPaise: 12,
        attributes: { color: ["red", "blue"], size: ["small", "medium"] },
        image: "",
        otherImages: ["", ""],
        vendorEmail: "adsf@gmail.com",
        category: "category",
        stock: 12,
        bestSeller: true,
        bestSellerPriority: 12,
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
