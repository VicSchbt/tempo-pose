export type SessionStatus = 'idle' | 'running' | 'paused' | 'finished';

export type ImageItem = {
  id: string;
  name: string;
  url: string; // object URL for preview
  file: File; // original file
};

export type TimerPresetId = '30s' | '60s' | '2m' | '5m' | 'custom';
