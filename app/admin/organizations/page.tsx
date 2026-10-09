"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit2, Trash2, Users } from "lucide-react"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Matches the real live schema (004_expand_institutional_schema.sql):
// organizations(id, name, domain, admin_user_id, subscription_tier,
// max_profiles, created_at, updated_at). The previous version of this page
// queried description/organization_type/member_count, none of which exist
// on this table -- it rendered without erroring, just silently blank, which
// is how the mismatch went unnoticed (see the ANDA + NeuRafiki audit, Section D).
interface Organization {
  id: string
  name: string
  domain: string | null
  admin_user_id: string
  subscription_tier: string
  max_profiles: number
  created_at: string
  member_count: number
}

export default function OrganizationsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    max_profiles: 5,
  })

  const { data: organizations, mutate } = useSWR<Organization[]>("/api/organizations", async (url: string) => {
    const { data: orgs, error } = await supabase
      .from("organizations")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) throw error

    const { data: members } = await supabase.from("organization_members").select("organization_id")
    const counts = new Map<string, number>()
    for (const row of members || []) {
      counts.set(row.organization_id, (counts.get(row.organization_id) || 0) + 1)
    }

    return (orgs || []).map((org) => ({ ...org, member_count: counts.get(org.id) || 0 }))
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const { error } = await supabase
          .from("organizations")
          .update({ name: formData.name, domain: formData.domain || null, max_profiles: formData.max_profiles })
          .eq("id", editingId)
        if (error) throw error
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Not signed in")

        const { error } = await supabase.from("organizations").insert([
          {
            name: formData.name,
            domain: formData.domain || null,
            max_profiles: formData.max_profiles,
            admin_user_id: user.id,
          },
        ])
        if (error) throw error
      }
      mutate()
      setFormData({ name: "", domain: "", max_profiles: 5 })
      setEditingId(null)
      setIsOpen(false)
    } catch (error) {
      console.error("Error saving organization:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      try {
        const { error } = await supabase.from("organizations").delete().eq("id", id)
        if (error) throw error
        mutate()
      } catch (error) {
        console.error("Error deleting organization:", error)
      }
    }
  }

  const handleEdit = (org: Organization) => {
    setFormData({ name: org.name, domain: org.domain || "", max_profiles: org.max_profiles })
    setEditingId(org.id)
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">Manage institutional accounts and access</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingId(null)}>
              <Plus className="mr-2 h-4 w-4" />
              New Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Organization" : "Create Organization"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="domain">Email Domain (optional)</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="e.g., school.edu"
                />
              </div>
              <div>
                <Label htmlFor="max_profiles">Max Profiles</Label>
                <Input
                  id="max_profiles"
                  type="number"
                  min={1}
                  value={formData.max_profiles}
                  onChange={(e) => setFormData({ ...formData, max_profiles: Number(e.target.value) || 1 })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? "Update Organization" : "Create Organization"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizations?.map((org) => (
          <Card key={org.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-start justify-between">
                <span className="flex-1">{org.name}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(org)} aria-label={`Edit ${org.name}`}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(org.id)} aria-label={`Delete ${org.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              {org.domain && <CardDescription>{org.domain}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {org.member_count} / {org.max_profiles} profiles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tier:</span>
                <span className="capitalize">{org.subscription_tier}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
