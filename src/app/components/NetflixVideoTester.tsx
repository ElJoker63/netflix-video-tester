'use client'

import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

export default function NetflixVideoTester() {
  const [videoSelector, setVideoSelector] = useState('')
  const [testResult, setTestResult] = useState('')

  useEffect(() => {
    const findNetflixVideoSelector = () => {
      const selectors = [
        'video',
        '#netflix-player video',
        '.nfp-video-player video',
        '#appMountPoint video',
        'iframe#netflix-player',
        '.watch-video--player-view video'
      ]

      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element) {
          if (selector.includes('iframe')) {
            try {
              const iframeDoc = (element as HTMLIFrameElement).contentDocument || (element as HTMLIFrameElement).contentWindow?.document
              const videoInIframe = iframeDoc?.querySelector('video')
              if (videoInIframe) {
                setVideoSelector(`${selector} > video`)
                return
              }
            } catch (error) {
              console.error('Error accediendo al iframe:', error)
            }
          } else {
            setVideoSelector(selector)
            return
          }
        }
      }

      setVideoSelector('No se encontró un selector de video válido')
    }

    findNetflixVideoSelector()
  }, [])

  const testVideoPlayback = () => {
    if (!videoSelector || videoSelector === 'No se encontró un selector de video válido') {
      setTestResult('No se puede probar: selector de video no válido')
      return
    }

    let videoElement: HTMLVideoElement | null = null
    if (videoSelector.includes('iframe')) {
      const iframe = document.querySelector(videoSelector.split(' > ')[0]) as HTMLIFrameElement | null
      if (iframe) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
          videoElement = iframeDoc?.querySelector('video') as HTMLVideoElement | null
        } catch (error) {
          setTestResult('Error accediendo al video en el iframe')
          return
        }
      }
    } else {
      videoElement = document.querySelector(videoSelector) as HTMLVideoElement | null
    }

    if (videoElement) {
      try {
        videoElement.play()
        setTimeout(() => {
          if (!videoElement?.paused) {
            setTestResult('Reproducción exitosa')
          } else {
            setTestResult('El video no se está reproduciendo')
          }
        }, 1000)
      } catch (error) {
        setTestResult(`Error al reproducir: ${(error as Error).message}`)
      }
    } else {
      setTestResult('No se encontró el elemento de video')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tester de Video de Netflix</h1>
      <div className="mb-4">
        <Label htmlFor="videoSelector">Selector de Video Detectado:</Label>
        <Input
          id="videoSelector"
          value={videoSelector}
          onChange={(e) => setVideoSelector(e.target.value)}
          className="mt-1"
        />
      </div>
      <Button onClick={testVideoPlayback} className="mb-4">Probar Reproducción</Button>
      {testResult && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Resultado de la prueba:</strong> {testResult}
        </div>
      )}
    </div>
  )
}