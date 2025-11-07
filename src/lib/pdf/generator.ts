/**
 * BilanCompetence.AI - PDF Generation Service
 */

import type { PDFSynthesisData } from '@/types'

/**
 * Generate PDF synthesis document
 */
export async function generateSynthesisPDF(data: PDFSynthesisData): Promise<Blob> {
  // Create HTML template
  const html = createSynthesisHTML(data)

  // Convert HTML to PDF using browser API
  // In production, use a service like Puppeteer or jsPDF
  const blob = await htmlToPDF(html)

  return blob
}

/**
 * Create HTML template for synthesis document
 */
function createSynthesisHTML(data: PDFSynthesisData): string {
  const { beneficiaire, consultant, bilan, evaluations, organisme } = data

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document de Synthèse - Bilan de Compétences</title>
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        body {
          font-family: 'Arial', sans-serif;
          color: #2C3E50;
          line-height: 1.6;
          font-size: 11pt;
        }
        .header {
          background-color: ${organisme.branding_color || '#2C3E50'};
          color: white;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 24pt;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 12pt;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section h2 {
          color: #1ABC9C;
          font-size: 16pt;
          border-bottom: 2px solid #1ABC9C;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .section h3 {
          color: #2C3E50;
          font-size: 13pt;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #F4F7F6;
          font-weight: bold;
          color: #2C3E50;
        }
        .competence-high {
          background-color: #D5F4E6;
        }
        .competence-medium {
          background-color: #FFF3CD;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
        }
        .info-item {
          padding: 10px;
          background-color: #F4F7F6;
          border-radius: 8px;
        }
        .info-label {
          font-weight: bold;
          color: #7F8C8D;
          font-size: 9pt;
          text-transform: uppercase;
        }
        .info-value {
          color: #2C3E50;
          font-size: 11pt;
          margin-top: 5px;
        }
        .footer {
          text-align: center;
          color: #7F8C8D;
          font-size: 9pt;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }
        .logo {
          max-height: 40px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${organisme.logo_url ? `<img src="${organisme.logo_url}" alt="${organisme.name}" class="logo">` : ''}
        <h1>Document de Synthèse</h1>
        <p>Bilan de Compétences</p>
      </div>

      <!-- Section 1: Informations du Bénéficiaire -->
      <div class="section">
        <h2>1. Informations du Bénéficiaire</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Nom complet</div>
            <div class="info-value">${beneficiaire.user?.first_name} ${beneficiaire.user?.last_name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${beneficiaire.user?.email}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Poste actuel</div>
            <div class="info-value">${beneficiaire.current_job_title || 'Non renseigné'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Secteur d'activité</div>
            <div class="info-value">${beneficiaire.current_industry || 'Non renseigné'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Consultant</div>
            <div class="info-value">${consultant.user?.first_name} ${consultant.user?.last_name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Période du bilan</div>
            <div class="info-value">${formatDate(bilan.start_date)} - ${formatDate(bilan.end_date || '')}</div>
          </div>
        </div>
      </div>

      <!-- Section 2: Résumé de l'Évaluation des Compétences -->
      <div class="section">
        <h2>2. Résumé de l'Évaluation des Compétences</h2>

        <h3>Compétences Techniques</h3>
        <table>
          <thead>
            <tr>
              <th>Compétence</th>
              <th>Catégorie</th>
              <th>Auto-Éval (Maîtrise)</th>
              <th>Auto-Éval (Appétence)</th>
              <th>Consultant (Maîtrise)</th>
              <th>Notes du Consultant</th>
            </tr>
          </thead>
          <tbody>
            ${evaluations
              .filter(e => e.competence?.category === 'Tech')
              .map(e => `
                <tr class="${getCompetenceRowClass(e.self_maitrise_level, e.self_appetence_level)}">
                  <td><strong>${e.competence?.name}</strong></td>
                  <td>${e.competence?.category}</td>
                  <td>${e.self_maitrise_level || '-'}/5</td>
                  <td>${e.self_appetence_level || '-'}/5</td>
                  <td>${e.consultant_maitrise_level || '-'}/5</td>
                  <td>${e.consultant_notes || '-'}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>

        <h3>Compétences Business</h3>
        <table>
          <thead>
            <tr>
              <th>Compétence</th>
              <th>Catégorie</th>
              <th>Auto-Éval (Maîtrise)</th>
              <th>Auto-Éval (Appétence)</th>
              <th>Consultant (Maîtrise)</th>
              <th>Notes du Consultant</th>
            </tr>
          </thead>
          <tbody>
            ${evaluations
              .filter(e => e.competence?.category === 'Business')
              .map(e => `
                <tr class="${getCompetenceRowClass(e.self_maitrise_level, e.self_appetence_level)}">
                  <td><strong>${e.competence?.name}</strong></td>
                  <td>${e.competence?.category}</td>
                  <td>${e.self_maitrise_level || '-'}/5</td>
                  <td>${e.self_appetence_level || '-'}/5</td>
                  <td>${e.consultant_maitrise_level || '-'}/5</td>
                  <td>${e.consultant_notes || '-'}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>

        <h3>Soft Skills</h3>
        <table>
          <thead>
            <tr>
              <th>Compétence</th>
              <th>Auto-Éval (Maîtrise)</th>
              <th>Auto-Éval (Appétence)</th>
              <th>Notes du Consultant</th>
            </tr>
          </thead>
          <tbody>
            ${evaluations
              .filter(e => e.competence?.category === 'Soft')
              .map(e => `
                <tr>
                  <td><strong>${e.competence?.name}</strong></td>
                  <td>${e.self_maitrise_level || '-'}/5</td>
                  <td>${e.self_appetence_level || '-'}/5</td>
                  <td>${e.consultant_notes || '-'}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Section 3: Plan d'Action -->
      <div class="section">
        <h2>3. Plan d'Action et Recommandations</h2>
        <p>${bilan.notes || 'Aucune note fournie'}</p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p><strong>Document confidentiel</strong></p>
        <p>Généré par BilanCompetence.AI | ${organisme.name}</p>
        <p>Conforme Qualiopi | RGPD</p>
        <p>© ${new Date().getFullYear()} NETZ INFORMATIQUE. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'En cours'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function getCompetenceRowClass(maitrise?: number | null, appetence?: number | null): string {
  if (!maitrise || !appetence) return ''
  const avg = (maitrise + appetence) / 2
  if (avg >= 4) return 'competence-high'
  if (avg >= 3) return 'competence-medium'
  return ''
}

/**
 * Convert HTML to PDF
 * In production, this would use Puppeteer or a PDF generation service
 */
async function htmlToPDF(html: string): Promise<Blob> {
  // For now, return the HTML as a blob
  // In production, implement actual PDF generation
  return new Blob([html], { type: 'text/html' })
}

/**
 * Upload PDF to storage and return URL
 */
export async function uploadPDFToStorage(
  blob: Blob,
  fileName: string
): Promise<string> {
  // TODO: Implement Supabase Storage upload
  // For now, return a placeholder
  return `https://storage.example.com/${fileName}`
}
