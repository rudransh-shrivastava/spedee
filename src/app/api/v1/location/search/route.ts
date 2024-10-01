import { NextRequest } from "next/server";
// import { Client } from "@googlemaps/google-maps-services-js";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json(
      { message: "Missing query parameter." },
      { status: 400 }
    );
  }

  // const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // const client = new Client({});
  // TODO: implement
  return Response.json({ message: "testing " });
}
