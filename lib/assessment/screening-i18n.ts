// Languages for the screening itself. The questions come from the
// question_translations table (only reviewed rows are ever shown); the fixed
// text around them (buttons, answer choices, area names) lives here.
//
// French and Portuguese below are drafts (machine translation, 2026-10-21).
// A language is offered on the start form only once a reviewer has checked
// this file for it and it's added to SCREENING_UI_REVIEWED. Until then
// nothing changes for people taking a screening.

export const SCREENING_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
] as const
export type ScreeningLanguage = (typeof SCREENING_LANGUAGES)[number]["code"]

/** Languages whose fixed screening text (this file) a native speaker has reviewed. */
export const SCREENING_UI_REVIEWED: ScreeningLanguage[] = []

export function isScreeningLanguage(v: unknown): v is ScreeningLanguage {
  return typeof v === "string" && SCREENING_LANGUAGES.some((l) => l.code === v)
}

/** Languages people can choose when starting a screening. */
export function offeredScreeningLanguages() {
  return SCREENING_LANGUAGES.filter((l) => l.code === "en" || SCREENING_UI_REVIEWED.includes(l.code))
}

const en = {
  dashboard: "Dashboard",
  screeningFor: "Screening for {name}",
  answeredBy: "Answered by: {who}",
  saveLater: "Save and continue later",
  displayOptions: "Display options",
  textSize: "Text size:",
  sizeStandard: "Standard",
  sizeLarge: "Large",
  sizeLarger: "Larger",
  extraSpacing: "Extra spacing",
  areaOf: "Area {n} of {total}: {name}",
  questionOf: "Question {n} of {total}",
  minLeft: "about {n} min left",
  answeredOf: "{n} of {total} answered",
  saving: "Saving…",
  saved: "Saved. Your answers save automatically, so you can pause at any time.",
  autosave: "Your answers save automatically, so you can pause at any time.",
  welcomeBack: "Welcome back.",
  explore: "Let's explore how this feels for you.",
  areaInfoOne: "1 question · about {min} min. There are no right or wrong answers: choose what fits best most of the time.",
  areaInfo: "{n} questions · about {min} min. There are no right or wrong answers: choose what fits best most of the time.",
  beginArea: "Begin this area",
  previous: "Previous",
  next: "Next",
  finish: "Finish",
  completing: "Completing…",
  notDiagnosis: "This is structured screening and referral support. It does not provide a diagnosis.",
  noQuestions: "No questions are available for this combination of age group, respondent and areas.",
  backToDashboard: "Return to Dashboard",
  chooseAnswer: "Please choose an answer before moving on",
  saveFailed: "Failed to save your answer",
  completeFailed: "Failed to complete assessment",
  lastArea: "That's one area explored. This is the last area.",
  oneMoreArea: "That's one area explored. You have 1 more area to go.",
  moreAreas: "That's one area explored. You have {n} more areas to go.",
  inEnglish: "This question isn't translated yet, so it's shown in English.",
  questionsLanguage: "Language of the questions",
  questionsLanguageHelp: "Answers are scored the same way in every language.",
}
export type ScreeningKey = keyof typeof en

const fr: Record<ScreeningKey, string> = {
  dashboard: "Tableau de bord",
  screeningFor: "Dépistage pour {name}",
  answeredBy: "Répondant : {who}",
  saveLater: "Enregistrer et continuer plus tard",
  displayOptions: "Options d'affichage",
  textSize: "Taille du texte :",
  sizeStandard: "Normale",
  sizeLarge: "Grande",
  sizeLarger: "Très grande",
  extraSpacing: "Espacement plus large",
  areaOf: "Domaine {n} sur {total} : {name}",
  questionOf: "Question {n} sur {total}",
  minLeft: "environ {n} min restantes",
  answeredOf: "{n} sur {total} répondues",
  saving: "Enregistrement…",
  saved: "Enregistré. Vos réponses sont enregistrées automatiquement : vous pouvez faire une pause à tout moment.",
  autosave: "Vos réponses sont enregistrées automatiquement : vous pouvez faire une pause à tout moment.",
  welcomeBack: "Bon retour.",
  explore: "Voyons comment cela se passe pour vous.",
  areaInfoOne: "1 question · environ {min} min. Il n'y a pas de bonne ou de mauvaise réponse : choisissez ce qui correspond le mieux la plupart du temps.",
  areaInfo: "{n} questions · environ {min} min. Il n'y a pas de bonne ou de mauvaise réponse : choisissez ce qui correspond le mieux la plupart du temps.",
  beginArea: "Commencer ce domaine",
  previous: "Précédent",
  next: "Suivant",
  finish: "Terminer",
  completing: "Finalisation…",
  notDiagnosis: "Il s'agit d'un dépistage structuré et d'une aide à l'orientation. Ce n'est pas un diagnostic.",
  noQuestions: "Aucune question n'est disponible pour cette combinaison de tranche d'âge, de répondant et de domaines.",
  backToDashboard: "Retour au tableau de bord",
  chooseAnswer: "Veuillez choisir une réponse avant de continuer",
  saveFailed: "Votre réponse n'a pas pu être enregistrée",
  completeFailed: "Le dépistage n'a pas pu être finalisé",
  lastArea: "Un domaine de terminé. C'est le dernier domaine.",
  oneMoreArea: "Un domaine de terminé. Il vous reste 1 domaine.",
  moreAreas: "Un domaine de terminé. Il vous reste {n} domaines.",
  inEnglish: "Cette question n'est pas encore traduite ; elle est affichée en anglais.",
  questionsLanguage: "Langue des questions",
  questionsLanguageHelp: "Les réponses sont notées de la même façon dans toutes les langues.",
}

