/**
 * BilanCompetence.AI - Email Templates
 */

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

/**
 * Welcome Email Template
 */
export function getWelcomeEmail(data: {
  first_name: string
  verification_link: string
}): EmailTemplate {
  return {
    subject: '[Action] BilanCompetence.AI - Vérifiez votre email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #2C3E50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2C3E50; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #F4F7F6; }
          .button { background-color: #1ABC9C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; color: #7F8C8D; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>BilanCompetence.AI</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${data.first_name},</h2>
            <p>Bienvenue sur BilanCompetence.AI! Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous:</p>
            <a href="${data.verification_link}" class="button">Vérifier mon email</a>
            <p>Ce lien est valide pendant 24 heures.</p>
            <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
          </div>
          <div class="footer">
            <p>BilanCompetence.AI - Plateforme de bilans de compétences</p>
            <p>© 2025 NETZ INFORMATIQUE. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Bonjour ${data.first_name},

      Bienvenue sur BilanCompetence.AI!

      Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le lien suivant:
      ${data.verification_link}

      Ce lien est valide pendant 24 heures.

      Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.

      BilanCompetence.AI
      © 2025 NETZ INFORMATIQUE
    `,
  }
}

/**
 * Password Reset Email Template
 */
export function getPasswordResetEmail(data: {
  first_name: string
  reset_link: string
}): EmailTemplate {
  return {
    subject: '[Action] BilanCompetence.AI - Réinitialisation de mot de passe',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #2C3E50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2C3E50; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #F4F7F6; }
          .button { background-color: #E74C3C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; color: #7F8C8D; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>BilanCompetence.AI</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${data.first_name},</h2>
            <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
            <a href="${data.reset_link}" class="button">Réinitialiser mon mot de passe</a>
            <p>Ce lien est valide pendant 1 heure.</p>
            <p>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
          </div>
          <div class="footer">
            <p>BilanCompetence.AI - Plateforme de bilans de compétences</p>
            <p>© 2025 NETZ INFORMATIQUE. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Bonjour ${data.first_name},

      Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.

      Pour réinitialiser votre mot de passe, cliquez sur le lien suivant:
      ${data.reset_link}

      Ce lien est valide pendant 1 heure.

      Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email.

      BilanCompetence.AI
      © 2025 NETZ INFORMATIQUE
    `,
  }
}

/**
 * Bénéficiaire Invitation Email Template
 */
export function getBeneficiaireInviteEmail(data: {
  beneficiaire_name: string
  consultant_name: string
  invitation_link: string
}): EmailTemplate {
  return {
    subject: '[Info] Invitation à un bilan de compétences',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #2C3E50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1ABC9C; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #F4F7F6; }
          .button { background-color: #1ABC9C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; color: #7F8C8D; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nouveau bilan de compétences</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${data.beneficiaire_name},</h2>
            <p>Votre consultant <strong>${data.consultant_name}</strong> vous invite à démarrer votre bilan de compétences sur BilanCompetence.AI.</p>
            <p>Cette plateforme vous permettra de:</p>
            <ul>
              <li>Réaliser votre auto-évaluation en ligne</li>
              <li>Échanger avec votre consultant</li>
              <li>Suivre l'avancement de votre bilan</li>
              <li>Recevoir votre document de synthèse</li>
            </ul>
            <a href="${data.invitation_link}" class="button">Démarrer mon bilan</a>
            <p>Nous vous souhaitons un excellent parcours de développement professionnel!</p>
          </div>
          <div class="footer">
            <p>BilanCompetence.AI - Plateforme de bilans de compétences</p>
            <p>© 2025 NETZ INFORMATIQUE. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Bonjour ${data.beneficiaire_name},

      Votre consultant ${data.consultant_name} vous invite à démarrer votre bilan de compétences sur BilanCompetence.AI.

      Pour commencer, cliquez sur le lien suivant:
      ${data.invitation_link}

      Nous vous souhaitons un excellent parcours de développement professionnel!

      BilanCompetence.AI
      © 2025 NETZ INFORMATIQUE
    `,
  }
}

/**
 * Bilan Completion Email Template
 */
export function getBilanCompletionEmail(data: {
  beneficiaire_name: string
  pdf_download_link: string
}): EmailTemplate {
  return {
    subject: '[Info] Votre bilan de compétences est terminé',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #2C3E50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #27AE60; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #F4F7F6; }
          .button { background-color: #27AE60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; color: #7F8C8D; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Félicitations!</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${data.beneficiaire_name},</h2>
            <p>Votre bilan de compétences est maintenant terminé!</p>
            <p>Vous pouvez télécharger votre document de synthèse en cliquant sur le bouton ci-dessous:</p>
            <a href="${data.pdf_download_link}" class="button">Télécharger mon document</a>
            <p>Ce document contient:</p>
            <ul>
              <li>L'analyse de vos compétences</li>
              <li>Les recommandations de votre consultant</li>
              <li>Votre plan d'action personnalisé</li>
            </ul>
            <p>Nous vous souhaitons beaucoup de succès dans votre projet professionnel!</p>
          </div>
          <div class="footer">
            <p>BilanCompetence.AI - Plateforme de bilans de compétences</p>
            <p>© 2025 NETZ INFORMATIQUE. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Bonjour ${data.beneficiaire_name},

      Félicitations! Votre bilan de compétences est maintenant terminé!

      Vous pouvez télécharger votre document de synthèse à l'adresse suivante:
      ${data.pdf_download_link}

      Nous vous souhaitons beaucoup de succès dans votre projet professionnel!

      BilanCompetence.AI
      © 2025 NETZ INFORMATIQUE
    `,
  }
}

/**
 * New Message Notification Email Template
 */
export function getNewMessageEmail(data: {
  receiver_name: string
  sender_name: string
  message_preview: string
  message_link: string
}): EmailTemplate {
  return {
    subject: `Nouveau message de ${data.sender_name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #2C3E50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2C3E50; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #F4F7F6; }
          .message-preview { background-color: white; padding: 15px; border-left: 4px solid #1ABC9C; margin: 20px 0; }
          .button { background-color: #1ABC9C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; color: #7F8C8D; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Nouveau message</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${data.receiver_name},</h2>
            <p>Vous avez reçu un nouveau message de <strong>${data.sender_name}</strong>:</p>
            <div class="message-preview">
              <p>${data.message_preview}</p>
            </div>
            <a href="${data.message_link}" class="button">Voir le message</a>
          </div>
          <div class="footer">
            <p>BilanCompetence.AI - Plateforme de bilans de compétences</p>
            <p>© 2025 NETZ INFORMATIQUE. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Bonjour ${data.receiver_name},

      Vous avez reçu un nouveau message de ${data.sender_name}:

      "${data.message_preview}"

      Pour voir le message complet:
      ${data.message_link}

      BilanCompetence.AI
      © 2025 NETZ INFORMATIQUE
    `,
  }
}
