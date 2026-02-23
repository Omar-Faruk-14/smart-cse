"use client";

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { MoreVertical } from "lucide-react";
import { Search, Eye, Trash2, Ban, User } from "lucide-react";
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
import Swal from "sweetalert2";

interface CustomSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
  };
}

interface UserType {
  _id: string;
  name?: string;
  email?: string;
  accessToken?: string;
  role: string;
  banned?: boolean;
  phone?: string;
  gender?: string;
  teacherId?: string;
  designation?: string;
  specialization?: string;
  experience?: number;
  studentId?: string;
  batch?: string;
  semester?: string;
  cgpa?: number;
  bloodGroup?: string;
  guardianPhone?: string;
}

export default function AllUsersPage() {
  const { data: session, status } = useSession();
  

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewUser, setViewUser] = useState<UserType | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addingUser, setAddingUser] = useState(false);

  //
  useEffect(() => {
    if (status === "authenticated" && (session?.user as { accessToken?: string })?.accessToken) {
      fetchUsers();
    }
  }, [session, status]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5001/users", {
        headers: {
          Authorization: `Bearer ${(session?.user as { accessToken?: string })?.accessToken}`,
        },
      });
      console.log(res.data);

      setUsers(res.data);
      setError(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: string, newRole: string) => {
    await axios.patch(
      `http://localhost:5001/users/${id}`,
      { role: newRole },
      {
        headers: {
          Authorization: `Bearer ${(session?.user as { accessToken?: string })?.accessToken}`,
        },
      },
    );
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // red
      cancelButtonColor: "#64748b", // slate
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (!result.isConfirmed) return;
  
    try {
      await axios.delete(`http://localhost:5001/users/${id}`, {
        headers: {
          Authorization: `Bearer ${(session?.user as { accessToken?: string })?.accessToken}`,
        },
      });
  
      await Swal.fire({
        title: "Deleted!",
        text: "User has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
  
      fetchUsers();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete user.",
        icon: "error",
      });
    }
  };

  const toggleBan = async (id: string, currentStatus?: boolean) => {
    await axios.patch(
      `http://localhost:5001/users/${id}`,
      { banned: !currentStatus },
      {
        headers: {
          Authorization: `Bearer ${(session?.user as { accessToken?: string })?.accessToken}`,
        },
      },
    );
    fetchUsers();
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [users, searchQuery]);

  const handleAddUser = async () => {
    try {
      if ( !newName || !newEmail || !newPassword) {
        alert("Email and Password required");
        return;
      }

      setAddingUser(true);

      await axios.post("http://localhost:5001/users", {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: "student", // default role
      });

      setNewEmail("");
      setNewPassword("");
      fetchUsers();
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert("User already exists");
      } else {
        alert("Failed to add user");
      }
    } finally {
      setAddingUser(false);
    }
  };

  

  if (loading) {
    return <div className="p-10 text-center font-bold">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Unauthorized or Failed to load users
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase underline decoration-primary decoration-4 underline-offset-8">
          All Users
        </h1>

        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl font-bold">
              + Add User
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-bold">Name</p>
              <Input
                type="text"
                placeholder="Enter name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold">Email</p>
              <Input
                type="email"
                placeholder="Enter email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold">Password</p>
              <Input
                type="password"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handleAddUser}
              className="w-full"
              disabled={addingUser}
            >
              {addingUser ? "Adding..." : "Submit"}
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <Card className="p-6 rounded-[2.5rem] border shadow-sm bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by name, email or role..."
            className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* TABLE SECTION */}
      {/* TABLE SECTION */}
      <div>
        <Card className="rounded-3xl shadow-sm">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[420px]">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    {/* USER INFO */}
                    <TableCell className="max-w-[160px]">
                      <div className="font-bold truncate">
                        {user.name || "No Name"}
                      </div>
                    </TableCell>

                    {/* ROLE */}
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => updateRole(user._id, value)}
                      >
                        <SelectTrigger className="w-24 md:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* STATUS (Mobile + Desktop both visible) */}
                    <TableCell className="hidden md:table-cell">
                      {user.banned ? (
                        <span className="text-red-500 font-bold text-xs md:text-sm">
                          Banned
                        </span>
                      ) : (
                        <span className="text-green-600 font-bold text-xs md:text-sm">
                          Active
                        </span>
                      )}
                    </TableCell>

                    {/* ACTIONS DROPDOWN */}

                    <TableCell className="text-right">
                      {/* Desktop Buttons */}
                      <div className="hidden md:flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setViewUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleBan(user._id, user.banned)}
                          className="text-yellow-600"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteUser(user._id)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Mobile Dropdown */}
                      <div className="md:hidden flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => setViewUser(user)}
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => toggleBan(user._id, user.banned)}
                              className="gap-2 text-yellow-600"
                            >
                              <Ban className="w-4 h-4" />
                              {user.banned ? "Unban" : "Ban"}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => deleteUser(user._id)}
                              className="gap-2 text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* MODAL */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>User Info</DialogTitle>
            <DialogDescription>Full identity information</DialogDescription>
          </DialogHeader>

          <div className="bg-slate-900 p-10 text-center space-y-3">
            <div className="inline-flex p-4 bg-primary/20 rounded-3xl">
              <User size={36} className="text-primary" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic">
              {viewUser?.name}
            </h2>
            <p className="text-primary uppercase tracking-widest text-xs font-black">
              {viewUser?.role}
            </p>
          </div>

          <div className="p-10 space-y-6 bg-white font-bold italic">
            <div>
              <p className="text-xs uppercase text-slate-400">Email</p>
              <p className="text-lg text-slate-700">{viewUser?.email}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">Phone</p>
              <p className="text-lg text-slate-700">{viewUser?.phone}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">Gender</p>
              <p className="text-lg text-slate-700">{viewUser?.gender}</p>
            </div>

            {/* Teacher Info */}
            {viewUser?.role === "teacher" && (
              <>
                <div>
                  <p className="text-xs uppercase text-slate-400">Teacher ID</p>
                  <p className="text-lg text-slate-700">{viewUser.teacherId}</p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">
                    Designation
                  </p>
                  <p className="text-lg text-slate-700">
                    {viewUser.designation}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">
                    Specialization
                  </p>
                  <p className="text-lg text-slate-700">
                    {viewUser.specialization}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">Experience</p>
                  <p className="text-lg text-slate-700">
                    {viewUser.experience} Years
                  </p>
                </div>
              </>
            )}

            {/* Student Info */}
            {viewUser?.role === "student" && (
              <>
                <div>
                  <p className="text-xs uppercase text-slate-400">Student ID</p>
                  <p className="text-lg text-slate-700">{viewUser.studentId}</p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">Batch</p>
                  <p className="text-lg text-slate-700">{viewUser.batch}</p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">Semester</p>
                  <p className="text-lg text-slate-700">{viewUser.semester}</p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">CGPA</p>
                  <p className="text-lg text-slate-700">{viewUser.cgpa}</p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">
                    Blood Group
                  </p>
                  <p className="text-lg text-slate-700">
                    {viewUser.bloodGroup}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-400">
                    Guardian Phone
                  </p>
                  <p className="text-lg text-slate-700">
                    {viewUser.guardianPhone}
                  </p>
                </div>
              </>
            )}

            <Button
              onClick={() => setViewUser(null)}
              className="w-full h-14 rounded-2xl font-black uppercase"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
