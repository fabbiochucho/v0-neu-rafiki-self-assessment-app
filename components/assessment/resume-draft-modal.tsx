'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Loader2, RotateCcw, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { AssessmentDraft } from '@/lib/types/assessment'

interface ResumeDraftModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResume: (draft: AssessmentDraft) => void
}

export function ResumeDraftModal({
  open,
  onOpenChange,
  onResume,
}: ResumeDraftModalProps) {
  const [drafts, setDrafts] = useState<AssessmentDraft[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchDrafts()
    }
  }, [open])

  const fetchDrafts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/assessment/draft')

      if (!response.ok) throw new Error('Failed to fetch drafts')

      const data = await response.json()
      setDrafts(data.data || [])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load drafts'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDraft = async (assessmentType: string) => {
    try {
      setDeleting(assessmentType)
      const response = await fetch(
        `/api/assessment/draft?type=${assessmentType}`,
        { method: 'DELETE' }
      )

      if (!response.ok) throw new Error('Failed to delete draft')

      setDrafts((prev) =>
        prev.filter((d) => d.assessment_type !== assessmentType)
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete draft'
      )
    } finally {
      setDeleting(null)
    }
  }

  const getProgressPercentage = (draft: AssessmentDraft) => {
    // Assuming maximum 50 questions as standard
    return Math.round((draft.current_question_index / 50) * 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resume Assessment</DialogTitle>
          <DialogDescription>
            You have unsaved assessments. Continue where you left off or start
            fresh.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : drafts.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No saved drafts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => {
              const progress = getProgressPercentage(draft)
              const isStale = new Date(draft.last_saved_at).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000

              return (
                <div
                  key={`${draft.user_id}-${draft.assessment_type}`}
                  className="flex flex-col gap-3 rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold capitalize">
                        {draft.assessment_type} Assessment
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last saved: {formatDate(draft.last_saved_at)}
                      </p>
                      {isStale && (
                        <p className="text-sm text-amber-600 dark:text-amber-500">
                          This draft is over 30 days old. Consider starting fresh.
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {progress}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Complete
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onResume(draft)}
                      className="flex-1"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDraft(draft.assessment_type)}
                      disabled={deleting === draft.assessment_type}
                    >
                      {deleting === draft.assessment_type ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
