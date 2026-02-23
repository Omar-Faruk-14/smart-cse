"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/public/cse.avif"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  BriefcaseBusiness,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    studentId: "",
    batch: "",
    semester: "", // Added semester field
    cgpa: "",
    bloodGroup: "",
    guardianPhone: "",
    teacherId: "",
    designation: "",
    specialization: "",
    experience: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Identity অনুযায়ী ডাইনামিক পেলোড তৈরি
    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      gender: formData.gender,
      role: role, 
      ...(role === "student"
        ? {
            studentId: formData.studentId,
            batch: formData.batch,
            semester: formData.semester, 
            cgpa: formData.cgpa,
            bloodGroup: formData.bloodGroup,
            guardianPhone: formData.guardianPhone,
          }
        : {
            teacherId: formData.teacherId,
            designation: formData.designation,
            specialization: formData.specialization,
            experience: formData.experience,
          }),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed ");
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully 🎉");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast.error("Network error! Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/hero-students.jpg"
          alt="SmartCSE"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12 text-white">
          <Image src={logo} alt="SmartCSE Logo" width={60} height={34} className="object-contain" />
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">SmartCSE</h1>
          <p className="text-xl max-w-md opacity-90 font-light">
            Empowering the next generation of Computer Science excellence.
          </p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto bg-slate-50/30">
        <Card className="w-full max-w-2xl border-none shadow-none lg:border lg:shadow-xl lg:bg-card">
          <CardHeader className="text-center pb-2">
            <Link href="/" className="mx-auto mb-6 flex justify-center items-center gap-2">
              <div className=" p-2.5 rounded-xl shadow-lg shadow-primary/20">
                          <Image src={logo} alt="SmartCSE Logo" width={34} height={34} className="object-contain" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-primary italic">
                SmartCSE
              </span>
            </Link>
            <CardTitle className="text-2xl font-bold">
              {step === 1 ? "Choose Your Identity" : `${role.charAt(0).toUpperCase() + role.slice(1)} Profile`}
            </CardTitle>
            <CardDescription className="text-base">
              {step === 1 ? "Select how you'll be using the platform" : "Fill in your academic/professional details"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {/* STEP 1: ROLE SELECTION */}
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                <RadioGroup
                  defaultValue="student"
                  onValueChange={(v) => setRole(v as any)}
                  className="grid grid-cols-2 gap-6"
                >
                  <Label htmlFor="s-role" className="cursor-pointer group">
                    <RadioGroupItem value="student" id="s-role" className="sr-only" />
                    <div className={`h-full p-8 border-2 rounded-2xl flex flex-col items-center text-center gap-4 transition-all duration-300 shadow-sm hover:shadow-md ${role === "student" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-muted bg-white opacity-80"}`}>
                      <div className={`p-4 rounded-full transition-colors ${role === "student" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                        <GraduationCap className="h-10 w-10" />
                      </div>
                      <div>
                        <span className="text-xl font-bold block mb-1">Student</span>
                        <p className="text-xs text-muted-foreground">Access resources & track results</p>
                      </div>
                    </div>
                  </Label>

                  <Label htmlFor="t-role" className="cursor-pointer group">
                    <RadioGroupItem value="teacher" id="t-role" className="sr-only" />
                    <div className={`h-full p-8 border-2 rounded-2xl flex flex-col items-center text-center gap-4 transition-all duration-300 shadow-sm hover:shadow-md ${role === "teacher" ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-muted bg-white opacity-80"}`}>
                      <div className={`p-4 rounded-full transition-colors ${role === "teacher" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                        <BriefcaseBusiness className="h-10 w-10" />
                      </div>
                      <div>
                        <span className="text-xl font-bold block mb-1">Teacher</span>
                        <p className="text-xs text-muted-foreground">Manage courses & guide students</p>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>

                <div className="space-y-6">
                  <Button onClick={() => setStep(2)} className="w-full py-7 text-xl font-semibold group rounded-xl shadow-lg">
                    Continue <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Sign In</Link>
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2: FORM */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="px-2 h-auto text-sm font-medium flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors hover:bg-transparent mb-2">
                  <ArrowLeft className="h-4 w-4" /> Switch Role
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Md. Imam" value={formData.fullName} onChange={handleChange} required className="rounded-lg" />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="imam@bu.edu.bd" value={formData.email} onChange={handleChange} required className="rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+8801..." value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select onValueChange={(v) => handleSelectChange("gender", v)}>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {role === "student" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input id="studentId" placeholder="21CSE-044" value={formData.studentId} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Current Semester</Label>
                        <Select onValueChange={(v) => handleSelectChange("semester", v)}>
                          <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select Semester" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Semester</SelectItem>
                            <SelectItem value="2">2nd Semester</SelectItem>
                            <SelectItem value="3">3rd Semester</SelectItem>
                            <SelectItem value="4">4th Semester</SelectItem>
                            <SelectItem value="5">5th Semester</SelectItem>
                            <SelectItem value="6">6th Semester</SelectItem>
                            <SelectItem value="7">7th Semester</SelectItem>
                            <SelectItem value="8">8th Semester</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="batch">Batch</Label>
                        <Input id="batch" placeholder="21st" value={formData.batch} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cgpa">Current CGPA</Label>
                        <Input id="cgpa" type="number" step="0.01" placeholder="3.85" value={formData.cgpa} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input id="bloodGroup" placeholder="O+" value={formData.bloodGroup} onChange={handleChange} />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="guardianPhone">Guardian's Contact</Label>
                        <Input id="guardianPhone" placeholder="Emergency Phone" value={formData.guardianPhone} onChange={handleChange} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="teacherId">Teacher ID</Label>
                        <Input id="teacherId" placeholder="T-101" value={formData.teacherId} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input id="designation" placeholder="Assistant Professor" value={formData.designation} onChange={handleChange} />
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="experience">Experience (Years)</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="experience" type="number" placeholder="5" className="pl-9" value={formData.experience} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="specialization">Primary Specialization</Label>
                        <Input id="specialization" placeholder="ML, IoT, Web" value={formData.specialization} onChange={handleChange} />
                      </div>
                    </>
                  )}

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="password">Security Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl shadow-lg" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Complete Registration"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already registered? <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Sign In</Link>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}