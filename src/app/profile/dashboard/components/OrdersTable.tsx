import { OrderType, columns } from "./columns";
import { DataTable } from "./DataTable";

export default function OrdersTable() {
  const data: OrderType[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      priority: "low",
      products: [
        {
          productId: "1",
          title: "Product 1",
          description: "Product 1 description",
          priceInPaise: 1200,
          salePriceInPaise: 12,
          attributes: { color: ["red", "blue"], size: ["small", "medium"] },
          image: "",
          otherImages: ["", ""],
          vendorId: "adsf",
          category: "category",
          stock: 12,
          bestSeller: true,
          bestSellerPriority: 12,
        },
      ],
    },

    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      priority: "high",
      products: [],
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      priority: "medium",
      products: [],
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
