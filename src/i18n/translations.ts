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
        fineTune: {
          title: 'Fine-tune cues',
          description: 'Adjust easing, delays, and loop counts for smooth transitions.',
        },
        exportShare: {
          title: 'Export & share',
          description: 'Download the sequence or copy a link when you are ready.',
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
};

const frTranslation: typeof enTranslation = {
  app: {
    name: 'Tempo Pose',
  },
  languageSwitch: {
    label: 'Langue',
    aria: 'Changer de langue',
    english: 'Anglais',
    french: 'Français',
  },
  header: {
    settings: 'Paramètres',
    settingsSoon: 'Paramètres bientôt disponibles !',
  },
  footer: {
    copy: '© {{year}} {{appName}}. Tous droits réservés.',
  },
  theme: {
    toggle: 'Changer de thème',
  },
  home: {
    sessionHeading: 'Séance',
    galleryHeading: 'Galerie',
  },
  session: {
    controlsAria: 'Contrôles de séance',
    heading: 'Séance',
    start: 'Lancer la séance',
    needImages: 'Ajoutez au moins une image avant de démarrer une séance',
    noActive: 'Aucune séance en cours',
    goHome: 'Retour à l’accueil',
    imageMissing: 'Image introuvable',
    view: {
      ariaLabel: 'Vue de séance',
      keyboardActive: 'Raccourcis clavier actifs',
      keyboardInactive: 'Cliquez pour activer les raccourcis clavier',
      end: 'Terminer la séance',
      progress: 'Progression :',
      remaining: 'Restant :',
      nextImageIn: 'Prochaine image dans :',
      paused: 'En pause',
      previous: 'Précédent',
      next: 'Suivant',
      pause: 'Pause',
      resume: 'Reprendre',
      imageFallback: 'Image',
      referenceFallback: 'Image de référence',
      badges: {
        pause: 'pause/reprise',
        next: 'suivant',
        prev: 'précédent',
      },
    },
  },
  timer: {
    heading: 'Minuteur',
    sectionAria: 'Contrôles du minuteur',
    presetsAria: 'Préréglages du minuteur',
    presets: {
      '30s': '30 s',
      '60s': '1 min',
      '2m': '2 min',
      '5m': '5 min',
      custom: 'Personnalisé',
    },
    customLabel: 'Personnalisé (mm:ss)',
    placeholder: '4:30',
    customInputAria: 'Durée personnalisée en minutes et secondes',
    validation: {
      format: 'Saisissez un temps au format mm:ss (ex. 4:30)',
      min: 'La valeur minimale est {{value}}',
      max: 'La valeur maximale est {{value}} ({{minutes}} minutes)',
    },
    summaryLabel: 'Total :',
    summarySuffix: ' s',
    tooltip: 'L’image change toutes les {{seconds}} secondes.',
  },
  gallery: {
    empty: 'Aucune image pour le moment. Déposez des fichiers pour commencer.',
    countAria: 'Nombre total d’images : {{count}}',
    countTitleSingle: '{{count}} image',
    countTitlePlural: '{{count}} images',
    moreOverlay: '+{{count}} supplémentaires',
    hideAria: 'Masquer les vignettes supplémentaires',
    hideLabel: 'Masquer',
    clearAll: 'Tout effacer',
    confirm: {
      title: 'Effacer toutes les images ?',
      description: 'Toutes les vignettes seront définitivement supprimées.',
      confirm: 'Oui, tout effacer',
      cancel: 'Annuler',
    },
  },
  images: {
    drop: {
      label: 'Glissez-déposez des images ici ou cliquez pour sélectionner',
      hintSingle: 'Formats acceptés : {{accept}} • Taille max : {{size}}',
      hintMultiple: 'Plusieurs fichiers • Formats : {{accept}} • Taille max : {{size}}',
      dropNow: 'Déposez les fichiers maintenant',
      ready: 'Zone de dépôt prête',
    },
    thumb: {
      failed: 'Échec du chargement de l’image',
      remove: 'Supprimer',
      overlayAction: '{{label}} – afficher toutes les vignettes',
      removeAria: 'Supprimer {{label}}',
    },
  },
  dialogs: {
    confirm: {
      title: 'Êtes-vous sûr ?',
      description: 'Cette action est irréversible.',
      confirm: 'Confirmer',
      cancel: 'Annuler',
    },
    help: {
      title: 'Guide de prise en main',
      description: 'Cinq conseils pour profiter immédiatement de Tempo Pose.',
      steps: {
        pickPose: {
          title: 'Choisir une pose',
          description: 'Parcourez la bibliothèque ou importez vos images.',
        },
        setTempo: {
          title: 'Régler le tempo',
          description: 'Ajustez le BPM ou tapez le tempo pour synchroniser.',
        },
        previewMoves: {
          title: 'Prévisualiser les mouvements',
          description: 'Balayez la timeline et isolez les calques voulus.',
        },
        fineTune: {
          title: 'Ajuster les repères',
          description: 'Modifiez les ralentis, délais et boucles pour fluidifier.',
        },
        exportShare: {
          title: 'Exporter et partager',
          description: 'Téléchargez la séquence ou copiez un lien prêt à l’emploi.',
        },
      },
      dismiss: 'Compris',
    },
  },
  toasts: {
    duplicateSingle: '{{count}} fichier dupliqué ignoré',
    duplicatePlural: '{{count}} fichiers dupliqués ignorés',
    validationOverflow: '+{{count}} problèmes supplémentaires',
    validationType: '{{file}} n’est pas un format d’image pris en charge.',
    validationSize: '{{file}} est trop volumineux ({{size}}).',
  },
  accessibility: {
    intervalProgress: 'Progression de l’intervalle',
    resumeSession: 'Reprendre la séance',
    pauseSession: 'Mettre la séance en pause',
    mute: 'Couper le son',
    unmute: 'Activer le son',
    enterFullscreen: 'Activer le plein écran',
    exitFullscreen: 'Quitter le plein écran',
  },
  fullscreen: {
    unsupported: 'plein écran non pris en charge (geste requis sur iOS)',
    enter: 'plein écran',
    exit: 'quitter le plein écran',
  },
  endSession: {
    badge: 'Séance terminée',
    title: 'Merci pour votre entraînement',
    reasonCompleted: 'Séance complète terminée',
    reasonManual: 'Arrêt manuel',
    statsImages: 'Images réalisées',
    statsDuration: 'Durée',
    statsAverage: 'Moyenne par image',
    backHome: 'Retour à l’accueil',
  },
};

export const translations = {
  en: enTranslation,
  fr: frTranslation,
} as const;

export type Locale = keyof typeof translations;
export type Translation = typeof enTranslation;

type Join<K extends string, P extends string> = `${K}.${P}`;
type LeafKeys<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
      ? Join<K, LeafKeys<T[K]>>
      : never;
}[keyof T & string];

export type TranslationKey = LeafKeys<Translation>;

export type TranslationParams = Record<string, string | number>;
