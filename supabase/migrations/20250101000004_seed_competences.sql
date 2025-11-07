-- BilanCompetence.AI Seed Data
-- Migration: Insert default competences

-- ===========================
-- TECHNICAL COMPETENCES (Tech)
-- ===========================
INSERT INTO competences (name, category, description, is_default) VALUES
  ('JavaScript', 'Tech', 'Langage de programmation web', true),
  ('TypeScript', 'Tech', 'JavaScript avec typage statique', true),
  ('React', 'Tech', 'Bibliothèque JavaScript pour interfaces utilisateur', true),
  ('Next.js', 'Tech', 'Framework React pour applications web', true),
  ('Node.js', 'Tech', 'Runtime JavaScript côté serveur', true),
  ('Python', 'Tech', 'Langage de programmation polyvalent', true),
  ('Java', 'Tech', 'Langage de programmation orienté objet', true),
  ('C#', 'Tech', 'Langage de programmation Microsoft', true),
  ('PHP', 'Tech', 'Langage de programmation web', true),
  ('SQL', 'Tech', 'Langage de requête pour bases de données', true),
  ('PostgreSQL', 'Tech', 'Système de gestion de base de données', true),
  ('MySQL', 'Tech', 'Système de gestion de base de données', true),
  ('MongoDB', 'Tech', 'Base de données NoSQL', true),
  ('Git', 'Tech', 'Système de contrôle de version', true),
  ('Docker', 'Tech', 'Plateforme de conteneurisation', true),
  ('Kubernetes', 'Tech', 'Orchestration de conteneurs', true),
  ('AWS', 'Tech', 'Services cloud Amazon', true),
  ('Azure', 'Tech', 'Services cloud Microsoft', true),
  ('HTML/CSS', 'Tech', 'Langages de balisage et style web', true),
  ('REST API', 'Tech', 'Architecture d''interfaces web', true),
  ('GraphQL', 'Tech', 'Langage de requête pour API', true),
  ('CI/CD', 'Tech', 'Intégration et déploiement continus', true),
  ('Linux', 'Tech', 'Système d''exploitation', true),
  ('WordPress', 'Tech', 'Système de gestion de contenu', true),
  ('Suite Adobe (Photoshop, Illustrator)', 'Tech', 'Logiciels de design graphique', true),
  ('Figma', 'Tech', 'Outil de design d''interface', true),
  ('AutoCAD', 'Tech', 'Logiciel de conception assistée', true),
  ('Microsoft Office (Excel, Word, PowerPoint)', 'Tech', 'Suite bureautique', true),
  ('Google Analytics', 'Tech', 'Analyse de trafic web', true),
  ('SEO/SEM', 'Tech', 'Optimisation moteurs de recherche', true)
ON CONFLICT (name, category) DO NOTHING;

-- ===========================
-- BUSINESS COMPETENCES
-- ===========================
INSERT INTO competences (name, category, description, is_default) VALUES
  ('Gestion de projet Agile', 'Business', 'Méthodologie de gestion de projet', true),
  ('Gestion de projet Scrum', 'Business', 'Framework Agile', true),
  ('Gestion de budget', 'Business', 'Planification et contrôle financier', true),
  ('Analyse de données', 'Business', 'Interprétation de données chiffrées', true),
  ('Marketing digital', 'Business', 'Promotion en ligne', true),
  ('Stratégie commerciale', 'Business', 'Planification commerciale', true),
  ('Négociation commerciale', 'Business', 'Techniques de vente et négociation', true),
  ('Gestion d''équipe', 'Business', 'Management d''équipe', true),
  ('Planification stratégique', 'Business', 'Définition d''objectifs à long terme', true),
  ('Analyse financière', 'Business', 'Évaluation de la santé financière', true),
  ('Comptabilité', 'Business', 'Gestion des comptes', true),
  ('Ressources humaines', 'Business', 'Gestion du personnel', true),
  ('Recrutement', 'Business', 'Sélection de candidats', true),
  ('Formation et développement', 'Business', 'Développement des compétences', true),
  ('Service client', 'Business', 'Relation client', true),
  ('Gestion de la qualité', 'Business', 'Contrôle qualité', true),
  ('Logistique et supply chain', 'Business', 'Gestion de chaîne d''approvisionnement', true),
  ('E-commerce', 'Business', 'Commerce en ligne', true),
  ('Rédaction de contenu', 'Business', 'Création de contenu écrit', true),
  ('Veille concurrentielle', 'Business', 'Analyse de la concurrence', true),
  ('Gestion de crise', 'Business', 'Réponse aux situations critiques', true),
  ('Entrepreneuriat', 'Business', 'Création et gestion d''entreprise', true),
  ('Développement commercial', 'Business', 'Expansion business', true),
  ('Business development', 'Business', 'Développement d''affaires', true),
  ('Account management', 'Business', 'Gestion de comptes clients', true)
ON CONFLICT (name, category) DO NOTHING;

