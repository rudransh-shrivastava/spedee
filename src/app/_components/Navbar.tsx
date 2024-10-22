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
import {
  ChevronDown,
  CircleUser,
  LocateIcon,
  MapPin,
  Search,
} from "lucide-react";
import { useLocationContext } from "@/app/_components/LocationProvider";
import { useQuery } from "@tanstack/react-query";
import { queries } from "../_data/queries";
import { Error } from "@/components/Error";

export function Navbar() {
  const { data } = useSession();
  const [signingIn, setSigningIn] = useState(false);
  return (
    <header className="sticky top-0 z-50">
      <nav className="mx-auto flex h-20 w-full max-w-screen-xl items-center gap-4 border-border/40 bg-background px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="shrink-0">
          <div className="py-4">
            <Image src="/spedee-logo.png" alt="Logo" width={48} height={48} />
          </div>
        </Link>
        <div className="hidden shrink-0 items-center justify-center md:flex">
          <LocationDialog />
        </div>
        <div className="relative mr-auto hidden h-10 w-full max-w-[25rem] shrink items-center justify-center bg-secondary md:flex">
          <Search className="pointer-events-none absolute left-2 size-6 stroke-foreground/80" />
          <Input className="rounded-none border-none bg-transparent pl-10 shadow-none" />
        </div>
        <div className="hidden items-center justify-center md:flex">
          <Button
            className="rounded-none hover:bg-transparent"
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href="/cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 960 960"
                width="24px"
                height="24px"
                strokeWidth={50}
                className="stroke-foreground"
              >
                <path
                  fill="none"
                  d="M780,199.75H180c-16.67,233.33-33.33,466.67-50,700
	h700C813.33,666.42,796.67,433.08,780,199.75z"
                />
                <path
                  fill="none"
                  d="M649.71,199.75H310.29
	c5.17-89.23,79.18-160,169.71-160S644.54,110.52,649.71,199.75z"
                />
                <polyline
                  fill="none"
                  points="654.42,265.75 648.84,199.75 
	310.29,199.75 309.41,199.75 303.83,265.75 "
                />
              </svg>
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
    </header>
  );
}

function LocationDialog() {
  const { location, updateLocation, locationPopupOpen, setLocationPopupOpen } =
    useLocationContext();
  const [detectLocationStatus, setDetectLocationStatus] = useState<{
    status: "idle" | "pending" | "error" | "success";
    message: string;
  }>({ status: "idle", message: "" });

  const { data: locationName, status: locationNameStatus } = useQuery({
    enabled: location ? true : false,
    ...queries.locationName({
      placeId: "",
      latitude: location?.latitude,
      longitude: location?.longitude,
    }),
  });

  const detectCurrentLocation = () => {
    setDetectLocationStatus({ status: "pending", message: "" });
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
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
        <Button variant="ghost" className="text-sm hover:bg-transparent">
          <div className="relative flex max-w-[15rem] items-center overflow-hidden">
            {locationName ? locationName : "Location"}
            <div className="to absolute right-0 h-full w-1 bg-gradient-to-tr from-transparent to-background"></div>
          </div>
          <ChevronDown strokeWidth={1.5} />
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
        <div className="bg-secondary p-2 px-3">
          <span className="self-start font-light opacity-70">Location: </span>
          {locationName ? (
            locationName
          ) : (
            <span className="ml-2 inline-block w-full max-w-40 animate-pulse select-none rounded-full bg-secondary-foreground/10 text-center text-transparent">
              Loading...
            </span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-2 py-2">
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
  const { updateLocation } = useLocationContext();

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
        {status !== "error" &&
          data &&
          data.map((place) => (
            <div
              key={place.place_id}
              className="flex w-full cursor-pointer items-center rounded-lg hover:bg-secondary"
              onClick={() => {
                queries
                  .locationCoordinates(place.place_id)
                  .queryFn()
                  .then((data) => {
                    const coordinates = {
                      latitude: data.message.result.geometry.location.lat,
                      longitude: data.message.result.geometry.location.lng,
                    };
                    updateLocation(coordinates);
                  });
              }}
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
