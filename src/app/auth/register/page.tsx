"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { registerUser } from "@/app/actions/auth"
import { Activity, ShieldCheck, Lock } from "lucide-react"

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerUser, undefined)

  return (
    <div className="w-full h-screen flex overflow-hidden">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold tracking-tight">R.A.D.A.R.</span>
          </div>
          <p className="text-slate-400 text-sm">Real-time Advanced Data Analysis & Reporting</p>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Join the Future of Healthcare
          </h2>
          <p className="text-lg text-slate-300">
            Create an account to access advanced patient monitoring tools and collaborative features.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>Secure Access</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Lock className="h-5 w-5 text-blue-500" />
              <span>Data Privacy</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          © 2025 RADAR System. All rights reserved.
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900">Create an account</h1>
            <p className="mt-2 text-slate-600">
              Enter your information to get started.
            </p>
          </div>

          <form action={action} className="space-y-6">
            {state?.error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm font-medium">
                {state.error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Mr. Max Robinson" 
                required 
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@gmail.com"
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="h-11"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white"
              disabled={isPending}
            >
              {isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
