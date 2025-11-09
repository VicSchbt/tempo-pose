import { useStore } from '@/store';
import { nanoid } from 'nanoid';

export default function ImageDrop() {
  const addImages = useStore((s) => s.addImages);

  const onFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const imgs = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => {
        const url = URL.createObjectURL(f);
        return { id: nanoid(), url, name: f.name };
      });
    addImages(imgs);
  };
  return (
    <label className="block cursor-pointer rounded border border-dashed p-6 text-center">
      <input
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => onFilesSelected(e.target.files)}
      />
      <span>Drop or click to add images</span>
    </label>
  );
}
