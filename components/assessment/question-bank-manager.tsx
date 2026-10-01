"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Users, Clock, BarChart3 } from "lucide-react"

/**
 * Backed by the real, populated public.assessment_domains / public.questions
 * tables (6 domains, 974 questions) -- not assessment_questions, which was
 * part of an earlier schema design that was never finished or seeded. See
 * scripts/018_complete_institutional_followup_schema.sql for the full story.
 */
interface Domain {
  id: string
  name: string
  description: string | null
  age_groups: string[]
}

interface Question {
  id: string
  domain_id: string
  question_id: string
  question_text: string
  question_type: string
  options: string[]
  age_group: string
  respondent_type: string
  is_follow_up: boolean
}

export function QuestionBankManager() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({})
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>("all")
  const [respondentFilter, setRespondentFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadDomains()
  }, [])

  useEffect(() => {
    if (selectedDomain !== "all") {
      loadQuestions()
    }
  }, [selectedDomain, searchTerm, ageGroupFilter, respondentFilter])

  const loadDomains = async () => {
    try {
      const { data: domainRows, error } = await supabase.from("assessment_domains").select("*").order("name")
      if (error) throw error

      const { data: questionRows, error: qError } = await supabase.from("questions").select("domain_id")
      if (qError) throw qError

      const counts: Record<string, number> = {}
      for (const row of questionRows || []) {
        counts[row.domain_id] = (counts[row.domain_id] || 0) + 1
      }

      setDomains(domainRows || [])
      setQuestionCounts(counts)
    } catch (error) {
      console.error("Error loading domains:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadQuestions = async () => {
    try {
      let query = supabase
        .from("questions")
        .select("*")
        .eq("domain_id", selectedDomain)
        .order("question_id", { ascending: true })

      if (searchTerm) {
        query = query.ilike("question_text", `%${searchTerm}%`)
      }

      if (ageGroupFilter !== "all") {
        query = query.eq("age_group", ageGroupFilter)
      }

      if (respondentFilter !== "all") {
        query = query.eq("respondent_type", respondentFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setQuestions(data || [])
    } catch (error) {
      console.error("Error loading questions:", error)
    }
  }

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "likert":
        return <BarChart3 className="h-4 w-4" />
      case "yes_no":
        return <BookOpen className="h-4 w-4" />
      case "multiple_choice":
        return <Users className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const totalQuestions = Object.values(questionCounts).reduce((sum, n) => sum + n, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assessment Question Bank</h2>
          <p className="text-muted-foreground">
            Comprehensive neurodivergent assessment questions with cultural adaptations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{totalQuestions} Total Questions</Badge>
          <Badge variant="outline">{domains.length} Domains</Badge>
        </div>
      </div>

      <Tabs defaultValue="domains" className="space-y-4">
        <TabsList>
          <TabsTrigger value="domains">Assessment Domains</TabsTrigger>
          <TabsTrigger value="questions">Question Explorer</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {domains.map((domain) => (
              <Card
                key={domain.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedDomain(domain.id)
                  const questionsTab = document.querySelector('[value="questions"]') as HTMLElement
                  questionsTab?.click()
                }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{domain.name}</CardTitle>
                  <CardDescription className="text-sm">{domain.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {domain.age_groups?.map((group) => (
                        <Badge key={group} variant="outline" className="text-xs">
                          {group}
                        </Badge>
                      ))}
                    </div>
                    <Badge variant="secondary">{questionCounts[domain.id] || 0} questions</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains.map((domain) => (
                  <SelectItem key={domain.id} value={domain.id}>
                    {domain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ages</SelectItem>
                <SelectItem value="Toddlers (2-5)">Toddlers (2-5)</SelectItem>
                <SelectItem value="Children/Adolescents (6-18)">Children/Adolescents (6-18)</SelectItem>
                <SelectItem value="Adults (18+)">Adults (18+)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={respondentFilter} onValueChange={setRespondentFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Respondent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="self">Self</SelectItem>
                <SelectItem value="parent_caregiver">Parent/Caregiver</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="therapist">Therapist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedDomain !== "all" && (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <Card key={question.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">{getQuestionTypeIcon(question.question_type)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium leading-relaxed">
                            {index + 1}. {question.question_text}
                          </p>
                          <div className="flex gap-2 ml-4 flex-shrink-0">
                            {question.is_follow_up && (
                              <Badge variant="default" className="text-xs">
                                Follow-up
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {question.respondent_type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.question_type}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {question.options?.map((option, optionIndex) => (
                            <Badge key={optionIndex} variant="outline" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedDomain !== "all" && questions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No questions found matching your criteria.</div>
          )}

          {selectedDomain === "all" && (
            <div className="text-center py-8 text-muted-foreground">Select a domain to view questions.</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
