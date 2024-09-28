import { Navbar } from "@/app/_components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HomePage />
    </div>
  );
}

function HomePage() {
  return (
    <div className="mx-auto max-w-screen-xl px-8">
      <div className="py-4">
        <div
          className="h-[15rem] rounded-lg bg-[#cbff03] py-8"
          style={{
            backgroundImage:
              "linear-gradient(200deg, hsl(72, 100%, 50%),hsl(72.1, 100%, 30.2%))",
          }}
        >
          <div className="flex h-full flex-col gap-2 px-8">
            <div className="flex h-full flex-col justify-center gap-4 text-background">
              <span className="text-4xl">SPEDEE</span>
              <span>Delivery in 15 - 45 minutes</span>
            </div>
            <Button className="mt-auto w-max">Shop Now</Button>
          </div>
        </div>
      </div>
      {/* <div className="py-4">
        <div className="relative flex h-[calc(3.5rem+3.5rem+3.5rem)] flex-col items-center text-4xl font-bold">
          <div className="absolute h-[3.5rem] py-2">BEST SELLERS</div>
          <div className="absolute top-[calc(3.5rem)] h-[3.5rem] py-2 opacity-75">
            BEST SELLERS
          </div>
          <div className="absolute top-[calc(3.5rem+3.5rem)] h-[calc(3.5rem)] py-2 opacity-50">
            BEST SELLERS
          </div>
        </div>
      </div> */}
      <div className="py-4">
        <ProductCard />
      </div>
    </div>
  );
}

function ProductCard() {
  return (
    <Card className="max-w-[12rem]">
      <CardHeader className="p-4 pb-2">
        <Image src="/product-01.avif" alt="Bread" width={200} height={200} />
        <CardTitle>Modern Sandwich Bread</CardTitle>
        <CardDescription>400 g</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <span className="font-bold">&#8377;38</span>
          <Button>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}
