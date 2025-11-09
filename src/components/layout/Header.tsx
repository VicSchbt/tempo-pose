import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="border-border bg-background sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <h1 className="text-lg font-semibold tracking-tight">Tempo Pose</h1>
        <Button variant="outline" size="sm" onClick={() => alert('Settings coming soon!')}>
          Settings
        </Button>
      </div>
    </header>
  );
}
