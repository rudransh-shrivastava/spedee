"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Role } from "@/models/Role";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const { data } = useSession();
  console.log(data?.user.role);
  return data && data.user ? (
    <div>
      <h1 className="text-2xl">Hii {data?.user.name}, How are you today</h1>
      <div className="mt-4 flex items-center gap-4 rounded-lg border p-4">
        <div>
          {data.user.image && (
            <Image
              src={data?.user.image}
              width={48}
              height={48}
              alt="Profile Pic"
              className="rounded-full"
            />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xl font-medium">
            {data.user.name}
            <Badge variant="default">
              {data.user.role &&
                data.user.role.toUpperCase()[0] +
                  data.user.role.slice(1).toLowerCase()}
            </Badge>
          </div>
          <div className="text-sm">
            {/* {data.user.role === Role.CUSTOMER && "Customer"}
            {data.user.role === Role.ADMIN && "Admin"}
            {data.user.role === Role.VENDOR && "Vendor"} */}
          </div>
          <div className="text-sm">{data.user.email}</div>
        </div>
        <div className="ml-auto flex gap-2">
          {/* {data.user.role === Role.VENDOR && ( */}
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          {/* )} */}
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <h1 className="text-2xl">Hii, Please Login</h1>
    </div>
  );
}
