export type UserRole = 'organizer' | 'volunteer'

export interface User {
  _id: string
  name?: string
  email: string
  role: UserRole
}

export interface Opportunity {
  _id: string
  title: string
  organization: string
  city: string
  date: string
  startTime?: string
  endTime?: string
  time?: string
  description?: string
  categories?: string[]
  createdBy?: string
  volunteerCount?: number
  volunteers?: User[]
  isJoined?: boolean
}
