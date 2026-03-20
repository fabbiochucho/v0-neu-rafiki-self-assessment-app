'use client'

import { useState } from 'react'
import { Download, Share2, Copy, Check, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { AssessmentResult } from '@/lib/types/assessment'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assessment: AssessmentResult
}

export function ExportDialog({
  open,
  onOpenChange,
  assessment,
}: ExportDialogProps) {
  const [format, setFormat] = useState<'pdf' | 'json'>('pdf')
  const [includeInterpretation, setIncludeInterpretation] = useState(true)
  const [shareableLink, setShareableLink] = useState(false)
  const [loading, setLoading] = useState(false)
  const [exported, setExported] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleExport = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/assessment/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: assessment.id,
          format,
          includeInterpretation,
          shareableLink,
          expiresIn: shareableLink ? 30 : undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to export assessment')

      const data = await response.json()
      setExported(true)

      if (shareableLink) {
        setShareUrl(data.downloadUrl)
      } else if (format === 'pdf') {
        // Trigger download
        window.location.href = data.downloadUrl
      } else {
        // For JSON, trigger download
        const blob = new Blob([JSON.stringify(assessment, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `assessment-${assessment.assessment_type}-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const resetForm = () => {
    setFormat('pdf')
    setIncludeInterpretation(true)
    setShareableLink(false)
    setExported(false)
    setShareUrl(null)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm()
      onOpenChange(newOpen)
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Assessment</DialogTitle>
          <DialogDescription>
            Download or share your assessment results
          </DialogDescription>
        </DialogHeader>

        {exported ? (
          <div className="space-y-4">
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>Export created successfully!</AlertDescription>
            </Alert>

            {shareUrl ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold">Shareable Link</Label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 rounded border bg-muted px-2 py-2 text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This link expires in 30 days
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your {format.toUpperCase()} file is ready to download.
                </p>
                <Button
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Format</Label>
              <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'pdf' | 'json')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="font-normal cursor-pointer">
                    PDF Report
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="font-normal cursor-pointer">
                    JSON Data
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Include Interpretation */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="interpretation"
                checked={includeInterpretation}
                onCheckedChange={(checked) =>
                  setIncludeInterpretation(checked as boolean)
                }
              />
              <Label
                htmlFor="interpretation"
                className="font-normal cursor-pointer"
              >
                Include interpretation & recommendations
              </Label>
            </div>

            {/* Shareable Link */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="shareable"
                checked={shareableLink}
                onCheckedChange={(checked) =>
                  setShareableLink(checked as boolean)
                }
              />
              <Label
                htmlFor="shareable"
                className="font-normal cursor-pointer"
              >
                Create shareable link (30-day expiry)
              </Label>
            </div>

            {shareableLink && (
              <Alert>
                <Share2 className="h-4 w-4" />
                <AlertDescription>
                  Shareable links are secure and can only be accessed with the link.
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
