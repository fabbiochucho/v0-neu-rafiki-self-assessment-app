import type { UserRole } from "@/lib/auth/roles"

export interface DemoUser {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  description: string
  useCase: string
  sampleProfiles: string[]
}

export const DEMO_USERS: Record<string, DemoUser> = {
  parent: {
    id: "demo_parent_001",
    email: "parent.demo@neurafiki.test",
    password: "DemoParent123",
    name: "Sarah Johnson",
    role: "parent",
    description: "Parent assessing their child's neurodivergence",
    useCase: "Parent exploring ADHD assessment for their 8-year-old son",
    sampleProfiles: ["child", "teen", "myself"],
  },
  
  teacher: {
    id: "demo_teacher_001",
    email: "teacher.demo@neurafiki.test",
    password: "DemoTeacher123",
    name: "Marcus Williams",
    role: "teacher",
    description: "Teacher understanding students with neurodivergence",
    useCase: "Teacher taking assessment to understand student experiences better",
    sampleProfiles: ["student", "classroom"],
  },
  
  professional: {
    id: "demo_professional_001",
    email: "professional.demo@neurafiki.test",
    password: "DemoProf123",
    name: "Dr. Amara Okonkwo",
    role: "health_professional",
    description: "Healthcare professional using assessment for diagnosis support",
    useCase: "Psychologist using NeuRafiki assessment for clinical evaluation",
    sampleProfiles: ["patient_intake", "clinical"],
  },
  
  policymaker: {
    id: "demo_policymaker_001",
    email: "policymaker.demo@neurafiki.test",
    password: "DemoPolicymaker123",
    name: "Hon. James Mwangi",
    role: "policymaker",
    description: "Government official working on neurodiversity initiatives",
    useCase: "Ministry official researching prevalence for education policy",
    sampleProfiles: ["research", "data"],
  },
  
  individual: {
    id: "demo_individual_001",
    email: "individual.demo@neurafiki.test",
    password: "DemoIndividual123",
    name: "Alex Chen",
    role: "parent",
    description: "Neurodivergent individual self-assessing",
    useCase: "Adult exploring late-life autism diagnosis",
    sampleProfiles: ["myself"],
  },
}

export function getDemoUser(role: UserRole): DemoUser | undefined {
  return Object.values(DEMO_USERS).find(user => user.role === role)
}

export function getAllDemoUsers(): DemoUser[] {
  return Object.values(DEMO_USERS)
}

export function isDemoEmail(email: string): boolean {
  return Object.values(DEMO_USERS).some(user => user.email === email)
}

export function getDemoUserByEmail(email: string): DemoUser | undefined {
  return Object.values(DEMO_USERS).find(user => user.email === email)
}
