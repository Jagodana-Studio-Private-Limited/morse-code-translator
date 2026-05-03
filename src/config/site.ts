export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "Morse Code Translator",
  title: "Morse Code Translator — Text to Morse Code & Back with Audio",
  description:
    "Instantly translate text to Morse code and Morse code to text. Visual dot-and-dash display, audio playback with speed control, and one-click copy. 100% free, no login required.",
  url: "https://morse-code-translator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "Radio", // lucide-react icon name
  brandAccentColor: "#f97316", // hex accent for OG image gradient (must match --brand-accent in globals.css)

  // SEO
  keywords: [
    "morse code translator",
    "text to morse code",
    "morse code converter",
    "morse code decoder",
    "morse code generator",
    "morse code audio",
    "learn morse code",
    "online morse code tool",
    "morse code alphabet",
  ],
  applicationCategory: "UtilitiesApplication",

  // Theme
  themeColor: "#f59e0b", // used in manifest and meta tags

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  // Links
  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/morse-code-translator",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "A free, instant Morse code translator that works entirely in your browser. Convert text to Morse code or decode Morse back to text — with audio playback and visual dot-dash display.",
    featuresTitle: "Features",
    features: [
      "Text to Morse code conversion",
      "Morse code to text decoding",
      "Audio playback with speed control",
      "Visual dot-and-dash display",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free Morse Code Tool",
    titleLine1: "Translate Text to",
    titleGradient: "Morse Code",
    subtitle:
      "Instantly convert text to Morse code or decode Morse back to text. Hear it played back in your browser — no signup, no install, 100% free.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "🔤",
      title: "Bidirectional Translation",
      description:
        "Convert text to Morse code and Morse code back to readable text in one click.",
    },
    {
      icon: "🔊",
      title: "Audio Playback",
      description:
        "Listen to your Morse code with adjustable speed — from 5 WPM to 30 WPM — using the Web Audio API.",
    },
    {
      icon: "📋",
      title: "Visual Dot-Dash Display",
      description:
        "See each character's Morse pattern clearly displayed with dots (·) and dashes (—) side by side.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "Text Case Converter",
      url: "https://text-case-converter.tools.jagodana.com",
      icon: "🔡",
      description: "Convert text between uppercase, lowercase, title case, and more.",
    },
    {
      name: "String Case Converter",
      url: "https://string-case-converter.tools.jagodana.com",
      icon: "📝",
      description: "Convert strings between camelCase, snake_case, kebab-case and more.",
    },
    {
      name: "Text Hash Generator",
      url: "https://text-hash-generator.tools.jagodana.com",
      icon: "🔐",
      description: "Generate MD5, SHA-1, SHA-256 hashes from any text.",
    },
    {
      name: "Base64 Image Encoder",
      url: "https://base64-image-encoder.tools.jagodana.com",
      icon: "🖼️",
      description: "Encode images to Base64 strings for embedding in HTML/CSS.",
    },
    {
      name: "ASCII Art Generator",
      url: "https://ascii-art-generator.tools.jagodana.com",
      icon: "🎨",
      description: "Convert text and images into ASCII art.",
    },
    {
      name: "Encoding Explorer",
      url: "https://encoding-explorer.tools.jagodana.com",
      icon: "🔢",
      description: "Explore Base64, URL encoding, HTML entities and more.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    {
      name: "Type or paste your text",
      text: "Enter any text in the input field. Supported characters include letters A–Z, digits 0–9, and common punctuation.",
      url: "",
    },
    {
      name: "Choose your mode",
      text: "Select 'Text → Morse' to encode your text, or 'Morse → Text' to decode Morse code back to readable text.",
      url: "",
    },
    {
      name: "Play, copy, or share",
      text: "Click Play to hear the Morse code audio, adjust speed with the WPM slider, or copy the result to your clipboard.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M", // ISO 8601 duration

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "What is Morse code?",
      answer:
        "Morse code is a character encoding system that uses sequences of short and long signals — dots (·) and dashes (—) — to represent letters, digits, and punctuation. Developed in the 1830s by Samuel Morse, it was widely used in telegraphy and is still used in amateur radio today.",
    },
    {
      question: "How does this Morse code translator work?",
      answer:
        "Our translator maps every supported character to its standard International Morse Code equivalent. All translation happens instantly in your browser — nothing is sent to a server. The audio playback uses the Web Audio API to generate the dot and dash tones directly.",
    },
    {
      question: "What characters are supported?",
      answer:
        "The translator supports all 26 English letters (A–Z), digits 0–9, and common punctuation including period, comma, question mark, exclamation mark, slash, parentheses, ampersand, colon, semicolon, equals, plus, minus, underscore, quote, dollar sign, and at-sign.",
    },
    {
      question: "How do I decode Morse code back to text?",
      answer:
        "Switch to 'Morse → Text' mode and paste your Morse code. Separate letters with a single space and words with a forward slash (/) or triple space. The translator will instantly decode it back to plain text.",
    },
    {
      question: "What does WPM mean in the speed control?",
      answer:
        "WPM stands for Words Per Minute. In Morse code, speed is measured in WPM using the standard word 'PARIS' as the benchmark (50 elements per word). A beginner starts at 5 WPM; licensed amateur radio operators typically send at 15–25 WPM.",
    },
    {
      question: "Is this Morse code translator free?",
      answer:
        "Yes, completely free. No account, no login, no download required. The tool runs entirely in your browser.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  pages: {
    "/": {
      title:
        "Morse Code Translator — Text to Morse Code & Back with Audio",
      description:
        "Instantly translate text to Morse code and Morse code to text. Visual dot-and-dash display, audio playback with speed control, and one-click copy. 100% free.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
