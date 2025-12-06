"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Upload, CheckCircle2, Info } from "lucide-react"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface EnrollmentResult {
  successful: number
  failed: number
  errors: string[]
}

export default function BulkEnrollmentPage() {
  const [csvContent, setCsvContent] = useState("")
  const [organizationId, setOrganizationId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<EnrollmentResult | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCsvContent(event.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const handlePasteCSV = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvContent(e.target.value)
  }

  const processBulkEnrollment = async () => {
    if (!csvContent || !organizationId) return

    setIsLoading(true)
    try {
      const lines = csvContent.trim().split("\n")
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
      const errors: string[] = []
      let successful = 0
      let failed = 0

      // Process each row
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())
        const rowData: any = {}

        headers.forEach((header, index) => {
          rowData[header] = values[index]
        })

        try {
          // Validate required fields
          if (!rowData.email || !rowData.name) {
            throw new Error("Missing required fields: email, name")
          }

          // Create user profile in organization
          const { error } = await supabase.from("organization_members").insert([
            {
              organization_id: organizationId,
              email: rowData.email,
              name: rowData.name,
              role: rowData.role || "educator",
              status: "active",
            },
          ])

          if (error) throw error
          successful++
        } catch (err: any) {
          failed++
          errors.push(`Row ${i + 1}: ${err.message}`)
        }
      }

      setResult({ successful, failed, errors })
    } catch (error: any) {
      console.error("Bulk enrollment error:", error)
      setResult({
        successful: 0,
        failed: csvContent.split("\n").length,
        errors: [error.message],
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadTemplate = () => {
    const template =
      "email,name,role,class_level\nstudent1@school.com,John Doe,student,Grade 5\nstudent2@school.com,Jane Smith,student,Grade 5"
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(template))
    element.setAttribute("download", "enrollment_template.csv")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Enrollment</h1>
        <p className="text-muted-foreground">Import multiple participants at once via CSV</p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle>CSV Format</AlertTitle>
        <AlertDescription className="text-blue-700">
          Upload a CSV file with columns: email, name, role, class_level. Download the template to get started.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV or Paste Data</CardTitle>
          <CardDescription>Select an organization and upload participant data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="org">Organization</Label>
            <Input
              id="org"
              placeholder="Organization ID"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file">Upload CSV File</Label>
              <Input id="file" type="file" accept=".csv" onChange={handleFileUpload} className="cursor-pointer" />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={downloadTemplate} className="w-full bg-transparent">
                <Upload className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="paste">Or Paste CSV Data</Label>
            <Textarea
              id="paste"
              placeholder="email,name,role
participant@school.com,Student Name,student"
              value={csvContent}
              onChange={handlePasteCSV}
              rows={6}
            />
          </div>

          <Button
            onClick={processBulkEnrollment}
            disabled={!csvContent || !organizationId || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Processing..." : "Start Bulk Enrollment"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className={result.successful > 0 ? "text-green-600" : "text-gray-400"} />
              Enrollment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-green-600">Successful</p>
                <p className="text-3xl font-bold text-green-700">{result.successful}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-600">Failed</p>
                <p className="text-3xl font-bold text-red-700">{result.failed}</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Errors</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1 text-sm">
                    {result.errors.slice(0, 5).map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                    {result.errors.length > 5 && <li>• ... and {result.errors.length - 5} more errors</li>}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
