"use client";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Plus, Pencil, Trash2, Search, X, FileText, Loader2,
  ExternalLink, GraduationCap, User, BookOpen, Hash, Layers, Info
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type Resource = { title: string; url: string; type: "image" | "pdf"; };
type Course = { 
  _id: string; 
  name: string; 
  code: string; 
  credit: string; 
  semester: string; 
  teacherId: string; 
  teacherName: string; 
  resources: Resource[]; 
};

export default function FacultyManagement() {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resourceItems, setResourceItems] = useState<{ title: string; file: File | null; url?: string }[]>([]);

  const [formData, setFormData] = useState({ 
    courseName: "", courseCode: "", teacherName: "", teacherId: "", credit: "", semester: "" 
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setCourses([...data].reverse());
    } catch (error) { console.error(error); }
  };

  useEffect(() => { if ((session?.user as any)?.accessToken) fetchCourses(); }, [session]);

  const uploadFileToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("image", file);
    const res = await fetch(`${API_URL}/upload-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${(session?.user as any).accessToken}` },
      body: data,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Upload failed");
    return result.url;
  };

  const handleFormSubmit = async () => {
    if (!formData.courseName || !formData.courseCode || !formData.semester) {
      toast.error("Fields missing!");
      return;
    }

    try {
      setIsSubmitting(true);
      const finalResources: Resource[] = [];
      for (const item of resourceItems) {
        if (item.file) {
          toast.loading(`Uploading ${item.title}...`, { id: 'up' });
          const fileUrl = await uploadFileToCloudinary(item.file);
          finalResources.push({ 
            title: item.title || "Untitled", 
            url: fileUrl, 
            type: item.file.type.includes("pdf") ? "pdf" : "image" 
          });
        } else if (item.url) {
          finalResources.push({ title: item.title, url: item.url, type: "image" });
        }
      }

      const isEdit = !!editingCourse;
      const url = isEdit ? `${API_URL}/courses/${editingCourse._id}` : `${API_URL}/courses`;
      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${(session?.user as any).accessToken}` },
        body: JSON.stringify({ 
          name: formData.courseName, 
          code: formData.courseCode, 
          teacherName: formData.teacherName, 
          teacherId: formData.teacherId, 
          credit: formData.credit, 
          semester: formData.semester, 
          resources: finalResources 
        }),
      });

      if (response.ok) {
        toast.success(isEdit ? "UPDATED!" : "ADDED!", { id: 'up' });
        setIsFormOpen(false);
        fetchCourses();
      }
    } catch (error: any) { toast.error(error.message); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const result = await Swal.fire({ 
      title: "Delete?", 
      icon: "warning", 
      showCancelButton: true, 
      confirmButtonColor: "#000", 
      confirmButtonText: "YES", 
      customClass: { popup: 'rounded-3xl' } 
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/courses/${id}`, { 
          method: "DELETE", 
          headers: { Authorization: `Bearer ${(session?.user as any).accessToken}` } 
        });
        if (res.ok) { setCourses(prev => prev.filter(c => c._id !== id)); toast.success("Deleted"); }
      } catch (error) { console.error(error); }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-2 underline-offset-4">Courses</h1>
          <p className="text-slate-500 font-medium text-[12px] italic mt-1">Faculty Resource Management</p>
        </div>
        <Button onClick={() => { 
          setEditingCourse(null); 
          setFormData({ courseName: "", courseCode: "", teacherName: "", teacherId: "", credit: "", semester: "" }); 
          setResourceItems([{ title: "", file: null }]); 
          setIsFormOpen(true); 
        }} className="bg-primary h-11 px-6 rounded-xl font-black text-sm">
          <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> ADD COURSE
        </Button>
      </div>

      {/* SEARCH */}
      <div className="bg-white px-5 py-3 rounded-2xl border flex items-center gap-3 shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />
        <Input placeholder="SEARCH BY NAME OR CODE..." className="h-10 bg-transparent border-none font-bold italic text-sm uppercase" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <TableBody>
            {courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase())).map((course) => (
              <TableRow key={course._id} onClick={() => setViewingCourse(course)} className="group hover:bg-slate-50 transition-all border-b last:border-0 cursor-pointer">
                <TableCell className="px-6 py-5 w-full">
                  <p className="font-black text-slate-800 text-[15px] uppercase italic group-hover:text-primary transition-colors tracking-tight">{course.name}</p>
                  <div className="flex gap-3 mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 italic">
                    <span>CODE: {course.code}</span>
                    <span>SEM: {course.semester}</span>
                    <span className="text-primary/70">RESOURCES: {course.resources?.length || 0}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 text-right">
                  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border hover:bg-blue-50" onClick={() => { 
                      setEditingCourse(course); 
                      setFormData({ courseName: course.name, courseCode: course.code, teacherName: course.teacherName, teacherId: course.teacherId, credit: course.credit, semester: course.semester }); 
                      setResourceItems(course.resources?.map(r => ({ title: r.title, file: null, url: r.url })) || []); 
                      setIsFormOpen(true); 
                    }}>
                      <Pencil size={14} className="text-blue-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border hover:bg-red-50" onClick={(e) => handleDelete(e, course._id)}>
                      <Trash2 size={14} className="text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>

      {/* --- SHOW/VIEW MODAL (FULL DATA) --- */}
      <Dialog open={!!viewingCourse} onOpenChange={() => setViewingCourse(null)}>
        <DialogContent className="max-w-lg rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-8 text-white">
             <div className="flex justify-between items-center mb-4">
                <div className="p-2 bg-primary/20 rounded-lg text-primary"><GraduationCap size={20} /></div>
                <span className="text-[9px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">Course Profile</span>
             </div>
             <h2 className="text-xl font-black uppercase italic tracking-tighter leading-tight">{viewingCourse?.name}</h2>
             <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase italic mt-1">Department of CSE</p>
          </div>

          <div className="p-6 space-y-6 bg-white">
            {/* Grid Information */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1"><Hash size={10}/> <span className="text-[8px] font-black uppercase tracking-widest">Course Code</span></div>
                  <p className="text-xs font-black italic uppercase text-slate-800">{viewingCourse?.code}</p>
               </div>
               <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1"><Layers size={10}/> <span className="text-[8px] font-black uppercase tracking-widest">Credit Units</span></div>
                  <p className="text-xs font-black italic uppercase text-slate-800">{viewingCourse?.credit}</p>
               </div>
               <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1"><User size={10}/> <span className="text-[8px] font-black uppercase tracking-widest">Instructor</span></div>
                  <p className="text-xs font-black italic text-slate-800">{viewingCourse?.teacherName}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">ID: {viewingCourse?.teacherId}</p>
               </div>
               <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1"><BookOpen size={10}/> <span className="text-[8px] font-black uppercase tracking-widest">Semester</span></div>
                  <p className="text-xs font-black italic uppercase text-slate-800">{viewingCourse?.semester}th Semester</p>
               </div>
            </div>

            {/* Resources List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[9px] font-black uppercase text-slate-500 italic flex items-center gap-1.5"><Info size={10}/> Material Attachments</span>
                <span className="text-[9px] font-black text-primary uppercase italic">{viewingCourse?.resources?.length || 0} Files</span>
              </div>
              
              <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                {viewingCourse?.resources && viewingCourse.resources.length > 0 ? viewingCourse.resources.map((res, i) => (
                  <a key={i} href={res.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white border rounded-xl hover:border-primary group transition-all">
                    <div className="flex items-center gap-3">
                       <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-primary transition-colors"><FileText size={14} /></div>
                       <p className="text-[11px] font-bold uppercase italic text-slate-700">{res.title}</p>
                    </div>
                    <ExternalLink size={12} className="text-slate-300 group-hover:text-primary" />
                  </a>
                )) : (
                  <p className="text-center text-[10px] text-slate-400 italic py-4">No materials available for this course.</p>
                )}
              </div>
            </div>

            <Button onClick={() => setViewingCourse(null)} className="w-full h-11 bg-slate-900 rounded-xl font-black text-xs uppercase italic tracking-widest hover:bg-primary border-none transition-all">Dismiss</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- ADD/EDIT MODAL --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl p-8 rounded-[2rem] max-h-[90vh] overflow-y-auto border-none shadow-2xl bg-white">
          <DialogHeader className="mb-4 text-center sm:text-left">
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
              {editingCourse ? "Modify Course" : "Register Course"}
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase italic text-slate-400 ml-1">Course Name</Label>
                <Input value={formData.courseName} onChange={(e) => setFormData({ ...formData, courseName: e.target.value })} className="h-11 bg-slate-50 border-none rounded-xl font-bold italic" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase italic text-slate-400 ml-1">Course Code</Label>
                <Input value={formData.courseCode} onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })} className="h-11 bg-slate-50 border-none rounded-xl font-bold italic uppercase" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase italic text-slate-400 ml-1">Instructor</Label>
                <Input value={formData.teacherName} onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })} className="h-11 bg-slate-50 border-none rounded-xl font-bold italic" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase italic text-slate-400 ml-1">Teacher ID</Label>
                <Input value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} className="h-11 bg-slate-50 border-none rounded-xl font-bold italic uppercase" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase italic text-slate-400 ml-1">Credit</Label>
                <Input value={formData.credit} onChange={(e) => setFormData({ ...formData, credit: e.target.value })} className="h-11 bg-slate-50 border-none rounded-xl font-bold italic" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase italic text-slate-400 ml-1">Semester</Label>
                <select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="h-11 bg-slate-50 border-none rounded-xl font-bold w-full px-4 italic text-[11px]">
                  <option value="">Select</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s.toString()}>Semester {s}</option>)}
                </select>
              </div>
            </div>

            {/* Resources Input */}
            <div className="space-y-3 border-t border-dashed pt-5 mt-2">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-black uppercase italic tracking-tight text-slate-600">Learning Materials</Label>
                <Button type="button" onClick={() => setResourceItems([...resourceItems, { title: "", file: null }])} variant="outline" className="h-7 px-3 rounded-lg border-primary text-primary text-[9px] font-black">+ ADD FILE</Button>
              </div>
              {resourceItems.map((item, index) => (
                <div key={index} className="flex gap-3 p-3 bg-slate-50 rounded-xl relative border group hover:border-slate-300 transition-all">
                  <button type="button" onClick={() => setResourceItems(resourceItems.filter((_, i) => i !== index))} className="absolute -right-1.5 -top-1.5 h-5 w-5 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-red-500 shadow-md transition-colors"><X size={10} /></button>
                  <Input placeholder="TITLE" value={item.title} onChange={(e) => { const upd = [...resourceItems]; upd[index].title = e.target.value; setResourceItems(upd); }} className="h-10 border-none bg-white rounded-lg font-bold text-[10px] uppercase italic" />
                  <Input type="file" onChange={(e) => { const upd = [...resourceItems]; upd[index].file = e.target.files?.[0] || null; setResourceItems(upd); }} className="h-10 border-none bg-white rounded-lg font-bold text-[10px] pt-3" />
                </div>
              ))}
            </div>

            <Button onClick={handleFormSubmit} disabled={isSubmitting} className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-tighter shadow-xl mt-4 bg-primary text-white hover:opacity-90 transition-all active:scale-95">
              {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : editingCourse ? "UPDATE DATABASE" : "SUBMIT COURSE"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}