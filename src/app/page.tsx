'use client'

import { BackgroundRemover } from '@/components/background-remover'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Background Remover</CardTitle>
          <CardDescription>
            Upload an image to remove its background using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BackgroundRemover />
        </CardContent>
      </Card>
    </main>
  )
}
