"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Save, GraduationCap, PlusCircle, Database, Trash2, Edit, Eye, X, CheckCircle2, FileText } from "lucide-react"
import toast from "react-hot-toast"
import Swal from "sweetalert2"

export default function ResultManagement() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"add" | "view">("add")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  
  const [allResults, setAllResults] = useState<any[]>([])
  const [semesterStudents, setSemesterStudents] = useState<any[]>([])
  const [semesterCourses, setSemesterCourses] = useState<any[]>([])
  const [filter, setFilter] = useState({ semester: "", courseCode: "", courseName: "" })
  const [studentMarks, setStudentMarks] = useState<any>({})

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedResult, setSelectedResult] = useState<any>(null)

  const semesterMap: { [key: string]: string } = {
    "1st Semester": "1", "2nd Semester": "2", "3rd Semester": "3", "4th Semester": "4",
    "5th Semester": "5", "6th Semester": "6", "7th Semester": "7", "8th Semester": "8"
  }

  const fetchAllResults = async () => {
    setFetching(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/results/all`, {
        headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` }
      })
      const data = await res.json()
      setAllResults(Array.isArray(data) ? data : [])
    } finally { setFetching(false) }
  }

  useEffect(() => {
    if (activeTab === "view") fetchAllResults()
  }, [activeTab])

  const handleFilterChange = async (semLabel: string) => {
    const semValue = semesterMap[semLabel]
    setFilter({ ...filter, semester: semValue })
    setFetching(true)
    try {
      const [stdRes, crsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${semValue}`, { headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` }}),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${semValue}`, { headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` }})
      ])
      setSemesterStudents(await stdRes.json())
      setSemesterCourses(await crsRes.json())
    } finally { setFetching(false) }
  }

  const handleSaveResult = async (student: any) => {
    const marks = studentMarks[student.studentId] || {}
    if (!filter.courseCode) return toast.error("Select course first")
    
    setLoading(true)
    // Key names must match backend precisely
    const payload = {
      ct: Number(marks.ct || 0),
      mid: Number(marks.mid || 0),
      attendance: Number(marks.att || 0),
      presentation: Number(marks.pre || 0),
      assignment: Number(marks.asg || 0),
      finalMark: Number(marks.finalMark || 0), 
      studentEmail: student.email,
      studentId: student.studentId,
      courseCode: filter.courseCode,
      courseName: filter.courseName,
      semester: filter.semester,
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${(session?.user as any)?.accessToken}` },
      body: JSON.stringify(payload)
    })
    
    if (res.ok) {
      toast.success("Result published!")
      setStudentMarks((prev: any) => {
        const next = { ...prev };
        delete next[student.studentId];
        return next;
      });
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/results/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` }
        })
        if (res.ok) {
          toast.success("Deleted successfully")
          fetchAllResults()
        }
      }
    })
  }

  const handleUpdateSubmit = async () => {
    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/results/${selectedResult._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${(session?.user as any)?.accessToken}` },
      body: JSON.stringify(selectedResult.breakdown)
    })
    if (res.ok) {
      toast.success("Update successful")
      setIsEditModalOpen(false)
      fetchAllResults()
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-[98%] mx-auto py-6 space-y-6">
      {/* NAVIGATION HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 pl-2">
          <GraduationCap className="text-slate-900 h-8 w-8" />
          <h1 className="text-xl font-black uppercase tracking-tighter italic">Result Management</h1>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <Button 
            variant={activeTab === "add" ? "default" : "ghost"} 
            onClick={() => setActiveTab("add")}
            className={`rounded-lg font-bold px-8 ${activeTab === "add" ? "bg-white text-slate-900 hover:bg-white shadow-sm" : "text-slate-500"}`}
          >
            Entry
          </Button>
          <Button 
            variant={activeTab === "view" ? "default" : "ghost"} 
            onClick={() => setActiveTab("view")}
            className={`rounded-lg font-bold px-8 ${activeTab === "view" ? "bg-white text-slate-900 hover:bg-white shadow-sm" : "text-slate-500"}`}
          >
            Records
          </Button>
        </div>
      </div>

      {activeTab === "add" ? (
     <div className="w-full space-y-6">
  {/* TOP FILTER SECTION */}
  <Card className="p-6 border-none shadow-sm rounded-2xl bg-white border-t-4 border-slate-900">
    <div className="flex flex-col md:flex-row items-end gap-6">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Step 1: Select Semester</Label>
          <Select onValueChange={handleFilterChange}>
            <SelectTrigger className="rounded-xl h-12 font-bold border-slate-200 bg-slate-50/50">
              <SelectValue placeholder="Choose Semester" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(semesterMap).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Step 2: Select Course</Label>
          <Select onValueChange={(v) => {
            const c = semesterCourses.find(course => course.code === v); 
            setFilter({...filter, courseCode: v, courseName: c?.name});
          }}>
            <SelectTrigger className="rounded-xl h-12 font-bold border-slate-200 bg-slate-50/50" disabled={semesterCourses.length === 0}>
              <SelectValue placeholder="Choose Course" />
            </SelectTrigger>
            <SelectContent>
              {semesterCourses.map((c: any) => <SelectItem key={c._id} value={c.code}>{c.code} - {c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-3 rounded-2xl min-w-[180px] justify-center shadow-lg shadow-slate-200">
        <div className="text-center">
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Total Students</p>
          <p className="text-2xl font-black italic leading-none">{semesterStudents.length}</p>
        </div>
      </div>
    </div>
  </Card>

  {/* FULL WIDTH TABLE SECTION */}
  <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow className="hover:bg-transparent border-none h-14">
            <TableHead className="text-white font-bold text-[10px] uppercase pl-8">Student Identity</TableHead>
            <TableHead className="text-center text-white font-bold text-[10px] uppercase">
              Marks Distribution (CT:5 | MID:20 | ATT:5 | PRE:5 | ASG:5 | FINAL:60)
            </TableHead>
            <TableHead className="text-right text-white font-bold text-[10px] uppercase pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {semesterStudents.map((s) => (
            <TableRow key={s._id} className="hover:bg-slate-50 transition-colors border-slate-100">
              <TableCell className="pl-8 py-5">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{s.name}</span>
                  <span className="text-[10px] font-black text-primary italic uppercase">{s.studentId}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-4 justify-center items-center">
                  {[
                    { label: "ct", key: "ct" },
                    { label: "mid", key: "mid" },
                    { label: "att", key: "att" },
                    { label: "pre", key: "pre" },
                    { label: "asg", key: "asg" },
                    { label: "final", key: "final" }
                  ].map((f) => (
                    <div key={f.key} className="flex flex-col items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">{f.label}</span>
                      <Input 
                        type="number" 
                        className="w-16 h-12 text-center font-black text-lg rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-slate-900 focus:ring-0 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setStudentMarks({
                          ...studentMarks, 
                          [s.studentId]: {
                            ...studentMarks[s.studentId], 
                            [f.key === "final" ? "finalMark" : f.key]: e.target.value
                          }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right pr-8">
                <Button 
                  size="sm" 
                  onClick={() => handleSaveResult(s)} 
                  disabled={loading} 
                  className="bg-slate-900 hover:bg-emerald-600 transition-all font-black text-[10px] rounded-xl h-12 px-6 shadow-md uppercase tracking-tighter"
                >
                  Save Marks
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    
    {semesterStudents.length === 0 && (
      <div className="py-24 text-center">
        <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4">
          <Database className="h-8 w-8 text-slate-300" />
        </div>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
          Please select semester and course to load students
        </p>
      </div>
    )}
  </Card>
</div>
      ) : (
        /* RECORDS VIEW */
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50 border-b">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase text-slate-900">Student ID</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-slate-900">Course Code</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-center text-slate-900">Grade Point</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-center text-slate-900">Total Marks</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-right px-8 text-slate-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allResults.map((res: any) => (
                <TableRow key={res._id} className="hover:bg-slate-50 border-slate-100 group transition-all">
                  <TableCell className="font-black text-slate-700 py-5">{res.studentId}</TableCell>
                  <TableCell className="font-bold text-xs uppercase text-slate-400">{res.courseCode}</TableCell>
                  <TableCell className="text-center">
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-lg font-black text-[10px] italic shadow-sm leading-none">
                      {res.grade} | {res.point.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-black text-lg text-slate-800 tracking-tighter">{res.marks}</TableCell>
                  <TableCell className="text-right px-8 space-x-2">
                    <Button variant="outline" size="icon" onClick={() => { setSelectedResult(res); setIsViewModalOpen(true); }} className="h-9 w-9 text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-all">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { setSelectedResult(res); setIsEditModalOpen(true); }} className="h-9 w-9 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(res._id)} className="h-9 w-9 text-red-500 border-red-100 hover:bg-red-600 hover:text-white transition-all">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* VIEW DETAILS MODAL (RESULT CARD) */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-none p-0 overflow-hidden shadow-2xl bg-white">
          <div className="bg-slate-900 p-8 text-white relative">
            <div className="flex justify-between items-start">
               <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Academic Record</h2>
                  <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">{selectedResult?.studentId} | {selectedResult?.courseName}</p>
               </div>
               <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md text-center border border-white/10">
                  <p className="text-[10px] font-bold text-white/50 uppercase">CGPA/Point</p>
                  <p className="text-3xl font-black italic text-primary">{selectedResult?.point.toFixed(2)}</p>
               </div>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedResult?.breakdown && Object.entries(selectedResult.breakdown).map(([key, val]: any) => (
                  <div key={key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{key}</p>
                    <p className="text-xl font-black text-slate-800 tracking-tighter">{val}</p>
                  </div>
                ))}
             </div>

             <div className="bg-slate-900 rounded-[2rem] p-6 flex justify-between items-center text-white shadow-xl shadow-slate-200">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center font-black text-xl italic text-primary border border-white/10">
                      {selectedResult?.grade}
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-white/50 uppercase">Final Assessment</p>
                      <h4 className="text-lg font-black tracking-tight uppercase">Passed with Excellence</h4>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-white/50 uppercase">Grand Total</p>
                   <p className="text-3xl font-black italic">{selectedResult?.marks} <span className="text-xs">/ 100</span></p>
                </div>
             </div>
          </div>

          <div className="p-6 bg-slate-50 flex gap-4 justify-center border-t border-slate-100">
             <Button onClick={() => setIsViewModalOpen(false)} className="bg-slate-900 text-white font-black px-12 h-12 rounded-2xl uppercase italic tracking-tighter shadow-lg">
                Close Report
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* UPDATE DIALOG MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white">
          <div className="bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Edit Performance</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{selectedResult?.studentId} | {selectedResult?.courseCode}</p>
          </div>
          
          <div className="p-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {selectedResult?.breakdown && Object.keys(selectedResult.breakdown).map((f) => (
              <div key={f} className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-slate-400">{f}</Label>
                <Input 
                  type="number" 
                  value={selectedResult.breakdown[f]} 
                  className="h-12 rounded-xl font-black text-lg border-2 focus:border-slate-900 transition-all"
                  onChange={(e) => setSelectedResult({
                    ...selectedResult, 
                    breakdown: {...selectedResult.breakdown, [f]: e.target.value}
                  })}
                />
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50 flex gap-4 justify-end border-t border-slate-100">
             <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="font-bold text-slate-500">Cancel</Button>
             <Button onClick={handleUpdateSubmit} disabled={loading} className="bg-slate-900 text-white font-black px-10 h-12 rounded-2xl shadow-lg hover:bg-emerald-600 transition-all uppercase italic">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Update Now"}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}