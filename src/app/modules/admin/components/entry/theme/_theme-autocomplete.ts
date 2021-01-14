interface HintEntry {
  css: string;
  hints: { [key: string]: string; };
}

export class ThemeAutocomplete {

  private static readonly CSS_HINTS: HintEntry[] = [
    // Common
    {
      css: '.list-label',
      hints: {
        fr: 'Formulaire/Reçu - Liste à points - Libellé',
        en: 'Form/Receipt - Bullet list - Label'
      }
    },
    {
      css: '.list-value',
      hints: {
        fr: 'Formulaire/Reçu - Liste à points - Valeur',
        en: 'Form/Receipt - Bullet list - Valeur'
      }
    },
    {
      css: '.elements-list',
      hints: {
        fr: 'Formulaire/Reçu - Liste d\'éléments',
        en: 'Form/Receipt - Elements list'
      }
    },
    {
      css: '.info-header',
      hints: {
        fr: 'Formulaire/Reçu - En-tête - Conteneur',
        en: 'Form/Receipt - Header - Container'
      }
    },
    {
      css: '.header-title',
      hints: {
        fr: 'Formulaire/Reçu - En-tête - Titre',
        en: 'Form/Receipt - Header - Title'
      }
    },
    {
      css: '.header-body',
      hints: {
        fr: 'Formulaire/Reçu - En-tête - Texte',
        en: 'Form/Receipt - Header - Text'
      }
    },
    {
      css: '.block-container',
      hints: {
        fr: 'Formulaire/Reçu - Bloc',
        en: 'Form/Receipt - Block'
      }
    },
    {
      css: '.block-title',
      hints: {
        fr: 'Formulaire/Reçu - Bloc - Titre',
        en: 'Form/Receipt - Block - Title'
      }
    },
    {
      css: '.block-body',
      hints: {
        fr: 'Formulaire/Reçu - Bloc - Corps',
        en: 'Form/Receipt - Block - Body'
      }
    },
    {
      css: '.controller-container',
      hints: {
        fr: 'Formulaire/Reçu - Bloc : responsable de traitement',
        en: 'Form/Receipt - Block : data controller'
      }
    },
    {
      css: '.information-container',
      hints: {
        fr: 'Formulaire/Reçu - Bloc : informations additionnelles',
        en: 'Form/Receipt - Block : additional information'
      }
    },
    {
      css: '.sensitive-container',
      hints: {
        fr: 'Formulaire/Reçu - Bloc : données sensibles',
        en: 'Form/Receipt - Block : sensitive data'
      }
    },
    {
      css: '.third-parties-container',
      hints: {
        fr: 'Formulaire/Reçu - Bloc : tierces-parties',
        en: 'Form/Receipt - Block : third parties'
      }
    },
    {
      css: '.item-container',
      hints: {
        fr: 'Formulaire/Reçu - Elément - Conteneur',
        en: 'Form/Receipt - Item - Container'
      }
    },
    {
      css: '.item-body',
      hints: {
        fr: 'Formulaire/Reçu - Elément - Corps',
        en: 'Form/Receipt - Item - Body'
      }
    },
    {
      css: '.privacy-policy-container',
      hints: {
        fr: 'Formulaire/Reçu - Politique de confidentialité - Conteneur',
        en: 'Form/Receipt - Privacy policy - Container'
      }
    },
    {
      css: '.privacy-policy',
      hints: {
        fr: 'Formulaire/Reçu - Politique de confidentialité - Lien',
        en: 'Form/Receipt - Privacy policy - Link'
      }
    },
    {
      css: '.element',
      hints: {
        fr: 'Formulaire/Reçu - Elément - Conteneur',
        en: 'Form/Receipt - Element - Container'
      }
    },
    {
      css: '.element-header',
      hints: {
        fr: 'Formulaire/Reçu - Elément - En-tête',
        en: 'Form/Receipt - Element - Header'
      }
    },
    {
      css: '.element-title',
      hints: {
        fr: 'Formulaire/Reçu - Elément - Titre',
        en: 'Form/Receipt - Element - Title'
      }
    },
    {
      css: '.logo-container',
      hints: {
        fr: 'Formulaire/Reçu/Email - Logo - Conteneur',
        en: 'Form/Receipt/Email - Logo - Container'
      }
    },
    {
      css: '.logo',
      hints: {
        fr: 'Formulaire/Reçu/Email - Logo - Image',
        en: 'Form/Receipt/Email - Logo - Image'
      }
    },
    // Forms
    {
      css: '.consent-form',
      hints: {
        fr: 'Formulaire - Corps',
        en: 'Form - Body'
      }
    },
    {
      css: '.left',
      hints: {
        fr: 'Formulaire - Corps - Partie gauche',
        en: 'Form - Body - Left side'
      }
    },
    {
      css: '.right',
      hints: {
        fr: 'Formulaire - Corps - Partie droite',
        en: 'Form - Body - Right side'
      }
    },
    {
      css: '.switch',
      hints: {
        fr: 'Formulaire - Interrupteur - Conteneur',
        en: 'Form - Switch - Container'
      }
    },
    {
      css: '.switch-slider',
      hints: {
        fr: 'Formulaire - Interrupteur - Bouton',
        en: 'Form - Switch - Button'
      }
    },
    {
      css: '.switch-text',
      hints: {
        fr: 'Formulaire - Interrupteur - Texte',
        en: 'Form - Switch - Text'
      }
    },
    {
      css: '.switch-text.accept',
      hints: {
        fr: 'Formulaire - Interrupteur - Texte affirmatif (droite)',
        en: 'Form - Switch - Affirmative text (right)'
      }
    },
    {
      css: '.switch-text.refuse',
      hints: {
        fr: 'Formulaire - Interrupteur - Texte négatif (gauche)',
        en: 'Form - Switch - Negative text (left)'
      }
    },
    {
      css: '.info-footer',
      hints: {
        fr: 'Formulaire - Pied - Conteneur',
        en: 'Form - Footer - Container'
      }
    },
    {
      css: '.footer-body',
      hints: {
        fr: 'Formulaire - Pied - Corps',
        en: 'Form - Footer - Body'
      }
    },
    {
      css: '.accept-all-container',
      hints: {
        fr: 'Formulaire - Pied - Tout accepter - Conteneur',
        en: 'Form - Footer - Accept all - Container'
      }
    },
    {
      css: '.accept-all-container-text',
      hints: {
        fr: 'Formulaire - Pied - Tout accepter - Texte',
        en: 'Form - Footer - Accept all - Text'
      }
    },
    {
      css: '.submit-container',
      hints: {
        fr: 'Formulaire - Pied - Bouton d\'envoi - Conteneur',
        en: 'Form - Footer - Submit button - Container'
      }
    },
    {
      css: '.submit-button',
      hints: {
        fr: 'Formulaire - Pied - Bouton d\'envoi - Bouton',
        en: 'Form - Footer - Submit button - Button'
      }
    },
    // Receipts
    {
      css: '.receipt',
      hints: {
        fr: 'Reçu - Corps',
        en: 'Receipt - Body'
      }
    },
    {
      css: '.processing-response',
      hints: {
        fr: 'Reçu - Traitement - Réponse',
        en: 'Receipt - Processing - Response'
      }
    },
    {
      css: '.processing-response.accepted',
      hints: {
        fr: 'Reçu - Traitement - Réponse - Acceptée',
        en: 'Receipt - Processing - Response - Accepted'
      }
    },
    {
      css: '.processing-response.refused',
      hints: {
        fr: 'Reçu - Traitement - Réponse - Refusée',
        en: 'Receipt - Processing - Response - Refused'
      }
    },
    {
      css: '.qr-code-container',
      hints: {
        fr: 'Reçu - QR code - Conteneur',
        en: 'Receipt - QR code - Container'
      }
    },
    {
      css: '.qr-code',
      hints: {
        fr: 'Reçu - QR code - Image',
        en: 'Receipt - QR code - Image'
      }
    },
    // Emails
    {
      css: '.email-content',
      hints: {
        fr: 'Email - Conteneur',
        en: 'Email - Container'
      }
    },
    {
      css: '.email-title',
      hints: {
        fr: 'Email - Titre',
        en: 'Email - Title'
      }
    },
    {
      css: '.email-body',
      hints: {
        fr: 'Email - Corps',
        en: 'Email - Body'
      }
    },
    {
      css: '.email-button-container',
      hints: {
        fr: 'Email - Bouton - Conteneur',
        en: 'Email - Button - Container'
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
        displayText: entry.hints[language] ? entry.hints[language] : entry.css
      };
    });
  }
}
