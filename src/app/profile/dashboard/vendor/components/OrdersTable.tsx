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
          id: "1",
          name: "Product 1",
          description: "Product 1 description",
          priceInPaise: 1200,
          salePriceInPaise: 12,
          attributes: { color: ["red", "blue"], size: ["small", "medium"] },
          image: "",
          otherImages: ["", ""],
          category: "category",
          stock: 12,
          bestSeller: true,
          bestSellerPriority: 12,
          variants: [],
        },
      ],
    },

    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      priority: "high",
      products: [
        {
          id: "1",
          name: "Product 2",
          description: "Product 2 description",
          priceInPaise: 1500,
          salePriceInPaise: 15,
          attributes: { color: ["green"], size: ["large"] },
          image: "",
          otherImages: ["", ""],

          category: "category",
          stock: 10,
          bestSellerPriority: 0,
          bestSeller: false,
          variants: [],
        },
      ],
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      priority: "medium",
      products: [
        {
          id: "2",
          name: "Placeholder Product",
          description: "Placeholder description",
          priceInPaise: 0,
          salePriceInPaise: 0,
          attributes: { color: [], size: [] },
          image: "",
          otherImages: ["", ""],
          category: "placeholder",
          stock: 0,
          bestSeller: false,
          bestSellerPriority: 0,
          variants: [],
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
