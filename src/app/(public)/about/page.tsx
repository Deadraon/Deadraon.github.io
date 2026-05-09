import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight, Code2, Zap } from "lucide-react";
import { GithubButton } from "@/components/ui/github-button";
import { ResumeRequestModal } from "@/components/sections/resume-request-modal";


export const metadata: Metadata = { title: "About — Kunal Chauhan" };

const experience = [
  { year: "2024 – Present", role: "Senior Full Stack Developer", company: "Freelance", desc: "Building premium web and mobile applications for clients globally. Specializing in Next.js, Flutter, and scalable backend systems." },
  { year: "2022 – 2024", role: "Full Stack Developer", company: "TechCorp Solutions", desc: "Led development of SaaS products, e-commerce platforms, and internal dashboards. Managed a team of 3 junior developers." },
  { year: "2020 – 2022", role: "Frontend Developer", company: "Digital Ventures", desc: "Built responsive web applications using React and TypeScript. Improved app performance by 60% through optimization techniques." },
  { year: "2019 – 2020", role: "Junior Web Developer", company: "StartupHub", desc: "Started professional career building websites and web apps. Learned full-stack fundamentals and agile methodology." },
];

const workProcess = [
  { step: "01", title: "Discovery", desc: "Understanding your goals, requirements, and vision through in-depth consultation." },
  { step: "02", title: "Planning", desc: "Creating a detailed roadmap, architecture plan, and timeline for the project." },
  { step: "03", title: "Design", desc: "Crafting beautiful, user-centric designs aligned with your brand identity." },
  { step: "04", title: "Development", desc: "Building clean, performant code with regular updates and progress reports." },
  { step: "05", title: "Testing", desc: "Rigorous QA testing across devices and browsers before deployment." },
  { step: "06", title: "Delivery", desc: "Deploying to production and providing full handover documentation and support." },
];

export default function AboutPage() {
  return (
    <div className="pt-14 relative overflow-hidden">
      {/* SaaS AI Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0070F3]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#8A2BE2]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero */}
      <section className="section-padding pb-0 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[#0070F3] text-sm font-medium mb-6">
              <Code2 className="w-4 h-4" /> About Me
            </span>
            <h1 className="text-5xl lg:text-6xl font-black mb-6">
              The Developer <br /><span className="gradient-text">Behind the Code</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              I&apos;m <strong className="text-white font-medium">Kunal Chauhan</strong>, also known as <strong className="text-white font-medium">MOB</strong>. I am a passionate Full Stack Developer with 2+ years of experience crafting digital products that combine elegant design with robust engineering.
            </p>
            <p className="text-white/50 leading-relaxed mb-8">
              From enterprise SaaS dashboards to consumer mobile apps, I bring a product-minded approach to every project. My goal is always the same — deliver work that drives real business results and delights users at every interaction.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-white/90 font-medium">
                <Link href="/contact"><Zap className="w-4 h-4 mr-2 text-[#0070F3]" /> Hire Me</Link>
              </Button>
              <ResumeRequestModal>
                <Button variant="outline" size="lg" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10">
                  <Download className="w-4 h-4 mr-2" /> Request CV
                </Button>
              </ResumeRequestModal>
              <GithubButton />
            </div>
          </div>

          {/* Photo placeholder with stats */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative w-full aspect-square max-w-md mx-auto glass-dark rounded-[2.5rem] p-1 shadow-[0_0_50px_rgba(0,112,243,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0070F3]/5 to-[#8A2BE2]/5 rounded-[2.5rem] pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center relative z-10">
                  <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,112,243,0.4)] overflow-hidden bg-black/50 border border-white/10">
                    <Image src="/logo.png" alt="Profile Logo" width={128} height={128} className="object-cover" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">Kunal Chauhan</p>
                  <p className="text-[#0070F3] font-medium tracking-wide mb-1">@Deadraon</p>
                  <p className="text-white/40 text-sm">Full Stack Developer</p>
                </div>
              </div>
            </div>
            {/* Floating stat cards */}
            <div className="absolute -bottom-6 -left-6 glass border-white/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-float">
              <p className="text-4xl font-black gradient-text mb-1">50+</p>
              <p className="text-sm text-white/50 font-medium">Projects Done</p>
            </div>
            <div className="absolute -top-6 -right-6 glass border-white/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-float" style={{ animationDelay: "1.5s" }}>
              <p className="text-4xl font-black gradient-text mb-1">2+</p>
              <p className="text-sm text-white/50 font-medium">Years Exp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="section-padding relative z-10 mt-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Experience</h2>
          <div className="relative">
            <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#0070F3] via-[#8A2BE2] to-transparent rounded-full opacity-50" />
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i} className="relative pl-16 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="absolute left-[1.1rem] top-6 w-4 h-4 rounded-full border-4 border-[#030308] bg-[#0070F3] shadow-[0_0_15px_rgba(0,112,243,0.6)]" />
                  <div className="p-8 rounded-3xl glass-dark hover:border-white/20 transition-colors group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-white mb-1 group-hover:text-[#0070F3] transition-colors">{exp.role}</h3>
                        <span className="text-white/50 font-medium">{exp.company}</span>
                      </div>
                      <span className="text-sm font-mono text-[#8A2BE2] bg-[#8A2BE2]/10 px-3 py-1.5 rounded-full whitespace-nowrap self-start sm:self-auto border border-[#8A2BE2]/20">{exp.year}</span>
                    </div>
                    <p className="text-white/60 leading-relaxed">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work Process */}
      <section className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">My Work <span className="gradient-text">Process</span></h2>
            <p className="text-white/50 text-lg">How I turn your ideas into polished digital products.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workProcess.map((step, i) => (
              <div key={step.step} className="p-8 rounded-3xl glass-dark card-hover group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="text-6xl font-black text-white/5 group-hover:text-[#0070F3]/20 transition-colors block mb-4">{step.step}</span>
                <h3 className="font-bold text-xl text-white mb-3 group-hover:text-[#0070F3] transition-colors">{step.title}</h3>
                <p className="text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
