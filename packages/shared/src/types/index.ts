export interface Note {
  id: string
  title: string
  content: TipTapDoc
  campaignId: string | null
  createdAt: Date
  updatedAt: Date
  syncedAt: Date | null
}

export interface TipTapDoc {
  type: 'doc'
  content: TipTapNode[]
}

export interface TipTapNode {
  type: string
  attrs?: Record<string, unknown>
  content?: TipTapNode[]
  marks?: TipTapMark[]
  text?: string
}

export interface TipTapMark {
  type: string
  attrs?: Record<string, unknown>
}

export interface Campaign {
  id: string
  name: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface SyncStatus {
  lastSyncedAt: Date | null
  pendingChanges: number
  isOnline: boolean
}

export interface AppError {
  code: string
  message: string
  statusCode: number
  details?: unknown
}

export interface FastifyRequest {
  session?: {
    user: { id: string; email: string; name?: string; image?: string }
    session: { id: string; expiresAt: Date}
  }
}

export type NotePreview = Pick<Note, 'id' | 'title' | 'updatedAt'>
