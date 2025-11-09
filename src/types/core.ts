export type SessionStatus = 'idle' | 'running' | 'paused' | 'finished';

export type ImageRef = {
  id: string; // stable id (uuid or filename)
  url: string; // objectURL or remote URL
  name?: string; // optional display name
};

export type TimerPresetId = '30s' | '60s' | '2m' | '5m' | 'custom';
