export default function Loader({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        className="h-full w-full animate-spin fill-foreground stroke-secondary"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeMiterlimit="10"
          strokeWidth="10"
        />
        <path d="M100,50a5,5,0,0,1-10,0A40,40,0,0,0,50,10,5,5,0,0,1,50,0,50,50,0,0,1,100,50Z" />
      </svg>
    </div>
  );
}
