"use client";

import {
  ReactNode,
  useContext,
  useState,
  createContext,
  useEffect,
} from "react";

type LocationType = { lat: number; lon: number };
const LOCAL_STORAGE_LOCATION_KEY = "spedee_location";

type LocationContextType = {
  location: LocationType | null;
  updateLocation: (location: LocationType) => void;
  locationPopupOpen: boolean;
  setLocationPopupOpen: (open: boolean) => void;
};

const LocationContext = createContext<LocationContextType>({
  location: null,
  updateLocation: () => {},
  locationPopupOpen: false,
  setLocationPopupOpen: () => {},
});

export const useLocationContext = () => {
  return useContext(LocationContext);
};

export default function LocationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);

  const updateLocation = (location: LocationType) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        LOCAL_STORAGE_LOCATION_KEY,
        JSON.stringify(location)
      );
    }
    setLocation(location);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLocation = localStorage.getItem(LOCAL_STORAGE_LOCATION_KEY);
      if (storedLocation) {
        setLocation(JSON.parse(storedLocation));
      } else {
        setLocationPopupOpen(true);
      }
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        updateLocation,
        locationPopupOpen,
        setLocationPopupOpen,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
