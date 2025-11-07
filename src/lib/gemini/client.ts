/**
 * BilanCompetence.AI - Google Gemini Integration
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GOOGLE_GEMINI_API_KEY
if (!apiKey) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not set')
}

const genAI = new GoogleGenerativeAI(apiKey)

export const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
})

/**
 * CV Extraction Prompt
 * Extracts competences from a CV text
 */
export const CV_EXTRACTION_PROMPT = `
Tu es un expert en recrutement (RH) français. Analyse le texte de ce CV.
Ta mission est d'extraire les 'hard skills' (compétences techniques, logiciels, langues)
et les 'soft skills' (compétences comportementales, ex: 'gestion d'équipe', 'communication').

Ne te préoccupe que des compétences, ignore les dates et les noms d'entreprises.

Réponds UNIQUEMENT au format JSON, sans texte additionnel.

Format de réponse attendu:
{
  "hard_skills": ["JavaScript", "Gestion de projet Agile", "Suite Adobe", "Anglais C1"],
  "soft_skills": ["Leadership", "Communication interpersonnelle", "Résolution de problèmes"]
}
`

/**
 * Career Recommendation Prompt
 * Analyzes competences and suggests career paths
 */
export const CAREER_RECOMMENDATION_PROMPT = `
Tu es un consultant expert en bilans de compétences et un spécialiste du marché du travail français (référentiel ROME).

Analyse les données JSON suivantes d'un bénéficiaire. Ta mission est de fournir une analyse actionnable en 3 parties:

1. 'suggestions_metiers': 3 métiers (avec code ROME si possible) qui correspondent fortement aux compétences où la 'maitrise' ET 'l'appetence' sont élevées.
2. 'competences_a_developper': 3 compétences où 'l'appetence' est élevée mais la 'maitrise' est faible, et qui sont nécessaires pour les métiers suggérés.
3. 'resume_analyse': Un résumé court (2 phrases) pour le consultant, mettant en avant les points forts évidents.

Réponds UNIQUEMENT au format JSON, sans texte additionnel.

Format de réponse attendu:
{
  "suggestions_metiers": [
    { "rome_code": "M1805", "metier": "Chef de projet digital", "pertinence": "Élevée" },
    { "rome_code": "M1802", "metier": "Tech Lead", "pertinence": "Moyenne" }
  ],
  "competences_a_developper": [
    "Gestion de projet (Maîtrise 2, Appétence 5)",
    "Management d'équipe (Non évaluée)",
    "Stratégie produit (Non évaluée)"
  ],
  "resume_analyse": "Fort potentiel de transition vers un rôle de 'Chef de projet digital' (M1805) grâce à une appétence élevée pour la gestion et une solide base technique. L'écart principal réside dans l'expérience managériale."
}
`

/**
 * Extract competences from CV text using Gemini
 */
export async function extractCompetencesFromCV(cvText: string) {
  try {
    const prompt = `${CV_EXTRACTION_PROMPT}\n\nVoici le texte du CV:\n\n${cvText}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini')
    }

    const data = JSON.parse(jsonMatch[0])
    return {
      hard_skills: data.hard_skills || [],
      soft_skills: data.soft_skills || [],
    }
  } catch (error) {
    console.error('Gemini CV extraction error:', error)
    throw error
  }
}

/**
 * Analyze competences and provide career recommendations
 */
export async function analyzeCompetences(evaluationsData: any) {
  try {
    const prompt = `${CAREER_RECOMMENDATION_PROMPT}\n\nAnalyse ce profil:\n\n${JSON.stringify(evaluationsData, null, 2)}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Gemini competence analysis error:', error)
    throw error
  }
}
