"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useVideos } from "@/lib/hooks"

export default function NewVideoPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    category: "project",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { addVideo } = useVideos()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title || !formData.youtubeUrl) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      await addVideo({
        title: formData.title,
        description: formData.description,
        videoUrl: formData.youtubeUrl,
        category: formData.category,
        uploadDate: "",
      })
      router.push("/dashboard/videos")
    } catch (err: any) {
      setError(err.message || "Failed to add video")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link href="/dashboard/videos">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Videos
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Add New Video</h1>
          <p className="text-muted-foreground mt-2">Add a YouTube video link to your gallery</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
            <CardDescription>Fill in the information below to add a new video</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Construction Progress - Week 12"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  placeholder="Brief description of the video..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* YouTube URL */}
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube URL *</Label>
                <Input
                  id="youtubeUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Paste the full YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
                </p>
              </div>

              {/* Video Preview */}
              {formData.youtubeUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${new URL(formData.youtubeUrl).searchParams.get("v")}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Adding Video..." : "Add Video"}
                </Button>
                <Link href="/dashboard/videos" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
