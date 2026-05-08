import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "About — Deadraon" };

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
    <div className="pt-24">
      {/* Hero */}
      <section className="section-padding pb-0">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">About Me</span>
            <h1 className="text-5xl lg:text-6xl font-black mt-2 mb-6">
              The Developer <br /><span className="gradient-text">Behind the Code</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              I&apos;m <strong className="text-foreground">Deadraon</strong>, a passionate Full Stack Developer with 4+ years of experience crafting digital products that combine elegant design with robust engineering.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              From enterprise SaaS dashboards to consumer mobile apps, I bring a product-minded approach to every project. My goal is always the same — deliver work that drives real business results and delights users at every interaction.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="gradient" size="lg">
                <Link href="/contact"><ArrowRight className="w-4 h-4" /> Hire Me</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/resume.pdf" download><Download className="w-4 h-4" /> Download CV</a>
              </Button>
            </div>
          </div>

          {/* Photo placeholder with stats */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-5xl font-black mx-auto mb-4">D</div>
                  <p className="text-2xl font-bold">Deadraon</p>
                  <p className="text-primary font-medium">Full Stack Developer</p>
                </div>
              </div>
            </div>
            {/* Floating stat cards */}
            <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl p-4 shadow-xl">
              <p className="text-3xl font-black gradient-text">50+</p>
              <p className="text-xs text-muted-foreground">Projects Done</p>
            </div>
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl p-4 shadow-xl">
              <p className="text-3xl font-black gradient-text">4+</p>
              <p className="text-xs text-muted-foreground">Years Exp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Experience</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />
            <div className="space-y-8">
              {experience.map((exp, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full border-2 border-primary bg-card" />
                  <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{exp.year}</span>
                      <h3 className="font-semibold">{exp.role}</h3>
                      <span className="text-muted-foreground text-sm">@ {exp.company}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work Process */}
      <section className="section-padding bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">My Work <span className="gradient-text">Process</span></h2>
            <p className="text-muted-foreground">How I turn your ideas into polished digital products.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workProcess.map((step) => (
              <div key={step.step} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all card-hover group">
                <span className="text-5xl font-black gradient-text opacity-30 group-hover:opacity-50 transition-opacity">{step.step}</span>
                <h3 className="font-semibold text-lg mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
