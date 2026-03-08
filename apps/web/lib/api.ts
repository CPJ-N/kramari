const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export async function apiPost<T = any>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '')
    throw new Error(errorBody || `Request failed: ${res.status}`)
  }

  return res.json()
}

export async function apiPostBlob(path: string, body?: unknown): Promise<Blob> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }

  return res.blob()
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }

  return res.json()
}
