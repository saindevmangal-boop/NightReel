const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";
export async function getMovieTitleFromMood(mood) {
  if (!GEMINI_KEY) {
    throw new Error(
      'Missing Gemini API key. Add VITE_GEMINI_API_KEY to your .env file and restart the dev server.'
    )
  }

  const prompt = `Suggest exactly one real, well-known, released movie that matches this mood or vibe: "${mood}".
Respond with ONLY the movie title - no year, no quotation marks, no punctuation, no explanation, nothing else.`

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_KEY
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 20 }
    })
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message || 'Mood Matcher request failed.')
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Mood Matcher could not find a match. Try rephrasing the mood.')

  return text.trim().replace(/^["']|["']$/g, '')
}