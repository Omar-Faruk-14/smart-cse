"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  User,
  Mail,
  X,
  ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

interface Teacher {
  _id?: string; // MongoDB uses _id
  name: string;
  email: string;
  phone: string;
  designation: string;
  specialization: string;
  experience: string;
  imageUrl: string;
  teacherId: string;
  role?: string;
}

export default function FacultyManagement() {
  const { data: session } = useSession();
  const token = (session?.user as any)?.accessToken;
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://smart-cse-server-eta.vercel.app";

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");

  // Modal States
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // image url state

  const [isUploading, setIsUploading] = useState(false);

  // Form Field States
  const [formData, setFormData] = useState<Teacher>({
    name: "",
    email: "",
    phone: "",
    designation: "",
    specialization: "",
    experience: "",
    teacherId: "",
    imageUrl: "",
    role: "teacher",
  });

  // 1. Fetch Faculties from API
  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/faculties`);

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      setTeachers([...data].reverse());
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // Filter Logic
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.teacherId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDesignation =
        designationFilter === "all" ||
        t.designation === designationFilter ||
        t.role === "teacher";
      return matchesSearch && matchesDesignation;
    });
  }, [teachers, searchQuery, designationFilter]);

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      designation: "",
      specialization: "",
      experience: "",
      teacherId: "",
      imageUrl: "",
      role: "teacher",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, teacher: Teacher) => {
    e.stopPropagation();
    setEditingTeacher(teacher);
    setFormData({ ...teacher });
    setIsFormOpen(true);
  };

  // 2. Delete Faculty
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This profile will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${baseUrl}/faculties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json(); // only once

      if (res.ok) {
        setTeachers((prev) => prev.filter((t) => t._id !== id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Profile has been removed successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: data.message || "Only admin can delete this profile.",
          confirmButtonColor: "#EF4444",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    }
  };
  // 3. Add or Update Faculty
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingTeacher ? "PATCH" : "POST";
    const url = editingTeacher
      ? `${baseUrl}/faculties/${editingTeacher._id}`
      : `${baseUrl}/faculties`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchFaculties(); // Refresh list
        setIsFormOpen(false);
      } else {
        alert("Operation failed. Check admin permissions.");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = (session?.user as any)?.accessToken;
    if (!token) {
      alert("Unauthorized");
      return;
    }

    setIsUploading(true);

    try {
      const formDataImage = new FormData();
      formDataImage.append("image", file); // MUST match backend upload.single("image")

      const res = await fetch(`${baseUrl}/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataImage,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
            Faculty
          </h1>
          <p className="text-slate-500 font-medium italic text-sm pt-2 px-1">
            SmartCSE Department Administration
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-primary h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 active:scale-95 transition-all"
        >
          <Plus className="mr-2 h-6 w-6 stroke-[3px]" /> ADD TEACHER
        </Button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by Name or Teacher ID..."
              className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select onValueChange={setDesignationFilter} defaultValue="all">
            <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
              <SelectValue placeholder="Designation" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl font-bold">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Assistant Professor">
                Assistant Professor
              </SelectItem>
              <SelectItem value="Lecturer">Lecturer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Teacher Table */}
      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900 border-none">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24 px-8 text-white font-bold py-6 italic uppercase tracking-widest">
                Photo
              </TableHead>
              <TableHead className="text-white font-bold py-6 italic uppercase tracking-widest">
                Teacher Info
              </TableHead>
              <TableHead className="text-white font-bold py-6 italic uppercase tracking-widest hidden md:table-cell text-right px-8">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-20">
                  <Loader2 className="animate-spin h-10 w-10 mx-auto text-primary" />
                  <p className="mt-2 font-bold italic text-slate-400">
                    Loading Faculty Data...
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow
                  key={teacher._id}
                  className="cursor-pointer hover:bg-slate-50 transition-all group"
                  onClick={() => setViewingTeacher(teacher)}
                >
                  <TableCell className="px-8 py-6">
                    <div className="h-14 w-14 border-2 border-slate-100 rounded-2xl bg-slate-50 relative overflow-hidden flex items-center justify-center shadow-inner group-hover:border-primary/40">
                      {teacher.imageUrl ? (
                        <Image
                          src={teacher.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-slate-300" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <p className="font-black text-slate-800 text-lg uppercase tracking-tight italic group-hover:text-primary transition-colors">
                      {teacher.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                      {teacher.teacherId} • {teacher.designation}
                    </p>
                  </TableCell>
                  <TableCell
                    className="text-right px-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={(e) => handleOpenEdit(e, teacher)}
                      >
                        <Pencil size={16} className="text-blue-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={(e) => handleDelete(e, teacher._id!)}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* --- MODAL 1: VIEW PROFILE --- */}
      <Dialog
        open={!!viewingTeacher}
        onOpenChange={() => setViewingTeacher(null)}
      >
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{viewingTeacher?.name || "Profile"}</DialogTitle>
            <DialogDescription>
              Viewing teacher profile details.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-900 p-10 flex flex-col items-center text-center space-y-4">
            <div className="h-32 w-32 rounded-[2rem] border-4 border-primary/30 relative overflow-hidden bg-white shadow-2xl">
              {viewingTeacher?.imageUrl ? (
                <Image
                  src={viewingTeacher.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-12 w-12 m-auto mt-8 text-slate-200" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                {viewingTeacher?.name}
              </h2>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">
                {viewingTeacher?.designation}
              </p>
            </div>
          </div>
          <div className="p-8 space-y-4 bg-white font-bold italic">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 border-b pb-2">
                <p className="text-[10px] text-slate-400 uppercase">
                  Specialization
                </p>
                <p className="text-slate-700">
                  {viewingTeacher?.specialization}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Teacher ID
                </p>
                <p className="text-slate-700">{viewingTeacher?.teacherId}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Experience
                </p>
                <p className="text-slate-700">
                  {viewingTeacher?.experience} Years
                </p>
              </div>
              <div className="col-span-2 pt-2 border-t flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} /> {viewingTeacher?.email}
              </div>
            </div>
            <Button
              onClick={() => setViewingTeacher(null)}
              className="w-full mt-4 rounded-xl"
            >
              DISMISS
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL 2: ADD / EDIT FORM --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl p-10 rounded-[2.5rem] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">
              {editingTeacher ? "Edit" : "New"} Faculty Member
            </DialogTitle>
            <DialogDescription className="italic font-medium text-slate-400">
              Enter teacher's official information.
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid grid-cols-2 gap-6 mt-6"
            onSubmit={handleFormSubmit}
          >
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Label className="text-[10px] font-black uppercase ml-1">
                Full Name
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                required
              />
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Label className="text-[10px] font-black uppercase ml-1">
                Teacher ID
              </Label>
              <Input
                value={formData.teacherId}
                onChange={(e) =>
                  setFormData({ ...formData, teacherId: e.target.value })
                }
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                required
              />
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Label className="text-[10px] font-black uppercase ml-1">
                Designation
              </Label>
              <Input
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
              />
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Label className="text-[10px] font-black uppercase ml-1">
                Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                required
              />
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Label className="text-[10px] font-black uppercase ml-1">
                Phone Number
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
              />
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Label className="text-[10px] font-black uppercase ml-1">
                Years of Experience
              </Label>
              <Input
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
              />
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-[10px] font-black uppercase ml-1">
                Specialization
              </Label>
              <Input
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
              />
            </div>

            {/* ==========image ==========  */}
            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Profile Picture
              </Label>

              {formData.imageUrl ? (
                <div className="relative h-48 w-full rounded-[2rem] border-4 border-slate-50 overflow-hidden shadow-inner">
                  <Image
                    src={formData.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-3 right-3 h-10 w-10 rounded-full shadow-lg"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        imageUrl: "",
                      }))
                    }
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="faculty-file-upload"
                    disabled={isUploading}
                  />

                  <label
                    htmlFor="faculty-file-upload"
                    className="w-full h-32 border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition-all"
                  >
                    {isUploading ? (
                      <Loader2 className="animate-spin text-primary h-8 w-8" />
                    ) : (
                      <>
                        <ImageIcon className="text-slate-300 h-8 w-8" />
                        <span className="text-[10px] font-black uppercase text-slate-400 italic">
                          Click to browse image
                        </span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-16 rounded-2xl font-black text-xl uppercase tracking-tighter col-span-2 shadow-2xl shadow-primary/30 mt-4"
            >
              {editingTeacher ? "Update" : "Save"} Faculty Profile
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
