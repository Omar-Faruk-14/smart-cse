"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Bell,
  Send,
  Search,
  Plus,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Users,
  Megaphone,
  Mail,
  Star,
} from "lucide-react"
import { FadeIn } from "@/components/ui/motion"

const announcements = [
  {
    id: 1,
    title: "Mid-Term Exam Schedule Released",
    content: "The mid-term examination schedule for Spring 2026 has been published. Please check the notice board for detailed timings and venue information.",
    author: "Department Office",
    date: "Jan 25, 2026",
    time: "10:30 AM",
    priority: "high",
    isRead: false,
  },
  {
    id: 2,
    title: "Workshop on Machine Learning",
    content: "A two-day workshop on Machine Learning Fundamentals will be conducted on February 5-6, 2026. Interested students can register through the department portal.",
    author: "Prof. Dr. Karim",
    date: "Jan 24, 2026",
    time: "03:15 PM",
    priority: "normal",
    isRead: true,
  },
  {
    id: 3,
    title: "Lab Equipment Maintenance",
    content: "Computer Lab 102 will be closed for maintenance on January 28, 2026. All scheduled lab sessions will be moved to Lab 104.",
    author: "Lab Administrator",
    date: "Jan 23, 2026",
    time: "09:00 AM",
    priority: "normal",
    isRead: true,
  },
  {
    id: 4,
    title: "Project Submission Deadline Extended",
    content: "The deadline for Software Engineering project submission has been extended to February 10, 2026. No further extensions will be granted.",
    author: "Prof. Mamun",
    date: "Jan 22, 2026",
    time: "04:45 PM",
    priority: "high",
    isRead: false,
  },
]

const conversations = [
  {
    id: 1,
    name: "Dr. Rahman",
    role: "Data Structures Teacher",
    avatar: "DR",
    lastMessage: "Your assignment has been reviewed. Good work!",
    time: "2h ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Prof. Karim",
    role: "Algorithm Design Teacher",
    avatar: "PK",
    lastMessage: "Please submit the corrected version by Friday.",
    time: "5h ago",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "CSE-44 Group",
    role: "Class Group",
    avatar: "44",
    lastMessage: "Rafiq: Has anyone completed the database assignment?",
    time: "1d ago",
    unread: 15,
    online: true,
  },
  {
    id: 4,
    name: "Dr. Fatema",
    role: "Database Teacher",
    avatar: "DF",
    lastMessage: "The lab viva will be held next week.",
    time: "2d ago",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: "Study Group",
    role: "5 members",
    avatar: "SG",
    lastMessage: "Let's meet tomorrow at the library.",
    time: "3d ago",
    unread: 0,
    online: true,
  },
]

const currentChatMessages = [
  {
    id: 1,
    sender: "Dr. Rahman",
    content: "Hello Mosaraf, I've reviewed your linked list assignment.",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "Me",
    content: "Thank you sir! I was waiting for your feedback.",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Dr. Rahman",
    content: "Your implementation of the doubly linked list was excellent. The code structure and comments were very professional.",
    time: "10:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "Dr. Rahman",
    content: "However, I noticed a small issue in the deletion function. The edge case for deleting the last node wasn't handled properly.",
    time: "10:36 AM",
    isOwn: false,
  },
  {
    id: 5,
    sender: "Me",
    content: "Thank you for pointing that out, sir. I'll fix it and resubmit.",
    time: "10:40 AM",
    isOwn: true,
  },
  {
    id: 6,
    sender: "Dr. Rahman",
    content: "Your assignment has been reviewed. Good work!",
    time: "10:45 AM",
    isOwn: false,
  },
]

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const unreadCount = announcements.filter((a) => !a.isRead).length
  const totalUnreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Messages</h1>
            <p className="text-muted-foreground">Stay connected with teachers and classmates</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Unread Messages", value: totalUnreadMessages.toString(), icon: Mail, color: "text-primary" },
          { label: "Announcements", value: unreadCount.toString(), icon: Megaphone, color: "text-chart-5" },
          { label: "Active Chats", value: conversations.length.toString(), icon: MessageSquare, color: "text-accent" },
          { label: "Group Chats", value: "2", icon: Users, color: "text-chart-3" },
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

      {/* Main Content */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages" className="relative">
            Messages
            {totalUnreadMessages > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-[10px]">{totalUnreadMessages}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="announcements" className="relative">
            Announcements
            {unreadCount > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-[10px]">{unreadCount}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Conversations List */}
            <Card className="border-border/50 lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y divide-border">
                    {conversations.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50 ${
                          selectedChat.id === chat.id ? "bg-muted/50" : ""
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {chat.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {chat.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-accent" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{chat.name}</span>
                            <span className="text-xs text-muted-foreground">{chat.time}</span>
                          </div>
                          <p className="truncate text-sm text-muted-foreground">{chat.lastMessage}</p>
                        </div>
                        {chat.unread > 0 && (
                          <Badge className="h-5 min-w-5 rounded-full p-0 text-[10px]">{chat.unread}</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedChat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{selectedChat.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {selectedChat.online ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-accent" />
                            Online
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            Last seen 2h ago
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[350px] p-4">
                  <div className="space-y-4">
                    {currentChatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            message.isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`mt-1 flex items-center justify-end gap-1 text-xs ${
                              message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            <span>{message.time}</span>
                            {message.isOwn && <CheckCheck className="h-3 w-3" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t border-border p-4">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Textarea
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[44px] max-h-32 resize-none"
                      rows={1}
                    />
                    <Button size="icon" className="shrink-0">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Department Announcements
              </CardTitle>
              <CardDescription>Important notices and updates from the department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      announcement.isRead
                        ? "border-border/50 bg-background"
                        : "border-primary/20 bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {!announcement.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                          {announcement.priority === "high" && (
                            <Badge variant="destructive" className="text-xs">Important</Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{announcement.content}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-[8px]">
                                {announcement.author[0]}
                              </AvatarFallback>
                            </Avatar>
                            {announcement.author}
                          </span>
                          <span>{announcement.date}</span>
                          <span>{announcement.time}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
