import { useStore } from '@/store';

export default function CurrentImage() {
  const images = useStore((s) => s.images);
  const currentIndex = useStore((s) => s.currentIndex);

  if (currentIndex == null || !images[currentIndex]) {
    return <p className="text-muted-foreground text-sm">No image selected.</p>;
  }

  const img = images[currentIndex];
  return (
    <figure className="mx-auto max-w-3xl">
      {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
      <img src={img.url} alt={img.name ?? 'Reference image'} className="h-auto w-full rounded" />
      <figcaption className="text-muted-foreground mt-2 text-center text-sm">
        {img.name ?? 'Image'}
      </figcaption>
    </figure>
  );
}
