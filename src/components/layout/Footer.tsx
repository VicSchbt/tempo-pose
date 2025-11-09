export default function Footer() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="text-muted-foreground mx-auto max-w-5xl px-4 py-4 text-center text-sm">
        © {new Date().getFullYear()} Tempo Pose. All rights reserved.
      </div>
    </footer>
  );
}
