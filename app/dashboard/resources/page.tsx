"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FolderOpen,
  FileText,
  Video,
  BookOpen,
  Download,
  Search,
  Filter,
  Grid3X3,
  List,
  Clock,
  User,
  Eye,
  Star,
  Upload,
  File,
  FileImage,
  FileCode,
} from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

const courses = [
  { code: "CSE-301", name: "Data Structures" },
  { code: "CSE-303", name: "Algorithm Design" },
  { code: "CSE-305", name: "Database Systems" },
  { code: "CSE-307", name: "Software Engineering" },
  { code: "CSE-309", name: "Computer Networks" },
  { code: "CSE-311", name: "Operating Systems" },
]

const resources = [
  {
    id: 1,
    title: "Linked List Complete Guide",
    course: "Data Structures",
    code: "CSE-301",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Dr. Rahman",
    uploadedAt: "Jan 24, 2026",
    downloads: 156,
    starred: true,
  },
  {
    id: 2,
    title: "Week 3 Lecture Notes - Sorting Algorithms",
    course: "Algorithm Design",
    code: "CSE-303",
    type: "pdf",
    size: "1.8 MB",
    uploadedBy: "Prof. Karim",
    uploadedAt: "Jan 23, 2026",
    downloads: 142,
    starred: false,
  },
  {
    id: 3,
    title: "SQL Tutorial Video",
    course: "Database Systems",
    code: "CSE-305",
    type: "video",
    size: "245 MB",
    uploadedBy: "Dr. Fatema",
    uploadedAt: "Jan 22, 2026",
    downloads: 98,
    starred: true,
  },
  {
    id: 4,
    title: "UML Diagram Examples",
    course: "Software Engineering",
    code: "CSE-307",
    type: "image",
    size: "5.2 MB",
    uploadedBy: "Prof. Mamun",
    uploadedAt: "Jan 21, 2026",
    downloads: 87,
    starred: false,
  },
  {
    id: 5,
    title: "Network Protocols Handbook",
    course: "Computer Networks",
    code: "CSE-309",
    type: "book",
    size: "12.5 MB",
    uploadedBy: "Dr. Hasan",
    uploadedAt: "Jan 20, 2026",
    downloads: 234,
    starred: true,
  },
  {
    id: 6,
    title: "Process Scheduling Algorithms Code",
    course: "Operating Systems",
    code: "CSE-311",
    type: "code",
    size: "156 KB",
    uploadedBy: "Prof. Akter",
    uploadedAt: "Jan 19, 2026",
    downloads: 167,
    starred: false,
  },
  {
    id: 7,
    title: "Graph Algorithms Visualization",
    course: "Algorithm Design",
    code: "CSE-303",
    type: "video",
    size: "180 MB",
    uploadedBy: "Prof. Karim",
    uploadedAt: "Jan 18, 2026",
    downloads: 112,
    starred: false,
  },
  {
    id: 8,
    title: "Database Normalization Notes",
    course: "Database Systems",
    code: "CSE-305",
    type: "pdf",
    size: "890 KB",
    uploadedBy: "Dr. Fatema",
    uploadedAt: "Jan 17, 2026",
    downloads: 189,
    starred: true,
  },
]

const recentUploads = resources.slice(0, 4)
const starredResources = resources.filter((r) => r.starred)

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return FileText
    case "video":
      return Video
    case "book":
      return BookOpen
    case "image":
      return FileImage
    case "code":
      return FileCode
    default:
      return File
  }
}

const getFileColor = (type: string) => {
  switch (type) {
    case "pdf":
      return "bg-destructive/10 text-destructive"
    case "video":
      return "bg-primary/10 text-primary"
    case "book":
      return "bg-accent/10 text-accent"
    case "image":
      return "bg-chart-3/10 text-chart-3"
    case "code":
      return "bg-chart-4/10 text-chart-4"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCourse = selectedCourse === "all" || resource.code === selectedCourse
    const matchesType = selectedType === "all" || resource.type === selectedType
    return matchesSearch && matchesCourse && matchesType
  })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Resources</h1>
            <p className="text-muted-foreground">Browse and download study materials and resources</p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Resource
          </Button>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Resources", value: "248", icon: FolderOpen, color: "text-primary" },
          { label: "PDFs & Documents", value: "156", icon: FileText, color: "text-destructive" },
          { label: "Video Lectures", value: "45", icon: Video, color: "text-accent" },
          { label: "Downloads This Week", value: "1.2K", icon: Download, color: "text-chart-3" },
        ].map((stat, index) => (
          <Card key={index} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.code} value={course.code}>
                      {course.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDFs</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="book">Books</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 rounded-lg border border-border p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="courses">By Course</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredResources.map((resource) => {
                const FileIcon = getFileIcon(resource.type)
                const colorClass = getFileColor(resource.type)
                return (
                  <Card key={resource.id} className="group border-border/50 transition-all hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}>
                          <FileIcon className="h-6 w-6" />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${resource.starred ? "text-amber-500" : "text-muted-foreground"}`}
                        >
                          <Star className={`h-4 w-4 ${resource.starred ? "fill-amber-500" : ""}`} />
                        </Button>
                      </div>
                      <div className="mt-4">
                        <h3 className="line-clamp-2 font-medium text-foreground">{resource.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{resource.course}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{resource.size}</span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {resource.downloads}
                        </span>
                      </div>
                      <Button variant="outline" className="mt-4 w-full bg-transparent" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border-border/50">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredResources.map((resource) => {
                    const FileIcon = getFileIcon(resource.type)
                    const colorClass = getFileColor(resource.type)
                    return (
                      <div
                        key={resource.id}
                        className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                          <FileIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-medium text-foreground">{resource.title}</h3>
                            {resource.starred && <Star className="h-4 w-4 shrink-0 fill-amber-500 text-amber-500" />}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{resource.course}</span>
                            <span>•</span>
                            <span>{resource.size}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {resource.uploadedBy}
                            </span>
                          </div>
                        </div>
                        <div className="hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {resource.uploadedAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {resource.downloads}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recently Uploaded
              </CardTitle>
              <CardDescription>New resources added in the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUploads.map((resource) => {
                  const FileIcon = getFileIcon(resource.type)
                  const colorClass = getFileColor(resource.type)
                  return (
                    <div
                      key={resource.id}
                      className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                        <FileIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-medium text-foreground">{resource.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{resource.code}</Badge>
                          <span>•</span>
                          <span>{resource.uploadedBy}</span>
                          <span>•</span>
                          <span>{resource.uploadedAt}</span>
                        </div>
                      </div>
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="starred" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                Starred Resources
              </CardTitle>
              <CardDescription>Your bookmarked resources for quick access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {starredResources.map((resource) => {
                  const FileIcon = getFileIcon(resource.type)
                  const colorClass = getFileColor(resource.type)
                  return (
                    <div
                      key={resource.id}
                      className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                        <FileIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-medium text-foreground">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.course}</p>
                      </div>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const courseResources = resources.filter((r) => r.code === course.code)
              return (
                <Card key={course.code} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{course.code}</Badge>
                      <span className="text-sm text-muted-foreground">{courseResources.length} resources</span>
                    </div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {courseResources.slice(0, 3).map((resource) => {
                        const FileIcon = getFileIcon(resource.type)
                        return (
                          <div
                            key={resource.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <FileIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate text-foreground">{resource.title}</span>
                          </div>
                        )
                      })}
                    </div>
                    <Button variant="outline" className="mt-4 w-full bg-transparent" size="sm">
                      View All Resources
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
