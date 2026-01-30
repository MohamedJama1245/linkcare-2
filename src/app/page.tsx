"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2,
  Shield,
  Bell,
  Phone,
  Stethoscope,
  Clock,
  ChevronRight,
  Pill,
  Activity,
  Heart,
  Zap,
  Eye,
  FileX,
  Brain,
  Droplet,
  Syringe,
  Timer,
  Mic,
  Globe,
  PhoneCall,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Weighted spring config for Apple-like smoothness
const smoothConfig = { stiffness: 50, damping: 20, mass: 1.5 };

const fadeInUp = {
  hidden: { opacity: 0, y: 80, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] as const }
  }
};

const fadeIn = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Smooth spring-based transforms
  const heroY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), smoothConfig);
  const heroOpacity = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0]), smoothConfig);
  const heroScale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0.95]), smoothConfig);
  const heroBlur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);

  const clinicalTabs = [
    {
      label: "NBM/Fasting",
      icon: Timer,
      content: {
        title: "Modern NBM Protocols",
        description: "We distinguish between 'Stop Solid Food' (6 hours) and 'Sip-Til-Send' (modern hydration protocols). Clear fluids until 2 hours before surgery reduces dehydration complications by 40%.",
        highlight: "6hr / 2hr split"
      }
    },
    {
      label: "Diabetes",
      icon: Activity,
      content: {
        title: "The Diabetic Paradox",
        description: "Preventing hypoglycemic attacks from fasting vs. hyperglycemic spikes from missed insulin. We deliver timed insulin adjustment instructions that balance both risks.",
        highlight: "Glucose-safe surgery"
      }
    },
    {
      label: "Polypharmacy",
      icon: Pill,
      content: {
        title: "Complex Medication Management",
        description: "Helping elderly patients manage 10+ medications without dangerous interactions. Automated 'stop lists' and 'continue lists' customized to each procedure type.",
        highlight: "10+ meds managed"
      }
    },
    {
      label: "Blood Thinners",
      icon: Droplet,
      content: {
        title: "Anticoagulation Windows",
        description: "Automated countdowns for stopping Warfarin (5 days) vs. DOACs (48-72 hours). Bridging therapy alerts for high-risk patients ensure clot prevention during the gap.",
        highlight: "5-day countdown"
      }
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#040a06] text-white antialiased overflow-x-hidden">
      
      {/* Deep gradient atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#061208] via-[#040a06] to-[#050c07]" />
        
        {/* Ambient teal glow - hero area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] opacity-30">
          <div className="absolute inset-0 bg-gradient-radial from-teal-500/20 via-teal-500/5 to-transparent" />
        </div>
        
        {/* Subtle emerald accent bottom right */}
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] opacity-20">
          <div className="absolute inset-0 bg-gradient-radial from-emerald-500/15 to-transparent" />
        </div>
        
        {/* Fine grain texture for depth */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Navigation - Ultra glass */}
      <motion.nav 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-8 px-8 py-4 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Stethoscope className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white/90 tracking-tight">LinkCare</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#anatomy" className="text-[13px] text-white/40 hover:text-white/90 transition-colors duration-300">The Problem</Link>
            <Link href="#solution" className="text-[13px] text-white/40 hover:text-white/90 transition-colors duration-300">Solution</Link>
            <Link href="#costs" className="text-[13px] text-white/40 hover:text-white/90 transition-colors duration-300">Costs</Link>
          </div>
          <Link href="/demo/dashboard">
            <button className="h-9 px-5 rounded-xl bg-white text-[#0a0a0f] text-[13px] font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/10">
              Request Demo
            </button>
          </Link>
        </div>
      </motion.nav>

      {/* ============================================ */}
      {/* HERO - The 72-Hour Safety Net */}
      {/* ============================================ */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-20">
        
        {/* Floating ambient orbs */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          style={{ y: heroY }}
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-teal-400/20 blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/15 blur-[140px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full bg-emerald-400/10 blur-[160px]" 
          />
        </motion.div>

        <motion.div 
          style={{ 
            opacity: heroOpacity, 
            scale: heroScale, 
            y: heroY,
            filter: useTransform(heroBlur, v => `blur(${v}px)`)
          }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          {/* Eyebrow badge - Cost urgency */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 mb-10 shadow-lg shadow-black/10"
          >
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-200/90 font-medium tracking-wide">
              NHS Theatre Cost: £20/minute. Don&apos;t let confusion burn your budget.
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(2.5rem,8vw,6rem)] font-bold tracking-[-0.04em] leading-[1.1]"
          >
            <span className="block text-white/95">The 72-Hour</span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="block mt-2 bg-gradient-to-r from-teal-200 via-emerald-300 to-cyan-200 bg-clip-text text-transparent pb-4"
            >
              Safety Net
            </motion.span>
            <span className="block text-white/50 text-[0.5em] mt-4">for NHS Waiting Lists</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            className="mt-10 text-lg sm:text-xl text-white/40 max-w-3xl mx-auto leading-relaxed font-light"
          >
            <span className="text-white/70 font-medium">135,000 surgeries</span> are cancelled annually—mostly because 
            patients didn&apos;t understand a leaflet. LinkCare bridges the gap between{" "}
            <span className="text-teal-300/90 font-medium">the clinic and the theatre</span>.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link href="/demo/dashboard">
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-[#0a0a0f] text-base font-semibold hover:bg-white/90 transition-all duration-300 shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]">
                Request Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#anatomy">
              <button className="h-14 px-8 rounded-2xl text-white/50 hover:text-white/90 text-base font-medium transition-all duration-300 hover:bg-white/[0.05]">
                Learn More
                <ChevronRight className="inline ml-1 h-5 w-5" />
              </button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="mt-20 flex items-center justify-center gap-10 text-[13px] text-white/25"
          >
            {["NICE Compliant", "NHS Integrated", "GDPR Compliant"].map((badge) => (
              <div key={badge} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400/50" />
                <span className="font-medium tracking-wide">{badge}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* ANATOMY OF A CANCELLATION - Vertical Timeline */}
      {/* ============================================ */}
      <section id="anatomy" className="relative py-40 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-radial from-teal-500/5 to-transparent opacity-50" />
        
        <motion.div 
          className="relative max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-sm mb-8">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-medium text-rose-300 tracking-wide">The Anatomy of a Cancellation</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              How patients slip<br />
              <span className="text-white/30">through the cracks.</span>
            </h2>
          </motion.div>

          {/* Vertical Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-8 sm:left-12 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-500/60 via-rose-500/60 to-slate-500/40" />
            
            <div className="space-y-12">
              {[
                {
                  phase: "Phase 1",
                  title: "The Anxiety Block",
                  timing: "Weeks Prior",
                  description: "Patients in high-stress consultations process the 'what' (diagnosis) but block out the 'how' (preparation). Information retention is near zero.",
                  color: "amber",
                  icon: Brain,
                },
                {
                  phase: "Phase 2",
                  title: "The Literacy Gap",
                  timing: "The Leaflet",
                  description: "NHS leaflets require a reading age of 12-14. The UK average is 9. Terms like 'Low-Residue Diet' are meaningless to 43% of the population.",
                  color: "amber",
                  icon: FileX,
                },
                {
                  phase: "Phase 3",
                  title: "Rationalization",
                  timing: "At Home",
                  description: "Without coaching, patients rationalize non-compliance. 'Surely one cigarette won't matter.' 'I'll just stop my meds tomorrow instead.'",
                  color: "rose",
                  icon: AlertCircle,
                },
                {
                  phase: "Phase 4",
                  title: "The Result",
                  timing: "Admission Day",
                  description: "Failures are discovered on admission day. The slot is a 100% financial loss. The patient is rescheduled. The cycle repeats.",
                  color: "rose",
                  icon: XCircle,
                  danger: true,
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.phase}
                  variants={fadeInUp}
                  className="relative pl-20 sm:pl-28"
                >
                  {/* Timeline node */}
                  <div className={`absolute left-4 sm:left-8 w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                    item.color === 'amber' ? 'bg-amber-500/20 border-amber-400' :
                    'bg-rose-500/20 border-rose-400'
                  } ${item.danger ? 'ring-4 ring-rose-500/20' : ''}`}>
                    <item.icon className={`h-4 w-4 ${
                      item.color === 'amber' ? 'text-amber-400' : 'text-rose-400'
                    }`} />
                    {item.danger && (
                      <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-40" />
                    )}
                  </div>
                  
                  {/* Content card */}
                  <motion.div 
                    whileHover={{ x: 8, transition: { duration: 0.3 } }}
                    className={`relative p-6 rounded-2xl overflow-hidden cursor-default ${
                      item.danger ? 'ring-1 ring-rose-500/30' : ''
                    }`}
                  >
                    <div className={`absolute inset-0 backdrop-blur-sm border rounded-2xl ${
                      item.color === 'amber' ? 'bg-amber-500/[0.05] border-amber-500/10' :
                      'bg-rose-500/[0.08] border-rose-500/15'
                    }`} />
                    {item.danger && <div className="absolute inset-0 bg-rose-500/5 rounded-2xl" />}
                    
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs font-bold tracking-widest ${
                          item.color === 'amber' ? 'text-amber-400' : 'text-rose-400'
                        }`}>{item.phase}</span>
                        <span className="text-xs text-white/30">|</span>
                        <span className="text-xs text-white/40">{item.timing}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white/90 mb-3">{item.title}</h3>
                      <p className="text-white/50 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* THE RED FLAG ENGINE - Feature Split */}
      {/* ============================================ */}
      <section id="solution" className="relative py-40 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gradient-radial from-teal-500/10 to-transparent opacity-50" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gradient-radial from-emerald-500/10 to-transparent opacity-40" />
        
        <motion.div 
          className="relative max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-sm mb-8">
              <Shield className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-medium text-teal-300/90 tracking-wide">The Red Flag Engine</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold text-white/90 tracking-tight">
              The 72-Hour Refill Window
            </h2>
            <p className="mt-6 text-lg text-white/40 max-w-2xl mx-auto">
              Early detection means early intervention—or early cancellation with time to refill.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Steps */}
            <motion.div variants={fadeInUp} className="space-y-8">
              {[
                {
                  step: "1",
                  title: "The Trigger",
                  description: "Patient marks 'No' to a critical step (e.g., 'Did you stop Warfarin?') at T-Minus 7 days.",
                  icon: Target,
                  color: "amber"
                },
                {
                  step: "2",
                  title: "The Alert",
                  description: "Dashboard turns RED. Nurse is notified immediately via push notification and SMS.",
                  icon: Bell,
                  color: "rose"
                },
                {
                  step: "3",
                  title: "The Save",
                  description: "Scenario A: Correction — nurse explains the rule. Scenario B: Early cancellation — slot cancelled 72 hours out, allowing a standby patient to be prepped.",
                  icon: CheckCircle2,
                  color: "emerald"
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  whileHover={{ x: 8, transition: { duration: 0.3 } }}
                  className="flex items-start gap-5 group"
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${
                    item.color === 'amber' ? 'bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20' :
                    item.color === 'rose' ? 'bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500/20' :
                    'bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20'
                  }`}>
                    <item.icon className={`h-6 w-6 ${
                      item.color === 'amber' ? 'text-amber-400' :
                      item.color === 'rose' ? 'text-rose-400' :
                      'text-emerald-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        item.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                        item.color === 'rose' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>Step {item.step}</span>
                      <h3 className="text-lg font-bold text-white/90">{item.title}</h3>
                    </div>
                    <p className="text-white/50 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right side - Traffic Light Visualization */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4, transition: { duration: 0.4 } }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-2xl border border-white/[0.1] rounded-3xl" />
              
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white/90">Traffic Light System</p>
                      <p className="text-xs text-white/40">Patient readiness at a glance</p>
                    </div>
                  </div>
                </div>

                {/* Traffic light cards */}
                <div className="space-y-3">
                  {[
                    { status: "Ready to Go", count: 24, color: "emerald", icon: CheckCircle2, desc: "All confirmations received" },
                    { status: "Awaiting Response", count: 8, color: "amber", icon: Clock, desc: "Pending patient confirmation" },
                    { status: "At Risk", count: 3, color: "rose", icon: AlertTriangle, desc: "Requires immediate intervention", glow: true },
                  ].map((item) => (
                    <motion.div
                      key={item.status}
                      whileHover={{ x: 4, scale: 1.01, transition: { duration: 0.3 } }}
                      className={`relative p-5 rounded-2xl overflow-hidden ${
                        item.glow ? 'ring-1 ring-rose-500/30' : ''
                      }`}
                    >
                      <div className={`absolute inset-0 backdrop-blur-sm border rounded-2xl ${
                        item.color === 'emerald' ? 'bg-emerald-500/[0.08] border-emerald-500/20' :
                        item.color === 'amber' ? 'bg-amber-500/[0.08] border-amber-500/20' :
                        'bg-rose-500/[0.1] border-rose-500/20'
                      }`} />
                      
                      {item.glow && (
                        <motion.div 
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -inset-px bg-gradient-to-r from-rose-500/20 to-transparent rounded-2xl" 
                        />
                      )}
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                            item.color === 'emerald' ? 'bg-emerald-500/20' :
                            item.color === 'amber' ? 'bg-amber-500/20' :
                            'bg-rose-500/20'
                          }`}>
                            <item.icon className={`h-5 w-5 ${
                              item.color === 'emerald' ? 'text-emerald-400' :
                              item.color === 'amber' ? 'text-amber-400' :
                              'text-rose-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-semibold text-white/90">{item.status}</p>
                            <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <p className={`text-4xl font-bold font-mono ${
                          item.color === 'emerald' ? 'text-emerald-300' :
                          item.color === 'amber' ? 'text-amber-300' :
                          'text-rose-300'
                        }`}>{item.count}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* CLINICAL INTELLIGENCE - Horizontal Tabs */}
      {/* ============================================ */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/[0.03] to-transparent" />
        
        <motion.div 
          className="relative max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8">
              <Syringe className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300/90 tracking-wide">Clinical Intelligence</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white/90 tracking-tight">
              Protocol-driven guidance
            </h2>
            <p className="mt-6 text-lg text-white/40 max-w-2xl mx-auto">
              Every message is clinically validated and procedure-specific.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={fadeIn} className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
              {clinicalTabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === idx 
                      ? 'bg-white/10 text-white border border-white/10' 
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
        </div>
          </motion.div>

          {/* Tab content */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-2xl border border-white/[0.1] rounded-3xl" />
            
            <div className="relative p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row sm:items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 border border-indigo-500/20 flex items-center justify-center">
                  {(() => {
                    const TabIcon = clinicalTabs[activeTab].icon;
                    return <TabIcon className="h-8 w-8 text-indigo-400" />;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-white/90">{clinicalTabs[activeTab].content.title}</h3>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
                      {clinicalTabs[activeTab].content.highlight}
                    </span>
                  </div>
                  <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
                    {clinicalTabs[activeTab].content.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* NHS CRISIS - The Hidden Cost */}
      {/* ============================================ */}
      <section id="costs" className="relative py-40 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-radial from-emerald-500/5 to-transparent opacity-50" />
        
        <motion.div 
          className="relative max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-sm mb-8">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-medium text-rose-300/90 tracking-wide">The NHS Crisis</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold text-white/90 tracking-tight">
              The hidden cost of<br />
              <span className="text-rose-300">missed appointments</span>
            </h2>
            <p className="mt-6 text-lg text-white/40 max-w-2xl mx-auto">
              Every empty slot isn&apos;t just wasted money—it&apos;s a stolen opportunity for a patient in pain.
            </p>
          </motion.div>

          {/* Data Cards Grid */}
          <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-6">
            {[
              {
                headline: "Annual Loss to DNAs",
                stat: "£1B+",
                detail: "The NHS loses over £1 billion annually to missed appointments (DNAs) and last-minute cancellations.",
                color: "rose",
                icon: DollarSign
              },
              {
                headline: "Patients Waiting",
                stat: "7.6M",
                detail: "With the NHS waiting list at roughly 7.6 million, every wasted slot is not just lost money — it's a stolen opportunity for a patient in pain.",
                color: "amber",
                icon: Users
              },
              {
                headline: "Theatre Running Cost",
                stat: "£20/min",
                detail: "An NHS Operating Theatre costs approximately £1,200 per hour (or £20 per minute) to run. When a patient cancels late, this money burns regardless of whether the table is empty.",
                color: "violet",
                icon: Clock
              },
              {
                headline: "Theatre Utilisation",
                stat: "71.5%",
                detail: "Mean monthly Operating Theatre utilisation sits at only 71.5%—a huge efficiency gap representing millions in lost capacity. Source: NNUH data.",
                color: "blue",
                icon: TrendingUp
              },
            ].map((card) => (
              <motion.div
                key={card.headline}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.4 } }}
                className="relative rounded-3xl overflow-hidden group"
              >
                <div className={`absolute inset-0 backdrop-blur-xl border rounded-3xl transition-colors duration-500 ${
                  card.color === 'blue' ? 'bg-blue-500/[0.06] border-blue-500/10 group-hover:border-blue-500/30' :
                  card.color === 'amber' ? 'bg-amber-500/[0.06] border-amber-500/10 group-hover:border-amber-500/30' :
                  card.color === 'rose' ? 'bg-rose-500/[0.06] border-rose-500/10 group-hover:border-rose-500/30' :
                  'bg-violet-500/[0.06] border-violet-500/10 group-hover:border-violet-500/30'
                }`} />
                
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">{card.headline}</p>
                      <p className={`text-5xl sm:text-6xl font-bold font-mono tracking-tight ${
                        card.color === 'blue' ? 'text-blue-300' :
                        card.color === 'amber' ? 'text-amber-300' :
                        card.color === 'rose' ? 'text-rose-300' :
                        'text-violet-300'
                      }`}>
                        {card.stat}
                      </p>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      card.color === 'blue' ? 'bg-blue-500/10 border border-blue-500/20' :
                      card.color === 'amber' ? 'bg-amber-500/10 border border-amber-500/20' :
                      card.color === 'rose' ? 'bg-rose-500/10 border border-rose-500/20' :
                      'bg-violet-500/10 border border-violet-500/20'
                    }`}>
                      <card.icon className={`h-7 w-7 ${
                        card.color === 'blue' ? 'text-blue-400' :
                        card.color === 'amber' ? 'text-amber-400' :
                        card.color === 'rose' ? 'text-rose-400' :
                        'text-violet-400'
                      }`} />
                    </div>
                  </div>
                  
                  <p className="text-base text-white/50 leading-relaxed">{card.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* EQUITY & ACCESSIBILITY - 3 Column Icons */}
      {/* ============================================ */}
      <section className="relative py-40 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent" />
        
        <motion.div 
          className="relative max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-8">
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300/90 tracking-wide">Equity & Accessibility</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white/90 tracking-tight">
              Reaching every patient
            </h2>
            <p className="mt-6 text-lg text-white/40 max-w-2xl mx-auto">
              Not everyone reads leaflets. LinkCare meets patients where they are.
            </p>
          </motion.div>

          {/* 3 Column Grid */}
          <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: "Audio-First",
                description: "WhatsApp-style voice notes for patients with low literacy or visual impairments. Instructions they can actually understand.",
                color: "teal"
              },
              {
                icon: Globe,
                title: "Multi-lingual",
                description: "Support for Urdu, Punjabi, Polish, Bengali and more. Prevents 'Chinese Whispers' translation errors by family members.",
                color: "indigo"
              },
              {
                icon: PhoneCall,
                title: "Non-Smartphone Fallback",
                description: "Automated phone calls for the digitally excluded (85+ demographic). No one is left behind.",
                color: "violet"
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.4 } }}
                className="relative rounded-3xl overflow-hidden group text-center"
              >
                <div className={`absolute inset-0 backdrop-blur-xl border rounded-3xl transition-colors duration-500 ${
                  item.color === 'teal' ? 'bg-teal-500/[0.04] border-teal-500/10 group-hover:border-teal-500/30' :
                  item.color === 'indigo' ? 'bg-indigo-500/[0.04] border-indigo-500/10 group-hover:border-indigo-500/30' :
                  'bg-violet-500/[0.04] border-violet-500/10 group-hover:border-violet-500/30'
                }`} />
                
                <div className="relative p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                    item.color === 'teal' ? 'bg-teal-500/10 border border-teal-500/20' :
                    item.color === 'indigo' ? 'bg-indigo-500/10 border border-indigo-500/20' :
                    'bg-violet-500/10 border border-violet-500/20'
                  }`}>
                    <item.icon className={`h-8 w-8 ${
                      item.color === 'teal' ? 'text-teal-400' :
                      item.color === 'indigo' ? 'text-indigo-400' :
                      'text-violet-400'
                    }`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white/90 mb-3">{item.title}</h3>
                  <p className="text-white/40 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA */}
      {/* ============================================ */}
      <section className="relative py-48 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-500 to-cyan-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/20 rounded-full blur-[180px]" 
        />
        
        <motion.div 
          className="relative max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
            See it in action.
          </motion.h2>
          <motion.p variants={fadeIn} className="mt-6 text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
            Explore the interactive demo—patient scheduling, SMS confirmation, and the hospital dashboard.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="mt-14">
            <Link href="/demo/dashboard">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-[#0a0a0f] text-lg font-semibold hover:bg-white/90 transition-all duration-300 shadow-2xl shadow-teal-900/30 hover:shadow-teal-900/40 hover:scale-[1.02]">
                Launch Demo
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="relative py-10 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Stethoscope className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white/50">LinkCare</span>
          </div>
          <p className="text-xs text-white/25">2026 LinkCare. The 72-Hour Safety Net for NHS Waiting Lists.</p>
          <div className="flex items-center gap-2 text-xs text-white/25">
            <Heart className="h-3.5 w-3.5 text-rose-400/40" />
            Built for the NHS
          </div>
        </div>
      </footer>
    </div>
  );
}
