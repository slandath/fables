import { describe, expect, it } from 'vitest'
import { extractSearchableText } from './notes'

describe('extractSearchableText', () => {
  it('returns empty string for null input', () => {
    expect(extractSearchableText(null)).toBe('')
  })

  it('returns empty string for undefined input', () => {
    expect(extractSearchableText(undefined)).toBe('')
  })

  it('returns empty string for non-object input', () => {
    expect(extractSearchableText('string')).toBe('')
    expect(extractSearchableText(123)).toBe('')
  })

  it('extracts text from a simple text node', () => {
    const input = { type: 'text', text: 'Hello world' }
    expect(extractSearchableText(input)).toBe('Hello world')
  })

  it('extracts text from doc with text content', () => {
    const input = {
      type: 'doc',
      content: [{ type: 'text', text: 'Hello world' }],
    }
    expect(extractSearchableText(input)).toBe('Hello world')
  })

  it('extracts text from paragraph with text', () => {
    const input = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    }
    expect(extractSearchableText(input)).toBe('Hello world')
  })

  it('extracts text from multiple paragraphs', () => {
    const input = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'First paragraph' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Second paragraph' }],
        },
      ],
    }
    expect(extractSearchableText(input)).toContain('First paragraph')
    expect(extractSearchableText(input)).toContain('Second paragraph')
  })

  it('extracts text from nested structure', () => {
    const input = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Chapter 1' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Intro text here' }],
        },
      ],
    }
    expect(extractSearchableText(input)).toContain('Chapter 1')
    expect(extractSearchableText(input)).toContain('Intro text here')
  })

  it('handles nodes without text property', () => {
    const input = {
      type: 'doc',
      content: [{ type: 'hardBreak' }],
    }
    expect(extractSearchableText(input)).toBe('')
  })

  it('handles mixed content with and without text', () => {
    const input = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Has text' }] },
        { type: 'hardBreak' },
      ],
    }
    expect(extractSearchableText(input)).toBe('Has text')
  })

  it('trims whitespace from extracted text', () => {
    const input = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: '  Spaces  ' }] },
      ],
    }
    expect(extractSearchableText(input)).toBe('Spaces')
  })

  it('handles empty content array', () => {
    const input = { type: 'doc', content: [] }
    expect(extractSearchableText(input)).toBe('')
  })
})