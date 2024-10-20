import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <div className="py-8">
      <div className="h-6 w-full max-w-[300px] animate-pulse rounded-full bg-secondary"></div>
      <div className="flex items-center justify-center py-12 text-lg">
        <Loader />
      </div>
    </div>
  );
}
