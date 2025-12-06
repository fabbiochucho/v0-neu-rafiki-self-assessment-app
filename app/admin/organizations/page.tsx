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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit2, Trash2, Users } from "lucide-react"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface Organization {
  id: string
  name: string
  description: string
  country: string
  organization_type: string
  subscription_tier: string
  member_count: number
  created_at: string
}

export default function OrganizationsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    country: "",
    organization_type: "school",
  })

  const { data: organizations, mutate } = useSWR<Organization[]>("/api/organizations", async (url) => {
    const { data, error } = await supabase.from("organizations").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return data
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const { error } = await supabase.from("organizations").update(formData).eq("id", editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from("organizations").insert([formData])
        if (error) throw error
      }
      mutate()
      setFormData({ name: "", description: "", country: "", organization_type: "school" })
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
    setFormData({
      name: org.name,
      description: org.description,
      country: org.country,
      organization_type: org.organization_type,
    })
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
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g., Kenya, Nigeria"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Organization Type</Label>
                <Select
                  value={formData.organization_type}
                  onValueChange={(value) => setFormData({ ...formData, organization_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="research">Research Institution</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(org)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(org.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{org.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Location:</span>
                <span>{org.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{org.organization_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{org.member_count || 0} members</span>
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
