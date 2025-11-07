# BilanCompetence.AI - 5 Missing Documents (Action Plan)

Bu belgeleri şimdi yaz, AI agent sorunsuz geliştirsin.

---

## 📄 BELGE 1: PDF Synthesis Template (2-3 saat)

**Dosya:** `templates/synthesis-pdf.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bilan de Compétences - {{ beneficiaire.first_name }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        
        .header {
            border-bottom: 3px solid #2C3E50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
        
        .header h1 {
            color: #2C3E50;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .header .organisme {
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-title {
            background: #F4F7F6;
            color: #2C3E50;
            padding: 12px 15px;
            font-weight: 600;
            font-size: 16px;
            border-left: 4px solid #1ABC9C;
            margin-bottom: 15px;
        }
        
        .beneficiaire-info {
            background: #F9FAFB;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        
        .info-row {
            display: flex;
            margin-bottom: 10px;
        }
        
        .info-label {
            font-weight: 600;
            width: 120px;
            color: #2C3E50;
        }
        
        .info-value {
            color: #666;
            flex: 1;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        th {
            background: #2C3E50;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
        }
        
        td {
            padding: 12px;
            border-bottom: 1px solid #E0E0E0;
        }
        
        tr:nth-child(even) {
            background: #F9FAFB;
        }
        
        .level {
            display: inline-block;
            background: #1ABC9C;
            color: white;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
        }
        
        .consultant-notes {
            background: #F0F8FF;
            padding: 15px;
            border-left: 3px solid #1ABC9C;
            border-radius: 2px;
            font-size: 13px;
            color: #333;
            margin-bottom: 15px;
        }
        
        .footer {
            border-top: 1px solid #E0E0E0;
            padding-top: 20px;
            margin-top: 40px;
            font-size: 11px;
            color: #999;
        }
        
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="header">
            {{ #if organisme.logo_url }}
            <img src="{{ organisme.logo_url }}" alt="{{ organisme.name }}" class="logo">
            {{ /if }}
            <h1>Bilan de Compétences</h1>
            <div class="organisme">{{ organisme.name }}</div>
        </div>
        
        <!-- BENEFICIAIRE INFO -->
        <div class="section">
            <div class="section-title">Bénéficiaire</div>
            <div class="beneficiaire-info">
                <div class="info-row">
                    <div class="info-label">Nom</div>
                    <div class="info-value">{{ beneficiaire.first_name }} {{ beneficiaire.last_name }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Email</div>
                    <div class="info-value">{{ beneficiaire.email }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Fonction actuelle</div>
                    <div class="info-value">{{ beneficiaire.current_job_title }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Secteur</div>
                    <div class="info-value">{{ beneficiaire.current_industry }}</div>
                </div>
            </div>
        </div>
        
        <!-- BILAN METADATA -->
        <div class="section">
            <div class="section-title">Processus</div>
            <div class="beneficiaire-info">
                <div class="info-row">
                    <div class="info-label">Date de début</div>
                    <div class="info-value">{{ format_date(bilan.start_date) }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Date de fin</div>
                    <div class="info-value">{{ format_date(bilan.end_date) }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Consultant</div>
                    <div class="info-value">{{ consultant.first_name }} {{ consultant.last_name }}</div>
                </div>
            </div>
        </div>
        
        <!-- EVALUATIONS TABLE -->
        <div class="section">
            <div class="section-title">Évaluation des Compétences</div>
            <table>
                <thead>
                    <tr>
                        <th>Compétence</th>
                        <th style="width: 80px;">Auto-éval<br>Maîtrise</th>
                        <th style="width: 80px;">Auto-éval<br>Appétence</th>
                        <th style="width: 80px;">Consultant<br>Maîtrise</th>
                        <th style="width: 80px;">Consultant<br>Appétence</th>
                    </tr>
                </thead>
                <tbody>
                    {{ #each evaluations }}
                    <tr>
                        <td><strong>{{ this.competence_name }}</strong></td>
                        <td style="text-align: center;">
                            <span class="level">{{ this.self_maitrise_level }}/5</span>
                        </td>
                        <td style="text-align: center;">
                            <span class="level">{{ this.self_appetence_level }}/5</span>
                        </td>
                        <td style="text-align: center;">
                            {{ #if this.consultant_maitrise_level }}
                            <span class="level">{{ this.consultant_maitrise_level }}/5</span>
                            {{ else }}
                            <em style="color: #999;">-</em>
                            {{ /if }}
                        </td>
                        <td style="text-align: center;">
                            {{ #if this.consultant_appetence_level }}
                            <span class="level">{{ this.consultant_appetence_level }}/5</span>
                            {{ else }}
                            <em style="color: #999;">-</em>
                            {{ /if }}
                        </td>
                    </tr>
                    {{ /each }}
                </tbody>
            </table>
        </div>
        
        <!-- CONSULTANT NOTES -->
        <div class="section">
            <div class="section-title">Analyse du Consultant</div>
            <div class="consultant-notes">
                {{ #if bilan.notes }}
                {{ bilan.notes }}
                {{ else }}
                <em>Aucune note du consultant</em>
                {{ /if }}
            </div>
        </div>
        
        <!-- FOOTER -->
        <div class="footer">
            <p>Document généré le {{ format_date_time(now()) }} par BilanCompetence.AI</p>
            <p style="margin-top: 10px;">
                Confidentiel - Ce document est personnel et destiné à {{ beneficiaire.first_name }} {{ beneficiaire.last_name }}
            </p>
        </div>
    </div>
</body>
</html>
```

