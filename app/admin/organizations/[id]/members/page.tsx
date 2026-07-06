"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Mail } from "lucide-react"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface Member {
  id: string
  email: string
  role: string
  status: string
  joined_at: string
}

export default function OrganizationMembersPage() {
  const params = useParams()
  const orgId = params.id as string
  const [isOpen, setIsOpen] = useState(false)
  const [memberEmail, setMemberEmail] = useState("")
  const [memberRole, setMemberRole] = useState("educator")

  const { data: members, mutate } = useSWR<Member[]>(`/api/organizations/${orgId}/members`, async (url: string) => {
    const { data, error } = await supabase
      .from("organization_members")
      .select("*")
      .eq("organization_id", orgId)
      .order("joined_at", { ascending: false })
    if (error) throw error
    return data
  })

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from("organization_members").insert([
        {
          organization_id: orgId,
          email: memberEmail,
          role: memberRole,
          status: "pending",
        },
      ])
      if (error) throw error
      mutate()
      setMemberEmail("")
      setMemberRole("educator")
      setIsOpen(false)
    } catch (error) {
      console.error("Error adding member:", error)
    }
  }

  const handleRemoveMember = async (id: string) => {
    if (confirm("Remove this member from the organization?")) {
      try {
        const { error } = await supabase.from("organization_members").delete().eq("id", id)
        if (error) throw error
        mutate()
      } catch (error) {
        console.error("Error removing member:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Organization Members</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={memberRole} onValueChange={setMemberRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educator">Educator</SelectItem>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="analyst">Data Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Send Invitation
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {members?.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{member.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)} • {member.status}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveMember(member.id)}
                aria-label={`Remove ${member.email}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
