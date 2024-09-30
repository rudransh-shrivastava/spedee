import { OrderType, columns } from "./components/columns";
import { DataTable } from "./components/DataTable";

async function getData(): Promise<OrderType[]> {
  // Fetch data from your API here.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      products: [],
    },

    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      products: [],
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      products: [],
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
