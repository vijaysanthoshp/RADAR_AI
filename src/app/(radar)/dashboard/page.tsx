import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  AlertTriangle, 
  Heart, 
  Droplet, 
  Wind, 
  FlaskConical, 
  Brain, 
  ChevronRight, 
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Urgent Action Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Critical Alerts</h2>
        </div>
        <Link href="/action" className="block">
          <Card className="overflow-hidden border-0 shadow-lg relative bg-gradient-to-r from-amber-500 to-orange-600 text-white cursor-pointer hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3 py-1 text-xs font-medium rounded-md uppercase tracking-wide">
                    RTAR Class: Yellow
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold mb-2">URGENT ACTION REQUIRED</h3>
                  <p className="text-white/90 text-lg">Fluid levels elevated. Dialysis Required immediately.</p>
                </div>
              </div>
              
              <Button className="bg-white text-orange-600 hover:bg-gray-50 border-0 font-bold px-8 py-6 h-auto text-lg shadow-xl shrink-0">
                View Diagnosis & Plan
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </Link>
      </section>

      {/* Biometric Systems Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Biometric Systems Status</h2>
            <p className="text-sm text-slate-500">Real-time monitoring of patient vitals</p>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 px-4 py-1.5 text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            4/5 Systems Stable
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cardiovascular */}
          {/* Cardiovascular */}
          <Link href="/cardiovascular" className="block">
            <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 group h-full cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-rose-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                </div>
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <h3 className="font-bold text-slate-700 text-lg mb-1">Cardiovascular</h3>
              <p className="text-sm text-slate-400">Heart rate and BP normal</p>
            </Card>
          </Link>

          {/* Renal & Fluid */}
          {/* Renal & Fluid */}
          <Link href="/renal" className="block">
            <Card className="p-6 border-l-4 border-l-amber-500 shadow-md bg-amber-50/30 relative overflow-hidden group h-full cursor-pointer">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                 <AlertTriangle className="h-24 w-24 text-amber-500 fill-amber-500" />
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="bg-blue-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Droplet className="h-6 w-6 text-blue-500 fill-blue-500" />
                </div>
                <div className="bg-amber-100 p-1.5 rounded-full animate-pulse">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1 relative z-10">Renal & Fluid</h3>
              <p className="text-sm text-amber-700 font-medium relative z-10">Attention Required</p>
            </Card>
          </Link>

          {/* Respiratory */}
          {/* Respiratory */}
          <Link href="/respiratory" className="block">
            <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 group h-full cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-cyan-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Wind className="h-6 w-6 text-cyan-500" />
                </div>
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <h3 className="font-bold text-slate-700 text-lg mb-1">Respiratory</h3>
              <p className="text-sm text-slate-400">O2 Saturation optimal</p>
            </Card>
          </Link>

          {/* Metabolic */}
          {/* Metabolic */}
          <Link href="/metabolic" className="block">
            <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 group h-full cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <FlaskConical className="h-6 w-6 text-purple-500" />
                </div>
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <h3 className="font-bold text-slate-700 text-lg mb-1">Metabolic</h3>
              <p className="text-sm text-slate-400">Glucose levels stable</p>
            </Card>
          </Link>
        </div>
      </section>

      {/* Autonomic System & Other Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/autonomic" className="md:col-span-2 block">
          <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-slate-100 p-3 rounded-xl">
                <Brain className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Autonomic System</h3>
                <p className="text-sm text-slate-500">Nervous system activity</p>
              </div>
              <Badge className="ml-auto bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">
                Stable
              </Badge>
            </div>
            <div className="h-24 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 border-dashed">
              <span className="text-slate-400 text-sm">Activity Graph Placeholder</span>
            </div>
          </Card>
        </Link>

        <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-slate-800 to-slate-900 text-white flex flex-col justify-center items-center text-center">
           <h3 className="text-lg font-medium text-slate-300 mb-2">Overall Health Score</h3>
           <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
             85
           </div>
           <p className="text-sm text-slate-400">Improving since yesterday</p>
        </Card>
      </section>
    </div>
  )
}