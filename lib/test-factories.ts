import { faker } from '@faker-js/faker'

/**
 * Test Data Factories
 * Generate consistent, realistic test data for unit and integration tests
 */

export interface TestUser {
  id: string
  email: string
  password: string
  fullName: string
  createdAt: Date
}

export interface TestAssessment {
  id: string
  userId: string
  title: string
  description: string
  status: 'draft' | 'in_progress' | 'completed'
  questions: TestQuestion[]
  createdAt: Date
  updatedAt: Date
}

export interface TestQuestion {
  id: string
  text: string
  type: 'multiple_choice' | 'text' | 'rating'
  options?: string[]
  answer?: string | number
}

/**
 * User Factory
 * Creates test user objects with realistic data
 */
export const userFactory = {
  create(overrides?: Partial<TestUser>): TestUser {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12, memorable: false }),
      fullName: faker.person.fullName(),
      createdAt: faker.date.past(),
      ...overrides,
    }
  },

  createMany(count: number, overrides?: Partial<TestUser>): TestUser[] {
    return Array.from({ length: count }, () => this.create(overrides))
  },

  donor(overrides?: Partial<TestUser>): TestUser {
    return this.create({
      email: faker.internet.email({ provider: 'donorapp.local' }),
      ...overrides,
    })
  },

  admin(overrides?: Partial<TestUser>): TestUser {
    return this.create({
      email: `admin-${faker.string.alphaNumeric(8)}@example.com`,
      ...overrides,
    })
  },

  withEmail(email: string, overrides?: Partial<TestUser>): TestUser {
    return this.create({ email, ...overrides })
  },
}

/**
 * Assessment Factory
 * Creates test assessment objects
 */
export const assessmentFactory = {
  create(overrides?: Partial<TestAssessment>): TestAssessment {
    return {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.words(4),
      description: faker.lorem.paragraph(),
      status: 'draft',
      questions: questionFactory.createMany(5),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides,
    }
  },

  createMany(count: number, overrides?: Partial<TestAssessment>): TestAssessment[] {
    return Array.from({ length: count }, () => this.create(overrides))
  },

  completed(overrides?: Partial<TestAssessment>): TestAssessment {
    return this.create({
      status: 'completed',
      questions: questionFactory.createMany(5, { answer: 'test_answer' }),
      ...overrides,
    })
  },

  inProgress(overrides?: Partial<TestAssessment>): TestAssessment {
    return this.create({
      status: 'in_progress',
      ...overrides,
    })
  },
}

/**
 * Question Factory
 * Creates test question objects
 */
export const questionFactory = {
  create(overrides?: Partial<TestQuestion>): TestQuestion {
    return {
      id: faker.string.uuid(),
      text: faker.lorem.sentence(),
      type: 'multiple_choice',
      options: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
      ...overrides,
    }
  },

  createMany(count: number, overrides?: Partial<TestQuestion>): TestQuestion[] {
    return Array.from({ length: count }, () => this.create(overrides))
  },

  multipleChoice(overrides?: Partial<TestQuestion>): TestQuestion {
    return this.create({
      type: 'multiple_choice',
      options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'],
      ...overrides,
    })
  },

  textInput(overrides?: Partial<TestQuestion>): TestQuestion {
    return this.create({
      type: 'text',
      options: undefined,
      ...overrides,
    })
  },

  rating(overrides?: Partial<TestQuestion>): TestQuestion {
    return this.create({
      type: 'rating',
      options: ['1', '2', '3', '4', '5'],
      ...overrides,
    })
  },
}

/**
 * Auth Factory
 * Creates test authentication objects
 */
export const authFactory = {
  validCredentials() {
    const email = faker.internet.email()
    return {
      email,
      password: 'SecurePassword123!',
    }
  },

  invalidEmail() {
    return {
      email: 'not-an-email',
      password: 'SecurePassword123!',
    }
  },

  shortPassword() {
    return {
      email: faker.internet.email(),
      password: 'short',
    }
  },

  weakPassword() {
    return {
      email: faker.internet.email(),
      password: '123456',
    }
  },
}

/**
 * Utilities
 */
export const testDataUtils = {
  /**
   * Reset all factories (useful if you need to clear any state)
   */
  reset() {
    faker.seed()
  },

  /**
   * Set a specific seed for reproducible test data
   */
  setSeed(seed: number) {
    faker.seed(seed)
  },

  /**
   * Generate a realistic email for testing
   */
  email() {
    return faker.internet.email()
  },

  /**
   * Generate a strong password for testing
   */
  password() {
    return faker.internet.password({ length: 16, memorable: false })
  },

  /**
   * Generate a UUID for testing
   */
  uuid() {
    return faker.string.uuid()
  },
}
