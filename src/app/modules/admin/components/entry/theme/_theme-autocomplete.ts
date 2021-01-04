interface HintEntry {
  css: string;
  hints: { [key: string]: string; };
}

export class ThemeAutocomplete {

  private static readonly CSS_HINTS: HintEntry[] = [
    // Forms
    {
      css: '.email-content',
      hints: {
        fr: 'Email - Conteneur',
        en: 'Email - Container'
      }
    },
    // Receipts
    // ...
    // Emails
    {
      css: '.email-content',
      hints: {
        fr: 'Email - Conteneur',
        en: 'Email - Container'
      }
    },
    {
      css: '.email-button',
      hints: {
        fr: 'Email - Bouton',
        en: 'Email - Button'
      }
    },
    {
      css: '.email-button-wrapper',
      hints: {
        fr: 'Email - Bouton - Conteneur',
        en: 'Email - Button - Container'
      }
    },
    {
      css: '.email-button-content',
      hints: {
        fr: 'Email - Bouton - Texte',
        en: 'Email - Button - Text'
      }
    },
    {
      css: '.email-footer',
      hints: {
        fr: 'Email - Pied de page',
        en: 'Email - Footer'
      }
    },
    {
      css: '.email-signature',
      hints: {
        fr: 'Email - Signature',
        en: 'Email - Signature'
      }
    },
  ];

  static createSnippets(language: string): { text: string, displayText: string }[] {
    return ThemeAutocomplete.CSS_HINTS.map((entry) => {
      return {
        text: entry.css,
        displayText: entry.hints[language],
      };
    });
  }
}
