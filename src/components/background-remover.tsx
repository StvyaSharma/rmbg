'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { removeBackground } from '@imgly/background-removal'
import { Button } from '@/components/ui/button'
import { AlertCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

type ProcessingStatus = 'idle' | 'processing' | 'complete' | 'error'

interface ProcessingError {
  message: string
}

export function BackgroundRemover() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [error, setError] = useState<ProcessingError | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      setStatus('processing')
      setError(null)

      // Display original image
      const objectUrl = URL.createObjectURL(file)
      setOriginalImage(objectUrl)

      // Process image
      const result = await removeBackground(file, {
        debug: true,
        // @ts-ignore
        deallocate: true,
      })

      // Convert blob to URL
      const processedUrl = URL.createObjectURL(result)
      setProcessedImage(processedUrl)
      setStatus('complete')

    } catch (err) {
      setStatus('error')
      setError({ 
        message: err instanceof Error 
          ? err.message 
          : 'Failed to process image. Please try again.' 
      })
      console.error('Error processing image:', err)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 10485760, // 10MB
  })

  const resetState = () => {
    setOriginalImage(null)
    setProcessedImage(null)
    setStatus('idle')
    setError(null)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
          ${status === 'processing' ? 'pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <Upload className="h-12 w-12 text-gray-400" />
          <div className="space-y-2">
            {isDragActive ? (
              <p className="text-primary">Drop the image here</p>
            ) : (
              <>
                <p>Drag and drop an image here, or click to select</p>
                <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
                <p className="text-sm text-gray-500">Supported formats: PNG, JPG, JPEG, WebP</p>
              </>
            )}
          </div>
        </div>
      </div>

      {status === 'processing' && (
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <Spinner size="lg" />
          <p className="text-center text-sm text-gray-500 animate-pulse">
            Removing background... This may take a few moments
          </p>
        </div>
      )}

      {status !== 'idle' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="space-y-2">
            <h3 className="font-medium">Original Image</h3>
            {originalImage ? (
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-64 object-contain rounded-lg border bg-gray-50"
              />
            ) : (
              <Skeleton className="w-full h-64 rounded-lg" />
            )}
          </div>

          {/* Processed Image */}
          <div className="space-y-2">
            <h3 className="font-medium">Processed Image</h3>
            {processedImage ? (
              <div className="relative w-full h-64">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="w-full h-full object-contain rounded-lg border"
                />
                {/* Checkered background to show transparency */}
                <div 
                  className="absolute inset-0 -z-10 rounded-lg"
                  style={{
                    backgroundImage: `linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                  }}
                />
              </div>
            ) : (
              <Skeleton className="w-full h-64 rounded-lg" />
            )}
          </div>
        </div>
      )}

      {status === 'complete' && (
        <div className="flex justify-center space-x-4">
          <Button
            variant="secondary"
            onClick={resetState}
          >
            Process Another Image
          </Button>
          <Button
            onClick={() => {
              if (processedImage) {
                const link = document.createElement('a')
                link.href = processedImage
                link.download = 'processed-image.png'
                link.click()
              }
            }}
          >
            Download Processed Image
          </Button>
        </div>
      )}
    </div>
  )
}