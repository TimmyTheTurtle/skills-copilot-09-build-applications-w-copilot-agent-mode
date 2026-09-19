export function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`
  }

  return 'http://localhost:8000'
}

export function getApiUrl(resource) {
  return `${getApiBaseUrl()}/api/${resource}/`
}

export function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const collectionKeys = ['results', 'data', 'items', 'docs']

  for (const key of collectionKeys) {
    if (Array.isArray(payload[key])) {
      return payload[key]
    }
  }

  return []
}

export async function fetchResource(resource) {
  const response = await fetch(getApiUrl(resource), {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Request failed for ${resource}: ${response.status}`)
  }

  return response.json()
}