**Usage (Backend):**
```typescript
// pages/api/bilans/[id]/generate-synthesis.ts
import Puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';

export async function generateSynthesisPDF(bilanId: string) {
  // 1. Fetch data
  const bilan = await supabase.from('bilans').select('*').eq('id', bilanId).single();
  const evaluations = await supabase
    .from('evaluations')
    .select('*, competences(name)')
    .eq('bilan_id', bilanId);
  
  // 2. Compile template
  const templateHTML = fs.readFileSync('./templates/synthesis-pdf.html', 'utf-8');
  const template = Handlebars.compile(templateHTML);
  
  // 3. Render
  const html = template({
    beneficiaire: bilan.beneficiaires,
    consultant: bilan.consultants,
    organisme: bilan.organismes,
    evaluations: evaluations.data,
    bilan: bilan,
    format_date: (date) => new Date(date).toLocaleDateString('fr-FR'),
    format_date_time: (date) => new Date(date).toLocaleString('fr-FR'),
    now: () => new Date(),
  });
  
  // 4. Convert HTML → PDF
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  
  // 5. Upload to Supabase Storage
  const filename = `bilan-${bilanId}-${Date.now()}.pdf`;
  await supabase.storage
    .from('bilan-files')
    .upload(filename, pdf, { contentType: 'application/pdf' });
  
  // 6. Update DB
  await supabase
    .from('bilans')
    .update({ synthesis_pdf_url: filename, synthesis_generated_at: new Date() })
    .eq('id', bilanId);
  
  return { pdf_url: filename };
}
```

---

## ✉️ BELGE 2: Email Templates (3-4 saat)

**Dosya:** `templates/emails.ts`

