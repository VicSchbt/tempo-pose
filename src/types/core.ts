export type SessionStatus = 'idle' | 'running' | 'paused' | 'finished';

export type SessionEndReason = 'manual' | 'completed';

export type SessionSummary = {
  totalImages: number;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  reason: SessionEndReason;
};

export type ImageStatus = 'ok' | 'broken';

export type ImageItem = {
  id: string;
  name: string;
  url: string; // object URL for preview
  file: File; // original file
  status: ImageStatus;
};

export type TimerPresetId = '30s' | '60s' | '2m' | '5m' | 'custom';