const pt: Record<ScreeningKey, string> = {
  dashboard: "Painel",
  screeningFor: "Rastreio de {name}",
  answeredBy: "Respondido por: {who}",
  saveLater: "Guardar e continuar mais tarde",
  displayOptions: "Opções de visualização",
  textSize: "Tamanho do texto:",
  sizeStandard: "Normal",
  sizeLarge: "Grande",
  sizeLarger: "Maior",
  extraSpacing: "Espaçamento extra",
  areaOf: "Área {n} de {total}: {name}",
  questionOf: "Pergunta {n} de {total}",
  minLeft: "cerca de {n} min restantes",
  answeredOf: "{n} de {total} respondidas",
  saving: "A guardar…",
  saved: "Guardado. As suas respostas são guardadas automaticamente, por isso pode fazer uma pausa a qualquer momento.",
  autosave: "As suas respostas são guardadas automaticamente, por isso pode fazer uma pausa a qualquer momento.",
  welcomeBack: "Bem-vindo de volta.",
  explore: "Vamos ver como isto é para si.",
  areaInfoOne: "1 pergunta · cerca de {min} min. Não há respostas certas nem erradas: escolha o que melhor se aplica na maior parte do tempo.",
  areaInfo: "{n} perguntas · cerca de {min} min. Não há respostas certas nem erradas: escolha o que melhor se aplica na maior parte do tempo.",
  beginArea: "Começar esta área",
  previous: "Anterior",
  next: "Seguinte",
  finish: "Terminar",
  completing: "A concluir…",
  notDiagnosis: "Isto é um rastreio estruturado e apoio ao encaminhamento. Não é um diagnóstico.",
  noQuestions: "Não há perguntas disponíveis para esta combinação de faixa etária, respondente e áreas.",
  backToDashboard: "Voltar ao painel",
  chooseAnswer: "Escolha uma resposta antes de avançar",
  saveFailed: "Não foi possível guardar a sua resposta",
  completeFailed: "Não foi possível concluir o rastreio",
  lastArea: "Uma área concluída. Esta é a última área.",
  oneMoreArea: "Uma área concluída. Falta 1 área.",
  moreAreas: "Uma área concluída. Faltam {n} áreas.",
  inEnglish: "Esta pergunta ainda não está traduzida, por isso é mostrada em inglês.",
  questionsLanguage: "Idioma das perguntas",
  questionsLanguageHelp: "As respostas são pontuadas da mesma forma em todos os idiomas.",
}

// Answer choices are stored in English (scoring depends on them); only the
// label shown on screen is translated.
const OPTIONS: Record<"fr" | "pt", Record<string, string>> = {
  fr: {
    Never: "Jamais",
    Rarely: "Rarement",
    Sometimes: "Parfois",
    Often: "Souvent",
    Always: "Toujours",
    No: "Non",
    Yes: "Oui",
    "Somewhat longer": "Un peu plus longtemps",
    "Yes, much longer": "Oui, beaucoup plus longtemps",
    Somewhat: "Un peu",
    "Yes, significantly": "Oui, nettement",
  },
  pt: {
    Never: "Nunca",
    Rarely: "Raramente",
    Sometimes: "Às vezes",
    Often: "Frequentemente",
    Always: "Sempre",
    No: "Não",
    Yes: "Sim",
    "Somewhat longer": "Um pouco mais",
    "Yes, much longer": "Sim, muito mais",
    Somewhat: "Um pouco",
    "Yes, significantly": "Sim, significativamente",
  },
}

