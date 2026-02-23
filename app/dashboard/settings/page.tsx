"use client";

import { useState, useRef, FormEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Loader2,
  Save,
  BadgeCheck,
  GraduationCap,
  BookOpen,
  Heart,
  Shield,
  Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useUser } from "@/context/UserContext";

export default function StudentSettings() {
  const { data: session } = useSession();
  const { user, setUser } = useUser(); // Context থেকে ডাটা নিচ্ছি

  // Local state for form handling (Context এর ডাটা সরাসরি ইনপুটে দিলে টাইপ করতে সমস্যা হতে পারে)
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = (session as any)?.user?.accessToken;

  // Context এর ডাটা যখনই আসবে, তখন local state আপডেট হবে
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const form = new FormData();
    form.append("image", file);

    setUploading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://smart-cse-server-eta.vercel.app";
      const res = await fetch(`${apiUrl}/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();

      if (res.ok && data.url) {
        // Local state এবং Context উভয়ই আপডেট হবে
        const updatedUser = { ...formData, profileImage: data.url };
        setFormData(updatedUser);
        setUser(updatedUser);
        toast.success("Image uploaded! Don't forget to save changes.");
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData?._id || !token) return;

    Swal.fire({
      title: "Update Profile?",
      text: "আপনি কি আপনার তথ্য পরিবর্তন করতে চান?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      confirmButtonText: "Yes, Save changes",
      customClass: { popup: "rounded-[2rem]" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSaving(true);
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            "https://smart-cse-server-eta.vercel.app";

          // _id এবং immutable fields বাদ দিয়ে ডাটা পাঠানো
          const { _id, email, password, role, createdAt, ...cleanData } =
            formData;

          const res = await fetch(`${apiUrl}/users/${_id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(cleanData),
          });

          if (res.ok) {
            setUser(formData); // Navbar এর জন্য Context আপডেট
            toast.success("Profile updated successfully!");
          } else {
            toast.error("Update failed server-side");
          }
        } catch (err) {
          toast.error("Network or Error occurred");
        } finally {
          setSaving(false);
        }
      }
    });
  };

  // ডাটা লোড না হওয়া পর্যন্ত লোডার দেখাবে
  if (!formData)
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
        <p className="text-slate-400 font-medium">Loading your profile...</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1 px-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Student Profile
        </h1>
        <p className="text-slate-500 font-medium">
          Update and manage your university information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col items-center sticky top-6">
            <div className="relative group mb-6">
              <div className="h-32 w-32 rounded-full border-4 border-blue-600 p-1">
                <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                  {uploading ? (
                    <Loader2 className="animate-spin text-blue-500" />
                  ) : formData?.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-slate-500" />
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-3 bg-blue-600 rounded-2xl hover:scale-110 transition-transform"
              >
                <Camera size={16} />
              </button>
            </div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {formData?.name}{" "}
              <BadgeCheck size={18} className="text-blue-500" />
            </h2>
            <p className="text-blue-400 font-mono text-sm mt-1">
              {formData?.studentId}
            </p>
          </div>
        </div>

        {/* Right Side: Detailed Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border shadow-xl">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Common Fields */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Email (Immutable)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={formData.email || ""}
                    disabled
                    className="pl-10 h-12 bg-slate-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Dynamic Student Fields */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Batch
                </label>
                <div className="relative">
                  <Layout className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={formData.batch || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, batch: e.target.value })
                    }
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Current Semester
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={formData.semester || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Current CGPA
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cgpa || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, cgpa: e.target.value })
                    }
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Blood Group
                </label>
                <div className="relative">
                  <Heart className="absolute left-3 top-3.5 h-4 w-4 text-red-400" />
                  <Input
                    value={formData.bloodGroup || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-full">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Guardian's Contact
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={formData.guardianPhone || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guardianPhone: e.target.value,
                      })
                    }
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 h-14 px-10 rounded-2xl font-black shadow-lg shadow-blue-600/30"
              >
                {saving ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Save className="mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