-- ===========================
-- SOFT SKILLS (Competences comportementales)
-- ===========================
INSERT INTO competences (name, category, description, is_default) VALUES
  ('Communication', 'Soft', 'Communication interpersonnelle efficace', true),
  ('Leadership', 'Soft', 'Capacité à diriger et inspirer', true),
  ('Résolution de problèmes', 'Soft', 'Approche analytique des défis', true),
  ('Travail en équipe', 'Soft', 'Collaboration efficace', true),
  ('Créativité', 'Soft', 'Pensée innovante et originale', true),
  ('Adaptabilité', 'Soft', 'Flexibilité face au changement', true),
  ('Gestion du temps', 'Soft', 'Organisation et priorisation', true),
  ('Esprit critique', 'Soft', 'Analyse objective', true),
  ('Prise de décision', 'Soft', 'Capacité décisionnelle', true),
  ('Intelligence émotionnelle', 'Soft', 'Compréhension des émotions', true),
  ('Empathie', 'Soft', 'Compréhension d''autrui', true),
  ('Gestion du stress', 'Soft', 'Résistance à la pression', true),
  ('Autonomie', 'Soft', 'Indépendance dans le travail', true),
  ('Curiosité', 'Soft', 'Désir d''apprendre', true),
  ('Pédagogie', 'Soft', 'Capacité à transmettre des connaissances', true),
  ('Rigueur', 'Soft', 'Précision et exactitude', true),
  ('Organisation', 'Soft', 'Structuration méthodique', true),
  ('Proactivité', 'Soft', 'Initiative et anticipation', true),
  ('Persévérance', 'Soft', 'Détermination face aux obstacles', true),
  ('Diplomatie', 'Soft', 'Tact dans les relations', true),
  ('Écoute active', 'Soft', 'Attention portée à l''interlocuteur', true),
  ('Gestion de conflits', 'Soft', 'Résolution de tensions', true),
  ('Négociation', 'Soft', 'Recherche de compromis', true),
  ('Présentation orale', 'Soft', 'Expression en public', true),
  ('Rédaction professionnelle', 'Soft', 'Écriture claire et professionnelle', true),
  ('Networking', 'Soft', 'Création de réseau professionnel', true),
  ('Multitâche', 'Soft', 'Gestion de plusieurs activités', true),
  ('Esprit d''initiative', 'Soft', 'Prise d''initiative', true),
  ('Sens de l''orientation client', 'Soft', 'Focus sur les besoins clients', true),
  ('Pensée stratégique', 'Soft', 'Vision à long terme', true)
ON CONFLICT (name, category) DO NOTHING;

-- ===========================
-- LANGUAGE COMPETENCES
-- ===========================
INSERT INTO competences (name, category, description, is_default) VALUES
  ('Anglais (A1 - Débutant)', 'Language', 'Niveau débutant', true),
  ('Anglais (A2 - Élémentaire)', 'Language', 'Niveau élémentaire', true),
  ('Anglais (B1 - Intermédiaire)', 'Language', 'Niveau intermédiaire', true),
  ('Anglais (B2 - Intermédiaire avancé)', 'Language', 'Niveau intermédiaire avancé', true),
  ('Anglais (C1 - Avancé)', 'Language', 'Niveau avancé', true),
  ('Anglais (C2 - Bilingue)', 'Language', 'Niveau bilingue', true),
  ('Espagnol', 'Language', 'Langue espagnole', true),
  ('Allemand', 'Language', 'Langue allemande', true),
  ('Italien', 'Language', 'Langue italienne', true),
  ('Portugais', 'Language', 'Langue portugaise', true),
  ('Arabe', 'Language', 'Langue arabe', true),
  ('Chinois (Mandarin)', 'Language', 'Langue chinoise', true),
  ('Japonais', 'Language', 'Langue japonaise', true),
  ('Russe', 'Language', 'Langue russe', true),
  ('Néerlandais', 'Language', 'Langue néerlandaise', true)
ON CONFLICT (name, category) DO NOTHING;

-- ===========================
-- OTHER SPECIALIZED COMPETENCES
-- ===========================
INSERT INTO competences (name, category, description, is_default) VALUES
  ('Conduite de véhicules (Permis B)', 'Other', 'Permis de conduire voiture', true),
  ('Conduite poids lourds (Permis C)', 'Other', 'Permis de conduire poids lourds', true),
  ('Premiers secours (PSC1)', 'Other', 'Formation aux premiers secours', true),
  ('Hygiène et sécurité (HACCP)', 'Other', 'Normes d''hygiène alimentaire', true),
  ('Habilitation électrique', 'Other', 'Travail sur installations électriques', true),
  ('CACES (Conduite d''engins)', 'Other', 'Certificat d''aptitude à la conduite d''engins', true),
  ('Manipulation de matières dangereuses (ADR)', 'Other', 'Transport de matières dangereuses', true)
ON CONFLICT (name, category) DO NOTHING;
