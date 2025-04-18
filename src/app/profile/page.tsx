"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Role } from "@/models/Role";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Page() {
  const { data } = useSession();
  const { theme, setTheme } = useTheme();
  const [themeText, setThemeText] = React.useState("");

  React.useEffect(() => {
    if (theme) {
      setThemeText(theme[0].toUpperCase() + theme?.slice(1));
    }
  }, [theme]);
  return (
    <div>
      {data && data.user ? (
        <div>
          <h1 className="text-2xl font-semibold text-secondary-foreground">
            Hii {data?.user.name}, How are you today
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 border p-4">
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
            <div className="mx-auto flex gap-2 sm:ml-auto sm:mr-0 sm:w-auto">
              {data.user.role === Role.VENDOR && (
                <Button asChild>
                  <Link href="/profile/dashboard/vendor">Dashboard</Link>
                </Button>
              )}
              {data.user.role === Role.ADMIN && (
                <Button asChild>
                  <Link href="/profile/dashboard/admin">Dashboard</Link>
                </Button>
              )}
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
          <h1 className="text-2xl font-semibold text-secondary-foreground">
            Hii, Please Login
          </h1>
        </div>
      )}

      {themeText && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mt-4">
              Theme: {themeText}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
