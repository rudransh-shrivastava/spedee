export async function GET() {
  // call localhost:3000/api/vendor/create with params

  const vendor = {
    name: "VendorTest",
    location: {
      lat: 100,
      lng: 2003,
    },
    phoneNo: "+91 8929292929",
    address: "The address of the vendor",
    isOpen: true,
    openDays: ["MONDAY", "TUESDAY"],
    openTime: [
      {
        day: "MONDAY",
        openingTime: "1040",
        closingTime: "1140",
      },
    ],
  };

  const response = await fetch("http://localhost:3000/api/vendor/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vendor),
  });

  console.log("response", response);
  return new Response("Hello World");
}
