export async function uploadImageToBlob(file: File): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('Upload failed:', error)
      return null
    }

    const data = await response.json()
    return data.url ?? null
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error)
    return null
  }
}

export function generateBlobFileName(originalFileName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const ext = originalFileName.split('.').pop()
  return `perfume-reviews/perfume-${timestamp}-${random}.${ext}`
}