export const en = {
  settings: {
    language: {
      label: 'Language',
      auto: 'Automatic (browser language)',
      hint: 'Choose the interface language. Your prompts are never translated.',
    },
  },
  header: {
    openMenu: 'Open menu',
    searchButton: 'Search prompts and templates',
    searchPlaceholder: 'Search prompts, templates...',
    notifications: 'Notifications',
    help: 'Help',
    userRole: 'Lead Prompt Eng.',
  },
  sidebar: {
    platform: 'Platform',
    collapse: 'Collapse sidebar',
    mainNav: 'Main',
    promptCount: '{{total}} prompts',
  },
  search: {
    dialogLabel: 'Search',
    placeholder: 'Search prompts, templates, pages...',
    results: 'Results',
    recent: 'Recent prompts',
    noResults: 'No results for “{{query}}”.',
    empty: 'No prompts yet. Create one from the editor.',
    total: 'Results: {{total}}',
    hint: {
      prompt: 'Open in editor',
      template: 'Create prompt from template',
      page: 'Go to page',
    },
    footer: {
      navigate: '↑↓ navigate',
      select: '↵ select',
      close: 'Esc close',
    },
    pages: {
      newPrompt: 'New prompt',
      compare: 'Compare versions',
    },
  },
    nav: {
    dashboard: 'Dashboard',
    library: 'Prompt Library',
    editor: 'Prompt Editor',
    templates: 'Templates',
    history: 'History',
    favorites: 'Favorites',
    settings: 'Settings',
  },
  
  common: {
    toggleTheme: 'Toggle theme',
    justNow: 'just now',
    dateFormat: 'MMM d',
  },
  dashboard: {
    hero: {
      badge: 'Telemetry Engine Active',
      title: 'Welcome back, {{name}}!',
      summary:
        'You have <tests>{{activeTests}} prompt tests active</tests> across {{modelCount}} LLM models. Overall pipeline efficiency is up <gain>+{{efficiencyGain}}% this week</gain>.',
      optimize: 'Optimize Pipeline',
      newPrompt: 'New Prompt',
    },
    stats: {
      totalPrompts: 'Total Prompts',
      newThisMonth: 'new this month',
      favorites: 'Favorite Prompts',
      shareOfLibrary: '{{percent}}% of your library',
      productionReady: 'Production Ready',
      projects: 'Active Projects',
      subfolders: '{{total}} subfolders',
      savedTime: 'Saved Time',
      hours: 'hrs',
      estRoi: 'Est. ROI: {{value}}',
      thisCycle: 'this cycle',
    },
        recent: {
      title: 'Recent Prompts',
      subtitle: 'Synchronized across production pipelines',
      filterLabel: 'Filter prompts',
      tabs: {
        all: 'All ({{total}})',
        production: 'Production',
        testing: 'Testing',
        drafts: 'Drafts',
      },
      empty: 'No prompts in this category yet.',
    },
    templates: {
      title: 'Quick Template Launchers',
      exploreAll: 'Explore All {{total}} Templates',
      use: 'Use Template',
      items: {
        email: {
          title: 'Cold Email Pitch Engine',
          description:
            'Calculates recipient company pain-points from Crunchbase signals and writes hyper-personalized outreaches.',
        },
        docs: {
          title: 'API Docs Synthesizer',
          description:
            'Ingests raw OpenAPI 3.1 JSON schemas and outputs production-grade Mintlify & Docusaurus MDX specs.',
        },
        refactor: {
          title: 'Code Refactoring Agent',
          description:
            'Eliminates anti-patterns, optimizes space/time complexity, and writes comprehensive Vitest test coverage suites.',
        },
      },
    },
    playground: {
      title: 'Variable Playground',
      promptTemplate: 'Prompt Template',
      activeVariables: 'Active Variables',
      dynamicTags: '{{total}} dynamic tags',
      required: 'Required',
      optional: 'Optional',
      tokens: '~{{tokens}} tokens (${{cost}})',
      running: 'Running…',
      run: 'Run Test',
      fillRequired: 'Fill in the required variables to run a test.',
      simulated: 'Simulated output ({{ms}}ms)',
      closeOutput: 'Close output',
    },
    benchmarks: {
      title: 'Model Benchmarks',
      live: 'Live P95',
      normalized: 'Latency index normalized',
      matrix: 'Detailed matrix',
    },
  },

}