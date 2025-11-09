import type { ReactNode } from 'react';

interface MainProps {
  children: ReactNode;
}

export default function Main({ children }: MainProps) {
  return <main className="mx-auto max-w-5xl flex-1 px-4 py-8">{children}</main>;
}
