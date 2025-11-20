import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  ImageIcon,
  Music2Icon,
  PlayCircleIcon,
  SlidersHorizontalIcon,
  Share2Icon,
} from 'lucide-react';

const STORAGE_KEY = 'tempoPose.helpDialogDismissed';

const helpSteps = [
  {
    icon: ImageIcon,
    title: 'Pick a pose',
    description: 'Browse the library or upload your own image to start.',
  },
  {
    icon: Music2Icon,
    title: 'Set the tempo',
    description: 'Drag the BPM slider or tap tempo to sync every animation.',
  },
  {
    icon: PlayCircleIcon,
    title: 'Preview moves',
    description: 'Scrub the timeline and toggle layers to isolate motions.',
  },
  {
    icon: SlidersHorizontalIcon,
    title: 'Fine-tune cues',
    description: 'Adjust easing, delays, and loop counts for smooth transitions.',
  },
  {
    icon: Share2Icon,
    title: 'Export & share',
    description: 'Download the sequence or copy a link when you are ready.',
  },
] as const;

export default function FirstTimeHelpDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hasDismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!hasDismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    if (!nextOpen && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Quick start guide</DialogTitle>
          <DialogDescription>
            Five pointers to help you get the most out of Tempo Pose right away.
          </DialogDescription>
        </DialogHeader>

        <ol className="space-y-4">
          {helpSteps.map((step) => (
            <li key={step.title} className="flex items-start gap-4">
              <span className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
                <step.icon className="size-5" aria-hidden />
              </span>
              <div className="space-y-1">
                <p className="font-medium">{step.title}</p>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <DialogFooter>
          <Button className="mt-4 w-full" onClick={() => handleOpenChange(false)}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
