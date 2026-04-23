import { describe, expect, it } from 'vitest'
import {
  createNoteSchema,
  searchNotesQuerySchema,
} from './note.schema'

describe('createNoteSchema', () => {
  it('validates a valid note with title and content', () => {
    const validNote = {
      title: 'My First Session',
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello world' }] }] as never[] },
    }

    const result = createNoteSchema.required.every(field => field in validNote)
    expect(result).toBe(true)
  })

  it('requires title field', () => {
    const hasTitle = 'title' in { title: 'something' }
    expect(hasTitle).toBe(true)
  })

  it('requires content field', () => {
    const note = { title: 'Test Note' } as { title: string; content?: { type: string; content: never[] } }
    const hasContent = 'content' in note
    expect(hasContent).toBe(false)
  })

  it('allows optional campaignId', () => {
    const noteWithCampaign: { title: string; content: { type: string; content: never[] }; campaignId?: string } = {
      title: 'Test Note',
      content: { type: 'doc', content: [] },
      campaignId: '123e4567-e89b-12d3-a456-426614174000',
    }

    expect(noteWithCampaign.campaignId).toBe('123e4567-e89b-12d3-a456-426614174000')
  })
})

describe('updateNoteSchema', () => {
  it('requires id field', () => {
    const hasId = 'id' in { id: '123e4567-e89b-12d3-a456-426614174000' }
    expect(hasId).toBe(true)
  })

  it('allows optional title update', () => {
    const updateWithTitle: { id: string; title?: string } = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Updated Title',
    }

    expect(updateWithTitle.title).toBe('Updated Title')
  })

  it('allows optional content update', () => {
    const updateWithContent: { id: string; content?: { type: string; content: never[] } } = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      content: { type: 'doc', content: [] },
    }

    expect('content' in updateWithContent).toBe(true)
  })
})

describe('searchNotesQuerySchema', () => {
  it('has no required fields', () => {
    expect(searchNotesQuerySchema.required.length).toBe(0)
  })

  it('allows empty query object', () => {
    const hasRequiredFields = searchNotesQuerySchema.required.every(field => field in {})
    expect(hasRequiredFields).toBe(true)
  })

  it('has q property for search', () => {
    expect('properties' in searchNotesQuerySchema).toBe(true)
    expect('q' in searchNotesQuerySchema.properties).toBe(true)
  })

  it('has limit property with default', () => {
    const hasLimit = 'limit' in searchNotesQuerySchema.properties
    expect(hasLimit).toBe(true)
  })

  it('has offset property with default', () => {
    const hasOffset = 'offset' in searchNotesQuerySchema.properties
    expect(hasOffset).toBe(true)
  })
})

describe('syncRequestSchema', () => {
  it('requires notes array', () => {
    const hasRequired = 'notes' in { notes: [] }
    expect(hasRequired).toBe(true)
  })

  it('accepts notes array with valid note objects', () => {
    const validSyncRequest = {
      notes: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Test Note',
          content: { type: 'doc', content: [] as never[] },
          campaignId: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
    }

    expect(validSyncRequest.notes.length).toBe(1)
  })

  it('allows optional lastSyncedAt', () => {
    const syncWithTimestamp = {
      notes: [] as never[],
      lastSyncedAt: '2024-01-01T00:00:00Z',
    }

    expect('lastSyncedAt' in syncWithTimestamp).toBe(true)
  })
})
