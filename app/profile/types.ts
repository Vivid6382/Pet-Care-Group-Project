import { Timestamp } from 'firebase/firestore'

export type Pet = {
  id: string
  name: string
  picture?: string | null
  type: 'dog' | 'cat'
  birthDate?: Timestamp | any
}
