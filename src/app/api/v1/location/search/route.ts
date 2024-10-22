import { NextRequest } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("placeId");

  if (!query) {
    return Response.json({ message: "Missing placeId" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const client = new Client({});

  try {
    const response = await client.placeDetails({
      params: {
        place_id: query,
        key: apiKey as string,
      },
    });
    return Response.json({ message: response.data, success: true });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({
        message: error.message,
        success: false,
        status: 500,
      });
    } else {
      return Response.json({
        message: "An unknown error occurred.",
        status: 500,
        success: false,
      });
    }
  }
}
