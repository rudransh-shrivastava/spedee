import { NextRequest } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  if (!placeId && (!lat || !lng)) {
    return Response.json(
      { message: "Missing placeId OR lat & lng" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const client = new Client({});
  if (placeId) {
    try {
      const response = await client.placeDetails({
        params: {
          place_id: placeId,
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
  if (lat && lng) {
    try {
      const response = await client.reverseGeocode({
        params: {
          latlng: `${lat},${lng}`,
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
}
