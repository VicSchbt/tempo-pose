import type { TranslationSchema } from './en';

const frTranslation = {
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
    sessionHeading: 'Session',
    galleryHeading: 'Galerie',
  },
  session: {
    controlsAria: 'Contrôles de session',
    heading: 'Session',
    start: 'Lancer la session',
    needImages: 'Ajoutez au moins une image avant de démarrer une session',
    noActive: 'Aucune session en cours',
    goHome: 'Retour à l’accueil',
    imageMissing: 'Image introuvable',
    view: {
      ariaLabel: 'Vue de session',
      keyboardActive: 'Raccourcis clavier actifs',
      keyboardInactive: 'Cliquez pour activer les raccourcis clavier',
      end: 'Terminer la session',
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
          description: 'Parcourez vos fichiers ou importez vos images.',
        },
        setTempo: {
          title: 'Régler le tempo',
          description: 'Ajustez le BPM ou tapez le temps de votre choix.',
        },
        previewMoves: {
          title: 'Prévisualiser vos images',
          description:
            'Balayez la timeline et supprimez les calques que vous ne souhaitez pas voir.',
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
} as const satisfies TranslationSchema;

export default frTranslation;
