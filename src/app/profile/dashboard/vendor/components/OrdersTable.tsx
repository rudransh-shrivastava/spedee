import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./DataTable";
import axios from "axios";

export default function OrdersTable() {
  const { data } = useQuery({
    queryFn: async () => {
      const x = await axios.get("/api/v1/vendor/orders");
      return x.data.message;
    },
    queryKey: ["orders", "vendor"],
  });

  return (
    <div className="container mx-auto py-10">
      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
}
