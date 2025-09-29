"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Users, Clock, BarChart3 } from "lucide-react"
import type { AssessmentDomain, AssessmentQuestion } from "@/lib/types/assessment"

interface QuestionBankManagerProps {
  organizationId?: string
  canEdit?: boolean
}

export function QuestionBankManager({ organizationId, canEdit = false }: QuestionBankManagerProps) {
  const [domains, setDomains] = useState<AssessmentDomain[]>([])
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
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
      const { data, error } = await supabase
        .from("assessment_domains")
        .select("*")
        .order("age_min", { ascending: true })

      if (error) throw error
      setDomains(data || [])
    } catch (error) {
      console.error("Error loading domains:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadQuestions = async () => {
    try {
      let query = supabase
        .from("assessment_questions")
        .select("*")
        .eq("domain_id", selectedDomain)
        .order("order_index", { ascending: true })

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

  const getAgeGroupLabel = (ageGroup: string) => {
    switch (ageGroup) {
      case "toddler":
        return "Toddlers (2-5 years)"
      case "child_adolescent":
        return "Children/Adolescents (6-18 years)"
      case "adult":
        return "Adults (18+ years)"
      default:
        return ageGroup
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
      case "scale":
        return <Clock className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

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
          <Badge variant="secondary">
            {domains.reduce((total, domain) => total + domain.question_count, 0)} Total Questions
          </Badge>
          <Badge variant="outline">{domains.length} Domains</Badge>
        </div>
      </div>

      <Tabs defaultValue="domains" className="space-y-4">
        <TabsList>
          <TabsTrigger value="domains">Assessment Domains</TabsTrigger>
          <TabsTrigger value="questions">Question Explorer</TabsTrigger>
          <TabsTrigger value="follow-up">Follow-Up Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {domains.map((domain) => (
              <Card
                key={domain.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedDomain(domain.id)
                  // Switch to questions tab
                  const questionsTab = document.querySelector('[value="questions"]') as HTMLElement
                  questionsTab?.click()
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{domain.name}</CardTitle>
                    <Badge variant="outline">{getAgeGroupLabel(domain.age_group)}</Badge>
                  </div>
                  <CardDescription className="text-sm">{domain.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Ages {domain.age_min}-{domain.age_max}
                    </div>
                    <Badge variant="secondary">{domain.question_count} questions</Badge>
                  </div>
                  {domain.cultural_adaptations?.african_context && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Culturally Adapted
                      </Badge>
                    </div>
                  )}
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
                <SelectItem value="toddler">Toddlers</SelectItem>
                <SelectItem value="child_adolescent">Children/Teens</SelectItem>
                <SelectItem value="adult">Adults</SelectItem>
              </SelectContent>
            </Select>
            <Select value={respondentFilter} onValueChange={setRespondentFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Respondent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="self">Self</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="caregiver">Caregiver</SelectItem>
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
                          <div className="flex gap-2 ml-4">
                            <Badge variant="outline" className="text-xs">
                              {question.respondent_type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.question_type}
                            </Badge>
                          </div>
                        </div>

                        {question.cultural_context?.cultural_notes && (
                          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            <strong>Cultural Note:</strong> {question.cultural_context.cultural_notes}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {question.response_options.options.map((option, optionIndex) => (
                            <Badge key={optionIndex} variant="outline" className="text-xs">
                              {option.label}
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

        <TabsContent value="follow-up" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Follow-Up Assessment Framework</CardTitle>
              <CardDescription>Longitudinal monitoring questions for tracking progress over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Progress Tracking Areas</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Behavioral changes</li>
                    <li>• Cognitive progress</li>
                    <li>• Sensory and motor improvements</li>
                    <li>• Social-emotional skills</li>
                    <li>• Adaptive skills / functional outcomes</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Follow-Up Intervals</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Weekly (intensive interventions)</li>
                    <li>• Monthly (regular monitoring)</li>
                    <li>• Quarterly (standard follow-up)</li>
                    <li>• Biannually (long-term tracking)</li>
                  </ul>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Follow-Up Questions</span>
                  <Badge variant="secondary">~1,800 questions</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Approximately 100 follow-up questions per age group/domain combination
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
