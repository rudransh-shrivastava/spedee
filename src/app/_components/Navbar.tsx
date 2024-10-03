"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import { CircleUser } from "lucide-react";
import Cart from "@/app/_components/Cart";

export function Navbar() {
  const { data } = useSession();
  const [signingIn, setSigningIn] = useState(false);
  return (
    <nav className="sticky top-0 z-50 flex h-20 w-full gap-4 border-b border-border/40 bg-background px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/" className="shrink-0">
        <div className="py-4">
          <Image src="/spedee-logo.png" alt="Logo" width={48} height={48} />
        </div>
      </Link>
      <div className="flex shrink-0 items-center justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-sm">
              Select Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Location</DialogTitle>
              <DialogDescription>
                Please provide your delivery location to see products at nearby
                store
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <Button>Use Current Location</Button>
              <span>OR</span>
              <Input
                type="text"
                placeholder="Enter your location"
                className="w-full"
              />
              <div className="min-h-[10rem] p-4">No Location Found</div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex w-full shrink items-center justify-center">
        <div className="h-9 w-full rounded-lg bg-secondary"></div>
      </div>
      <div className="flex items-center justify-center">
        <Cart />
      </div>
      <div className="flex shrink-0 items-center justify-center">
        {data && data.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="relative size-9 rounded-full border"
              >
                <CircleUser className="absolute" />
                {data.user.image && (
                  <Image
                    src={data.user.image}
                    className="absolute rounded-full"
                    width={36}
                    height={36}
                    alt=""
                  />
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="px-2 py-1.5 text-sm font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {data.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {data.user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/support">Support</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="secondary"
            className="relative"
            onClick={() => {
              setSigningIn(true);
              signIn("google");
            }}
          >
            <span className={cn(signingIn ? "text-transparent" : "")}>
              Login
            </span>
            {signingIn && <Loader className="absolute size-6" />}
          </Button>
        )}
      </div>
    </nav>
  );
}
