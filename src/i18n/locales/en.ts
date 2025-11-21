const enTranslation = {
  app: {
    name: 'Tempo Pose',
  },
  languageSwitch: {
    label: 'Language',
    aria: 'Change language',
    english: 'English',
    french: 'Français',
  },
  header: {
    settings: 'Settings',
    settingsSoon: 'Settings coming soon!',
  },
  footer: {
    copy: '© {{year}} {{appName}}. All rights reserved.',
  },
  theme: {
    toggle: 'Toggle theme',
  },
  home: {
    sessionHeading: 'Session',
    galleryHeading: 'Gallery',
  },
  session: {
    controlsAria: 'Session controls',
    heading: 'Session',
    start: 'Start Session',
    needImages: 'Please add at least one image before starting a session',
    noActive: 'No active session',
    goHome: 'Go to Home',
    imageMissing: 'Image not found',
    view: {
      ariaLabel: 'Session view',
      keyboardActive: 'Keyboard shortcuts active',
      keyboardInactive: 'Click to enable keyboard shortcuts',
      end: 'End Session',
      progress: 'Progress:',
      remaining: 'Remaining:',
      nextImageIn: 'Next image in:',
      paused: 'Paused',
      previous: 'Previous',
      next: 'Next',
      pause: 'Pause',
      resume: 'Resume',
      imageFallback: 'Image',
      referenceFallback: 'Reference image',
      badges: {
        pause: 'pause/resume',
        next: 'next',
        prev: 'prev',
      },
    },
  },
  timer: {
    heading: 'Timer',
    sectionAria: 'Timer controls',
    presetsAria: 'Timer presets',
    presets: {
      '30s': '30s',
      '60s': '1m',
      '2m': '2m',
      '5m': '5m',
      custom: 'Custom',
    },
    customLabel: 'Custom (mm:ss)',
    placeholder: '4:30',
    customInputAria: 'Custom time in minutes and seconds',
    validation: {
      format: 'Please enter time in mm:ss format (e.g., 4:30)',
      min: 'Minimum value is {{value}}',
      max: 'Maximum value is {{value}} ({{minutes}} minutes)',
    },
    summaryLabel: 'Total:',
    summarySuffix: 's',
    tooltip: 'Image advances every {{seconds}} seconds.',
  },
  gallery: {
    empty: 'No images yet. Drop some files above to get started.',
    countAria: 'Total images: {{count}}',
    countTitleSingle: '{{count}} image',
    countTitlePlural: '{{count}} images',
    moreOverlay: '+{{count}} more',
    hideAria: 'Hide extra thumbnails',
    hideLabel: 'Hide',
    clearAll: 'Clear all',
    confirm: {
      title: 'Clear all images?',
      description: 'This will permanently remove all thumbnails from the gallery.',
      confirm: 'Yes, clear all',
      cancel: 'Cancel',
    },
  },
  images: {
    drop: {
      label: 'Drag & drop images here, or click to select',
      hintSingle: 'Accepted: {{accept}} • Max size: {{size}}',
      hintMultiple: 'Multiple files • Accepted: {{accept}} • Max size: {{size}}',
      dropNow: 'Drop files now',
      ready: 'Drop zone ready',
    },
    thumb: {
      failed: 'Failed to load image',
      remove: 'Remove',
      overlayAction: '{{label}} – show all thumbnails',
      removeAria: 'Remove {{label}}',
    },
  },
  dialogs: {
    confirm: {
      title: 'Are you sure?',
      description: 'This action cannot be undone.',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    help: {
      title: 'Quick start guide',
      description: 'Five pointers to help you get the most out of Tempo Pose right away.',
      steps: {
        pickPose: {
          title: 'Pick a pose',
          description: 'Browse the library or upload your own image to start.',
        },
        setTempo: {
          title: 'Set the tempo',
          description: 'Drag the BPM slider or tap tempo to sync every animation.',
        },
        previewMoves: {
          title: 'Preview moves',
          description: 'Scrub the timeline and toggle layers to isolate motions.',
        },
        exportShare: {
          title: 'Export & share',
          description: 'Download the sequence stats or copy a link when you are ready.',
        },
      },
      dismiss: 'Got it',
    },
  },
  toasts: {
    duplicateSingle: '{{count}} duplicate file ignored',
    duplicatePlural: '{{count}} duplicate files ignored',
    validationOverflow: '+{{count}} more issues',
    validationType: '{{file}} is not a supported image type.',
    validationSize: '{{file}} is too large ({{size}}).',
  },
  accessibility: {
    intervalProgress: 'Interval progress',
    resumeSession: 'Resume session',
    pauseSession: 'Pause session',
    mute: 'Mute sounds',
    unmute: 'Unmute sounds',
    enterFullscreen: 'Enter fullscreen',
    exitFullscreen: 'Exit fullscreen',
  },
  fullscreen: {
    unsupported: 'fullscreen not supported (use device gesture on iOS)',
    enter: 'fullscreen',
    exit: 'exit fullscreen',
  },
  endSession: {
    badge: 'Session ended',
    title: 'Thanks for completing your practice',
    reasonCompleted: 'Full session completed',
    reasonManual: 'Ended manually',
    statsImages: 'Images completed',
    statsDuration: 'Duration',
    statsAverage: 'Average per image',
    backHome: 'Back to Home',
  },
} as const;

type DeepString<T> = T extends string ? string : { [K in keyof T]: DeepString<T[K]> };

export type TranslationSchema = DeepString<typeof enTranslation>;
export default enTranslation;
