"use client"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, VideoIcon } from "lucide-react"
import Link from "next/link"

export default function VideosPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Mock data - will be replaced with Firebase data
  const videos = [
    {
      id: 1,
      title: "Construction Progress - Week 12",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "/construction-video-thumbnail.jpg",
      uploadDate: "2025-10-10",
    },
    {
      id: 2,
      title: "Project Walkthrough - Completed Building",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "/building-walkthrough.jpg",
      uploadDate: "2025-10-08",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Videos</h1>
            <p className="text-muted-foreground mt-2">Manage your YouTube video links</p>
          </div>
          <Link href="/dashboard/videos/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Video
            </Button>
          </Link>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <VideoIcon className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{video.youtubeUrl}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Added: {new Date(video.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first video</p>
              <Link href="/dashboard/videos/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Video
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
