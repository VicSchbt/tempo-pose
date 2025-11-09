import { Button } from './components/ui/button';

export default function App() {
  return (
    <main className="grid min-h-svh place-items-center">
      <section className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Tempo Pose</h1>
        <div className="flex items-center justify-center font-bold text-red-500">Hello world</div>
        <p className="text-muted-foreground text-sm">
          React + Vite + Tailwind + shadcn/ui is ready.
        </p>
        <Button onClick={() => alert('It works')}>Click me!</Button>
      </section>
    </main>
  );
}