// English descriptions as stored in assessment_domains (for the reviewer CSV).
const DOMAIN_EN: Record<string, string> = {
  ADHD: "Attention Deficit Hyperactivity Disorder screening",
  "Autism Spectrum": "Autism Spectrum Disorder screening across age groups",
  "Dyslexia/Learning Differences": "Learning differences and dyslexia screening",
  "Dyspraxia/Motor Coordination": "Motor coordination and dyspraxia screening",
  "Executive Function": "Executive function and cognitive screening",
  "Sensory Processing": "Sensory processing differences screening",
}

const DOMAINS: Record<"fr" | "pt", Record<string, { name: string; description: string }>> = {
  fr: {
    ADHD: { name: "TDAH", description: "Dépistage du trouble du déficit de l'attention avec ou sans hyperactivité" },
    "Autism Spectrum": { name: "Spectre de l'autisme", description: "Dépistage du trouble du spectre de l'autisme à tous les âges" },
    "Dyslexia/Learning Differences": { name: "Dyslexie et différences d'apprentissage", description: "Dépistage des différences d'apprentissage et de la dyslexie" },
    "Dyspraxia/Motor Coordination": { name: "Dyspraxie et coordination motrice", description: "Dépistage de la coordination motrice et de la dyspraxie" },
    "Executive Function": { name: "Fonctions exécutives", description: "Dépistage des fonctions exécutives et cognitives" },
    "Sensory Processing": { name: "Traitement sensoriel", description: "Dépistage des différences de traitement sensoriel" },
  },
  pt: {
    ADHD: { name: "PHDA", description: "Rastreio da perturbação de hiperatividade e défice de atenção" },
    "Autism Spectrum": { name: "Espetro do autismo", description: "Rastreio da perturbação do espetro do autismo em todas as idades" },
    "Dyslexia/Learning Differences": { name: "Dislexia e diferenças de aprendizagem", description: "Rastreio de diferenças de aprendizagem e dislexia" },
    "Dyspraxia/Motor Coordination": { name: "Dispraxia e coordenação motora", description: "Rastreio da coordenação motora e da dispraxia" },
    "Executive Function": { name: "Funções executivas", description: "Rastreio das funções executivas e cognitivas" },
    "Sensory Processing": { name: "Processamento sensorial", description: "Rastreio de diferenças no processamento sensorial" },
  },
}

const INFORMANT_LABELS: Record<"fr" | "pt", Record<string, string>> = {
  fr: { self: "La personne elle-même", parent_caregiver: "Parent ou aidant", teacher: "Enseignant ou éducateur", therapist: "Professionnel (thérapeute, clinicien)" },
  pt: { self: "A própria pessoa", parent_caregiver: "Pai, mãe ou cuidador", teacher: "Professor ou educador", therapist: "Profissional (terapeuta, clínico)" },
}

const DICTS: Record<ScreeningLanguage, Record<ScreeningKey, string>> = { en, fr, pt }

/** Fixed screening text in a language; English when the language isn't known. */
export function screeningText(lang: string, key: ScreeningKey, vars: Record<string, string | number> = {}): string {
  const dict = DICTS[isScreeningLanguage(lang) ? lang : "en"]
  return (dict[key] ?? en[key]).replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
}

export function optionLabel(lang: string, option: string): string {
  return lang === "fr" || lang === "pt" ? (OPTIONS[lang][option] ?? option) : option
}

export function domainText(lang: string, name: string, description: string | null): { name: string; description: string | null } {
  const d = lang === "fr" || lang === "pt" ? DOMAINS[lang][name] : undefined
  return d ?? { name, description }
}

export function informantText(lang: string, respondentType: string, english: string): string {
  return lang === "fr" || lang === "pt" ? (INFORMANT_LABELS[lang][respondentType] ?? english) : english
}

/** Every fixed string with its translations, for the reviewer page and CSV. */
export function fixedScreeningStrings(): { key: string; en: string; fr: string; pt: string }[] {
  const rows = (Object.keys(en) as ScreeningKey[]).map((k) => ({ key: `ui.${k}`, en: en[k], fr: fr[k], pt: pt[k] }))
  for (const o of Object.keys(OPTIONS.fr)) rows.push({ key: `option.${o}`, en: o, fr: OPTIONS.fr[o], pt: OPTIONS.pt[o] ?? "" })
  for (const [d, v] of Object.entries(DOMAINS.fr)) {
    rows.push({ key: `domain.${d}`, en: d, fr: v.name, pt: DOMAINS.pt[d]?.name ?? "" })
    rows.push({ key: `domain.${d}.description`, en: DOMAIN_EN[d] ?? "", fr: v.description, pt: DOMAINS.pt[d]?.description ?? "" })
  }
  for (const [r, v] of Object.entries(INFORMANT_LABELS.fr)) rows.push({ key: `informant.${r}`, en: r, fr: v, pt: INFORMANT_LABELS.pt[r] ?? "" })
  return rows
}
