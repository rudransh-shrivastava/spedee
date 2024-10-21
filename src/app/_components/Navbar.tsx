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
import { CircleUser, LocateIcon, MapPin, Search } from "lucide-react";
import { useLocationContext } from "@/app/_components/LocationProvider";
import { useQuery } from "@tanstack/react-query";
import { queries } from "../_data/queries";
import { Error } from "@/components/Error";

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
      <div className="hidden shrink-0 items-center justify-center md:flex">
        <LocationDialog />
      </div>
      <div className="hidden w-full shrink items-center justify-center md:flex">
        <div className="h-9 w-full rounded-lg border bg-secondary/20"></div>
      </div>
      <div className="hidden items-center justify-center md:flex">
        <Button className="gap-2" asChild>
          <Link href="/cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className="fill-current"
            >
              <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h440q17 0 28.5 11.5T760-320q0 17-11.5 28.5T720-280H280q-45 0-68-39.5t-2-78.5l54-98-144-304H80q-17 0-28.5-11.5T40-840q0-17 11.5-28.5T80-880h65q11 0 21 6t15 17l27 57Zm134 280h280-280Z" />
            </svg>
            My Cart
          </Link>
        </Button>
      </div>
      <div className="ml-auto flex shrink-0 items-center justify-center md:ml-0">
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
            <DropdownMenuContent sideOffset={32} align="end">
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

function LocationDialog() {
  const { location, updateLocation, locationPopupOpen, setLocationPopupOpen } =
    useLocationContext();
  const [detectLocationStatus, setDetectLocationStatus] = useState<{
    status: "idle" | "pending" | "error" | "success";
    message: string;
  }>({ status: "idle", message: "" });

  const detectCurrentLocation = () => {
    setDetectLocationStatus({ status: "pending", message: "" });
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          updateLocation(coords);
          setDetectLocationStatus({ status: "success", message: "" });
        },
        (err) => {
          setDetectLocationStatus({ status: "error", message: err.message });
        }
      );
    } else {
      setDetectLocationStatus({
        status: "error",
        message: "Geolocation is not supported on this device",
      });
    }
  };

  return (
    <Dialog
      open={locationPopupOpen}
      onOpenChange={(e) => {
        setLocationPopupOpen(e);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-sm">
          {location ? JSON.stringify(location) : "Location"}
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
          <Button
            variant="secondary"
            className="relative"
            onClick={() => {
              detectCurrentLocation();
            }}
          >
            <span
              className={cn(
                "flex items-center gap-1",
                detectLocationStatus.status === "pending"
                  ? "text-transparent"
                  : ""
              )}
            >
              <LocateIcon />
              Detect Current Location
            </span>
            {detectLocationStatus.status === "pending" && (
              <Loader className="absolute size-6" />
            )}
          </Button>
          <span>OR</span>
          <SearchLocation />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type Place = {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: { length: number; offset: number }[];
    secondary_text: string;
  };
  types: string[];
};

function highlightMatchedText(
  text: string,
  matchedSubstrings: { length: number; offset: number }[]
): string[] {
  const highlightedText = [];
  let currentIndex = 0;

  matchedSubstrings.forEach(({ length, offset }) => {
    if (offset > currentIndex) {
      highlightedText.push(text.substring(currentIndex, offset));
    }
    highlightedText.push(
      <strong key={offset}>{text.substring(offset, offset + length)}</strong>
    );
    currentIndex = offset + length;
  });

  if (currentIndex < text.length) {
    highlightedText.push(text.substring(currentIndex));
  }

  return highlightedText;
}

function SearchLocation() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, status } = useQuery<Place[]>(queries.locations(searchQuery));

  console.log(status);

  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-1 size-6 stroke-foreground/70" />
        <Input
          type="text"
          placeholder="Enter your location"
          className="w-full pl-9 shadow-none"
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
      </div>
      <div className="flex min-h-[20rem] flex-col items-center gap-2 py-2">
        {searchQuery.length === 0 && (
          <div className="my-auto">Search a Location</div>
        )}
        {searchQuery &&
          status === "pending" &&
          [1, 1, 1, 1, 1].map((_, index) => (
            <div
              className="flex w-full animate-pulse items-center rounded-lg"
              key={index}
            >
              <div className="px-2">
                <MapPin className="stroke-foreground/40" />
              </div>
              <div className="flex w-full flex-col gap-1 p-2">
                <div className="w-max select-none rounded-full bg-foreground/10 text-transparent">
                  Searching Location
                </div>
                <div className="w-max select-none rounded-full bg-foreground/10 text-sm font-light leading-tight text-transparent">
                  Searching Location Secondary Text
                </div>
              </div>
            </div>
          ))}

        {status === "error" && <Error className="my-auto" />}
        {data &&
          data.map((place) => (
            <div
              key={place.place_id}
              className="flex w-full cursor-pointer items-center rounded-lg hover:bg-secondary"
            >
              <div className="px-2">
                <MapPin className="stroke-foreground/75" />
              </div>
              <div className="flex flex-col p-2">
                <div className="text-lg">
                  {highlightMatchedText(
                    place.structured_formatting.main_text,
                    place.structured_formatting.main_text_matched_substrings
                  )}
                </div>
                <div className="text-sm font-light leading-tight text-foreground/70">
                  {place.structured_formatting.secondary_text}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
