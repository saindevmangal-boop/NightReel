import { useState } from 'react'
import { getMovieTitleFromMood } from '../api/gemini.js'

const CHIPS = ['cozy rainy afternoon', 'edge-of-your-seat heist', 'heartbroken but hopeful', 'brainy sci-fi', 'laugh-out-loud chaos']

export default function MoodMatcher({ onMatched, onClose }) {
  const [mood, setMood] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function runMatch(value) {
    const m = (value ?? mood).trim()
    if (!m) return
    setLoading(true)
    setError(null)
    try {
      const title = await getMovieTitleFromMood(m)
      onMatched(title)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mood-panel">
      <div className="mood-panel__header">
        <div>
          <h2>✦ Mood Matcher</h2>
          <p>Describe a vibe. AI picks a title, we pull it up.</p>
        </div>
        <button className="mood-panel__close" onClick={onClose} aria-label="Close Mood Matcher">×</button>
      </div>

      <form
        className="mood-panel__form"
        onSubmit={(e) => {
          e.preventDefault()
          runMatch()
        }}
      >
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="e.g. 'I want to feel like I'm falling in love in Paris'"
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading || !mood.trim()}>
          {loading ? 'Matching…' : 'Find my movie'}
        </button>
      </form>

      <div className="mood-panel__chips">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            className="chip"
            disabled={loading}
            onClick={() => {
              setMood(chip)
              runMatch(chip)
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {error && <p className="mood-panel__error">{error}</p>}
    </div>
  )
}