```typescript
export const emailTemplates = {
  // 1. WELCOME - Consultant first login
  welcomeConsultant: {
    subject: 'Bienvenue sur BilanCompetence.AI',
    html: `
      <h1>Bienvenue, {{consultant_name}}!</h1>
      <p>Vous avez été invité à rejoindre BilanCompetence.AI en tant que consultant.</p>
      <p>
        <a href="{{app_url}}/onboarding" style="background: #1ABC9C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Commencer
        </a>
      </p>
      <p>Questions? Contactez-nous: support@bilan.ai</p>
    `
  },
  
  // 2. PASSWORD RESET
  passwordReset: {
    subject: 'Réinitialiser votre mot de passe BilanCompetence.AI',
    html: `
      <h1>Réinitialisation de mot de passe</h1>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:</p>
      <p>
        <a href="{{reset_link}}" style="background: #2C3E50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Réinitialiser mon mot de passe
        </a>
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 20px;">
        Ce lien expire dans 24 heures.<br>
        Si vous n'avez pas demandé une réinitialisation, ignorez cet email.
      </p>
    `
  },
  
  // 3. BENEFICIAIRE INVITE
  beneficiaireInvite: {
    subject: '{{consultant_name}} vous invite à commencer votre bilan de compétences',
    html: `
      <h1>Bienvenue {{beneficiaire_name}}!</h1>
      <p>{{consultant_name}}, votre consultant en bilan de compétences, vous invite à rejoindre la plateforme.</p>
      <p>
        <a href="{{invite_link}}" style="background: #1ABC9C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Accepter l'invitation
        </a>
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 20px;">
        Cette invitation expire dans 7 jours.
      </p>
    `
  },
  
  // 4. BILAN COMPLETED
  bilanCompleted: {
    subject: 'Votre bilan de compétences est terminé!',
    html: `
      <h1>Votre bilan est prêt</h1>
      <p>{{beneficiaire_name}}, votre bilan de compétences a été finalisé par {{consultant_name}}.</p>
      <p>Vous pouvez maintenant télécharger votre rapport synthèse:</p>
      <p>
        <a href="{{app_url}}/bilans/{{bilan_id}}/download-pdf" style="background: #1ABC9C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Télécharger le rapport
        </a>
      </p>
      <p>Questions? {{consultant_name}} est disponible pour en discuter.</p>
    `
  },
  
  // 5. NEW MESSAGE NOTIFICATION
  newMessageNotification: {
    subject: 'Nouveau message de {{sender_name}}',
    html: `
      <h1>Vous avez un nouveau message</h1>
      <p><strong>{{sender_name}}:</strong></p>
      <p style="background: #F4F7F6; padding: 10px; border-left: 3px solid #1ABC9C; margin: 15px 0;">
        {{message_preview}}
      </p>
      <p>
        <a href="{{app_url}}/messages" style="background: #2C3E50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Voir le message
        </a>
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 20px;">
        <a href="{{unsubscribe_link}}">Ne pas recevoir ces notifications</a>
      </p>
    `
  }
};

// Usage
export function sendEmail(to: string, template: keyof typeof emailTemplates, variables: any) {
  const tmpl = emailTemplates[template];
  
  // Interpolate variables
  let html = tmpl.html;
  let subject = tmpl.subject;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, String(value));
    subject = subject.replace(regex, String(value));
  });
  
  // Send via SendGrid/Resend
  return sendgridClient.send({
    to,
    from: 'noreply@bilan.ai',
    subject,
    html,
  });
}
```

---

## 🤖 BELGE 3: Gemini AI Prompts (2-3 saat)

**Dosya:** `lib/ai/gemini-prompts.ts`

```typescript
export const geminiPrompts = {
  // Competence Analysis
  competenceAnalysis: {
    system: `Tu es un expert en gestion de carrière et développement professionnel en France.
Ton rôle est d'analyser les compétences d'une personne et de proposer des orientations.
Sois concis, professionnel et orienté action.`,
    
    userPrompt: (evaluations: any[]) => `
Voici les compétences d'une personne et leurs niveaux:

${evaluations.map(e => 
  `- ${e.competence_name}: Maîtrise ${e.self_maitrise_level}/5, Appétence ${e.self_appetence_level}/5`
).join('\n')}

Analyse et fournis (en JSON):
1. top_sectors: 3 secteurs alignés avec ce profil
2. training_gaps: Compétences à développer
3. career_paths: 2-3 orientations professionnelles possibles
4. next_actions: 5 actions concrètes pour avancer

Format: JSON valide sans markdown.
`,
  },
  
  // Recommendation Engine
  recommendationEngine: {
    system: `Tu es un conseiller en formation professionnelle spécialisé en reconversion.
Propose des formations et ressources basées sur le profil.
Cite des ressources réelles (France Travail, Pôle Emploi, etc).`,
    
    userPrompt: (profile: any) => `
Voici le profil professionnel:
- Fonction actuelle: ${profile.current_job}
- Secteur: ${profile.industry}
- Niveau d'étude: ${profile.education}
- Expérience (années): ${profile.years_experience}
- Compétences fortes: ${profile.top_skills.join(', ')}

Recommande:
1. 3 formations pertinentes avec liens
2. Certifications valorisantes
3. Ressources d'apprentissage (plateforme, livres)

Format JSON.
`,
  },
};

// Usage in Backend
export async function analyzeCompetences(evaluations: any[]) {
  const response = await geminiClient.generateContent({
    model: "gemini-1.5-flash",
    systemPrompt: geminiPrompts.competenceAnalysis.system,
    contents: [{
      role: "user",
      parts: [{ text: geminiPrompts.competenceAnalysis.userPrompt(evaluations) }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    }
  });
  
  return JSON.parse(response.text);
}
```

