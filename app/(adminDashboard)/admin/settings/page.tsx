"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, Shield, GraduationCap, 
  Loader2, Save, Camera, Image as ImageIcon,
  Activity, Users, AlertCircle
} from "lucide-react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"

export default function AdminSettings() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  
  // States for Image Upload
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [settings, setSettings] = useState({
    siteName: "",
    adminEmail: "",
    currentSemester: "",
    maintenanceMode: false,
    registrationOpen: true,
    logoUrl: ""
  })

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setIsFetching(false)
      })
      .catch(() => {
        toast.error("Error loading system data")
        setIsFetching(false)
      })
  }, [])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      let currentLogoUrl = settings.logoUrl

      // ১. যদি নতুন লোগো থাকে তবে আগে আপলোড হবে
      if (logoFile) {
        const formData = new FormData()
        formData.append("image", logoFile)

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-image`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${(session?.user as any)?.accessToken}`
          },
          body: formData
        })
        const uploadData = await uploadRes.json()
        currentLogoUrl = uploadData.url
      }

      // ২. লোগো URL সহ সেটিংস আপডেট
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(session?.user as any)?.accessToken}`
        },
        body: JSON.stringify({ ...settings, logoUrl: currentLogoUrl })
      })

      if (res.ok) toast.success("System updated successfully! 🚀")
    } catch (error) {
      toast.error("Failed to update configurations")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) return (
    <div className="flex flex-col justify-center items-center h-[80vh] gap-4">
      <Loader2 className="animate-spin text-primary h-8 w-8" />
      <p className="text-xs font-medium text-slate-400 uppercase tracking-widest text-center">
        Synchronizing with Server...
      </p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 min-h-screen">
      
      {/* Minimal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Portal Settings</h1>
          <p className="text-slate-500 text-sm">Fine-tune your institution's digital environment.</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="rounded-xl px-8 h-12 shadow-lg transition-all active:scale-95">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Apply Changes
        </Button>
      </div>

      {/* Top Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-slate-50/50 rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Status</p>
              <h3 className={`text-xl font-bold ${settings.maintenanceMode ? 'text-orange-500' : 'text-emerald-500'}`}>
                {settings.maintenanceMode ? 'Maintenance' : 'Live'}
              </h3>
            </div>
            <div className={`p-2 rounded-xl ${settings.maintenanceMode ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
              <Activity className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-slate-50/50 rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Term</p>
              <h3 className="text-xl font-bold text-slate-800">{settings.currentSemester || "Not Set"}</h3>
            </div>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-slate-50/50 rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registration</p>
              <h3 className={`text-xl font-bold ${settings.registrationOpen ? 'text-indigo-500' : 'text-slate-500'}`}>
                {settings.registrationOpen ? 'Open' : 'Closed'}
              </h3>
            </div>
            <div className={`p-2 rounded-xl ${settings.registrationOpen ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
            <div className="space-y-8">
              {/* Logo Section */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b border-dashed">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 transition-colors group-hover:border-primary">
                    {logoPreview || settings.logoUrl ? (
                      <img src={logoPreview || settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <ImageIcon className="text-slate-300 w-8 h-8" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl cursor-pointer hover:scale-110 transition-all shadow-lg">
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                  </label>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal Identity Logo</p>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500">Institution Name</Label>
                  <Input 
                    value={settings.siteName} 
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="rounded-xl border-slate-200 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500">Contact Email</Label>
                  <Input 
                    value={settings.adminEmail} 
                    onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                    className="rounded-xl border-slate-200 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500">Global Academic Semester</Label>
                <Select value={settings.currentSemester} onValueChange={(v) => setSettings({...settings, currentSemester: v})}>
                  <SelectTrigger className="rounded-xl h-12 border-slate-200">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                    <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                    <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Access Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-3xl p-8 bg-white space-y-8">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Core Controls
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Registration</p>
                  <p className="text-[11px] text-slate-400 uppercase">Allow Signups</p>
                </div>
                <Switch 
                  checked={settings.registrationOpen} 
                  onCheckedChange={(v) => setSettings({...settings, registrationOpen: v})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-orange-600">Maintenance</p>
                  <p className="text-[11px] text-slate-400 uppercase">Lock Portal</p>
                </div>
                <Switch 
                  checked={settings.maintenanceMode} 
                  onCheckedChange={(v) => setSettings({...settings, maintenanceMode: v})} 
                />
              </div>
            </div>

            {settings.maintenanceMode && (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3 items-start animate-in zoom-in-95">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-orange-700 leading-relaxed italic">
                  Maintenance mode active. Student access is restricted.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}