export function Footer() {
  return (
    <footer className="sticky top-full w-full border-t">
      <div className="mx-auto grid max-w-screen-xl grid-cols-3 p-4 pb-8">
        <div>
          <span className="text-lg font-medium">Spedee</span>
          <div className="mt-2 flex flex-col gap-1">
            <span>About</span>
            <span>Blog</span>
            <span>FAQ</span>
            <span>Contact</span>
          </div>
        </div>
        <div>
          <span className="text-lg font-medium">Spedee</span>
          <div className="mt-2 flex flex-col gap-1">
            <span>About</span>
            <span>Blog</span>
            <span>FAQ</span>
            <span>Contact</span>
          </div>
        </div>
        <div>
          <span className="text-lg font-medium">Social</span>
          <div className="mt-2 flex flex-col gap-1">
            <span>Youtube</span>
            <span>Instagram</span>
            <span>X</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
