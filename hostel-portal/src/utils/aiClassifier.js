// Simple keyword-based mock "AI" classifier used to auto predict
// category and priority from the complaint description text.

const CATEGORY_KEYWORDS = {
  Electrical: ['wire', 'wiring', 'switch', 'socket', 'shock', 'spark', 'fan', 'light', 'bulb', 'mcb', 'short circuit', 'power', 'electric'],
  Plumbing: ['leak', 'pipe', 'tap', 'water', 'drain', 'flush', 'toilet', 'bathroom', 'sink', 'basin', 'sewage', 'flood'],
  Furniture: ['chair', 'table', 'bed', 'cupboard', 'wardrobe', 'door', 'window', 'lock', 'hinge', 'mattress', 'shelf'],
}

const HIGH_PRIORITY_KEYWORDS = ['urgent', 'fire', 'shock', 'spark', 'flood', 'flooding', 'danger', 'emergency', 'smoke', 'gas leak', 'collapse', 'injur']
const MEDIUM_PRIORITY_KEYWORDS = ['not working', 'broken', 'leak', 'stuck', 'damaged', 'noise', 'crack']

export function classifyComplaint(text, selectedCategory) {
  const lower = (text || '').toLowerCase()

  let predictedCategory = selectedCategory && selectedCategory !== 'Auto-detect' ? selectedCategory : 'Other'
  if (!selectedCategory || selectedCategory === 'Auto-detect') {
    let bestScore = 0
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const score = keywords.filter((k) => lower.includes(k)).length
      if (score > bestScore) {
        bestScore = score
        predictedCategory = cat
      }
    }
  }

  let priority = 'Low'
  if (HIGH_PRIORITY_KEYWORDS.some((k) => lower.includes(k))) {
    priority = 'High'
  } else if (MEDIUM_PRIORITY_KEYWORDS.some((k) => lower.includes(k))) {
    priority = 'Medium'
  }

  return { category: predictedCategory, priority }
}