---

## 🎨 BELGE 4: Design System & Wireframes (1-2 gün)

**Option A: Quick Figma Link**
- Create in 2-3 hours: https://figma.com/bilan-competence-ai
- Pages: Login, Dashboard, Bilan, Evaluation, Messages, etc.

**Option B: ASCII Wireframes** (Şimdi yazacağım)

```
=== DASHBOARD (CONSULTANT) ===

┌─────────────────────────────────────────┐
│ BilanCompetence.AI  [Benoit S]  [⚙️]    │
├─────────────────────────────────────────┤
│                                         │
│  📊 Dashboard                           │
│  ─────────────────────────────────────  │
│                                         │
│  Bilans actifs: 12        Revenue: €XXX │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ Mes bilans (liste)              │  │
│  │ ┌─────────────────────────────┐ │  │
│  │ │ Alice Dupont | Prog (50%)   │ │  │
│  │ │ [Voir] [Ajouter] [...]      │ │  │
│  │ ├─────────────────────────────┤ │  │
│  │ │ Bob Martin | Pause          │ │  │
│  │ └─────────────────────────────┘ │  │
│  └─────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘

=== EVALUATION FORM ===

┌─────────────────────────────────────────┐
│ Évaluation: Alice Dupont                │
├─────────────────────────────────────────┤
│                                         │
│  Compétence: JavaScript                │
│                                         │
│  Maîtrise:     ○ 1  ○ 2  ◉ 3  ○ 4  ○ 5 │
│  Appétence:    ○ 1  ○ 2  ○ 3  ◉ 4  ○ 5 │
│                                         │
│  Prochain: [Précédent] [Suivant]        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📝 BELGE 5: TypeScript Interfaces (2-3 saat)

**Dosya:** `types/index.ts`

```typescript
// AUTH
export type UserType = 'beneficiaire' | 'consultant' | 'organisme_admin';
export type BilanStatus = 'draft' | 'in_progress' | 'completed' | 'archived';
export type AppointmentStatus = 'proposed' | 'confirmed' | 'rejected' | 'completed';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  user_type: UserType;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  last_login_at?: Date;
}

export interface Organisme {
  id: string;
  name: string;
  siret: string;
  admin_id: string;
  subscription_tier: 'starter' | 'professional' | 'enterprise';
  active_bilans_count: number;
  max_bilans: number;
  branding_color?: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Consultant {
  id: string;
  user_id: string;
  organisme_id: string;
  specializations: string[];
  certification_qualiopi: boolean;
  bio?: string;
  calendar_sync_enabled: boolean;
  created_at: Date;
}

export interface Beneficiaire {
  id: string;
  user_id: string;
  consultant_id: string;
  current_job_title?: string;
  current_industry?: string;
  education_level?: string;
  cv_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Bilan {
  id: string;
  beneficiaire_id: string;
  consultant_id: string;
  organisme_id: string;
  status: BilanStatus;
  start_date: Date;
  end_date?: Date;
  notes?: string;
  self_eval_completed_at?: Date;
  consultant_eval_completed_at?: Date;
  synthesis_generated_at?: Date;
  synthesis_pdf_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Competence {
  id: string;
  name: string;
  category?: string;
  description?: string;
  is_default: boolean;
  created_by?: string;
  created_at: Date;
}

export interface Evaluation {
  id: string;
  bilan_id: string;
  competence_id: string;
  self_maitrise_level: number;  // 1-5
  self_appetence_level: number; // 1-5
  self_eval_date?: Date;
  consultant_maitrise_level?: number;
  consultant_appetence_level?: number;
  consultant_notes?: string;
  consultant_eval_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  bilan_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: Date;
}

export interface Appointment {
  id: string;
  bilan_id: string;
  scheduled_at: Date;
  proposed_by_id: string;
  status: AppointmentStatus;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}

// DTO for API responses
export interface BilanDetailDTO extends Bilan {
  beneficiaire: Beneficiaire & { user: User };
  consultant: Consultant & { user: User };
  organisme: Organisme;
  evaluations: Evaluation[];
  messages: Message[];
}

export interface EvaluationWithCompetence extends Evaluation {
  competence: Competence;
}
```

---

**Bu 5 belgeyi yarın bitse, AI Agent hafta başında smooth geliştiriyor! 🚀**
