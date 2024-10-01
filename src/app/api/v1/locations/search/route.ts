import { NextRequest } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json(
      { message: "Missing query parameter." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const client = new Client({});

  try {
    const response = await client.placeAutocomplete({
      params: {
        input: query,
        location: { lat: 28.6139, lng: 77.209 }, // Latitude and Longitude for Delhi
        radius: 100000, // 100 kilometers radius
        key: apiKey as string,
      },
    });

    return Response.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    } else {
      return Response.json(
        { message: "An unknown error occurred." },
        { status: 500 }
      );
    }
  }
}
