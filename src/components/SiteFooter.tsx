export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl">Gowri Optical</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Family-owned eyewear since 1986. Honest prescriptions, beautiful frames, modern fitting
            tech.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Visit us</p>
          <p className="mt-2 text-muted-foreground">
            12, Ranganathan Street
            <br />
            T. Nagar, Chennai 600017
            <br />
            Open daily · 10am–9pm
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Contact</p>
          <p className="mt-2 text-muted-foreground">
            +91 98400 12345
            <br />
            hello@gowrioptical.in
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Gowri Optical. All rights reserved.
      </div>
    </footer>
  );
}
