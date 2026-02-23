"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  Image as ImageIcon,
  X,
  Loader2,
  Calendar,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

/* ================= TYPES ================= */
interface Notice {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: string;
}

/* ================= COMPONENT ================= */
export default function AdminNotices() {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  /* ================= FETCH ================= */
  const fetchNotices = async () => {
    try {
      const token = (session?.user as any)?.accessToken;
      if (!token) return;

      const res = await fetch(`${API_URL}/notices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [session]);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_URL}/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setImageUrl(data.url);
        setImagePublicId(data.public_id);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      imageUrl,
      publicId: imagePublicId,
    };

    const url = editingNotice
      ? `${API_URL}/notices/${editingNotice._id}`
      : `${API_URL}/notices`;

    const method = editingNotice ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingNotice ? "Notice updated" : "Notice created");
        fetchNotices();
        closeForm();
      }
    } catch {
      toast.error("Save failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (notice: Notice) => {
    const result = await Swal.fire({
      title: "Delete notice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/notices/${notice._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.accessToken}`,
        },
      });

      if (res.ok) {
        setNotices((prev) => prev.filter((n) => n._id !== notice._id));
        Swal.fire("Deleted!", "", "success");
      }
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  /* ================= HELPERS ================= */
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingNotice(null);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setImagePublicId("");
  };

  const filteredNotices = useMemo(
    () =>
      notices.filter((n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [notices, searchQuery],
  );

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
          All Notices
        </h1>

        <Button
          onClick={() => setIsFormOpen(true)}
          className="h-14 px-8 rounded-2xl font-black text-lg shadow-xl"
        >
          <Plus className="mr-2" /> ADD NEW
        </Button>
      </div>

      {/* SEARCH */}

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow>
                <TableHead className="text-white font-bold py-6 px-8 uppercase italic">
                  Notice
                </TableHead>
                <TableHead className="text-white font-bold py-6 uppercase italic">
                  Date
                </TableHead>
                <TableHead className="text-white font-bold py-6 uppercase italic text-right px-8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotices.map((notice) => (
                <TableRow
                  key={notice._id}
                  className="hover:bg-slate-50 transition"
                >
                  {/* TITLE */}
                  <TableCell className="px-8 py-6">
                    <p className="font-bold text-slate-800 text-base truncate max-w-[420px]">
                      {notice.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </TableCell>

                  {/* EMPTY / TYPE */}
                  <TableCell className="py-6">
                    <span className="text-xs text-slate-500">Notice</span>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setViewingNotice(notice)}
                      >
                        <Eye size={16} />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingNotice(notice);
                          setTitle(notice.title);
                          setDescription(notice.description);
                          setImageUrl(notice.imageUrl || "");
                          setImagePublicId(notice.imagePublicId || "");
                          setIsFormOpen(true);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleDelete(notice)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {filteredNotices.map((notice) => (
          <Card key={notice._id} className="p-5 rounded-3xl shadow-lg">
            <p className="font-black text-lg uppercase">{notice.title}</p>
            <p className="text-sm text-slate-500">
              {new Date(notice.createdAt).toDateString()}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full uppercase">
                Official
              </span>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setViewingNotice(notice)}
                >
                  <Eye size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setEditingNotice(notice)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleDelete(notice)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ================= VIEW MODAL ================= */}
      <Dialog
        open={!!viewingNotice}
        onOpenChange={() => setViewingNotice(null)}
      >
        <DialogContent className="max-w-2xl p-0 rounded-[2.5rem] overflow-hidden border-none shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Notice</DialogTitle>
            <DialogDescription>Notice details</DialogDescription>
          </DialogHeader>

          {viewingNotice?.imageUrl && (
            <div className="relative h-64 bg-black">
              <Image
                src={viewingNotice.imageUrl}
                alt=""
                fill
                className="object-contain"
              />
            </div>
          )}

          <div className="p-10 space-y-4 bg-white">
            <h2 className="text-3xl font-black uppercase italic">
              {viewingNotice?.title}
            </h2>
            <p className="font-medium italic text-slate-600 whitespace-pre-wrap">
              {viewingNotice?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= FORM MODAL ================= */}
      <Dialog open={isFormOpen} onOpenChange={closeForm}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic uppercase">
              {editingNotice ? "Edit" : "New"} Notice
            </DialogTitle>
            <DialogDescription>Create or update notice</DialogDescription>
          </DialogHeader>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={5}
              required
            />

            {imageUrl ? (
              <div className="relative h-40 rounded-2xl overflow-hidden">
                <Image src={imageUrl} alt="" fill className="object-cover" />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImageUrl("");
                    setImagePublicId("");
                  }}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            )}

            <Button
              type="submit"
              disabled={isUploading}
              className="w-full h-14 font-black uppercase"
            >
              {editingNotice ? "Update" : "Publish"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
