"use client";

import { useState } from "react";

interface Experience {
  id: string;
  company: string;
  role: string;
  date: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  date: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  tech: string;
  link: string;
  description: string;
}

interface SkillGroup {
  id: string;
  category: string;
  list: string;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
}

const INITIAL_DATA: ResumeData = {
  name: "Alex Morgan",
  title: "Senior Frontend Engineer",
  email: "alex.morgan@email.com",
  phone: "+1 (555) 019-2834",
  website: "github.com/alexm",
  location: "San Francisco, CA",
  summary: "Product-focused frontend engineer with 6+ years of experience building accessible, high-performance web applications. Specialized in React, Next.js, and modern CSS architectures.",
  experience: [
    {
      id: "exp-1",
      company: "Vortex Labs",
      role: "Lead Developer",
      date: "2023 - Present",
      description: "Architected a Next.js design system reducing bundle size by 40%.\nMentored 5 junior developers and established automated accessibility testing.\nLed migration of legacy dashboard to React Server Components.",
    },
    {
      id: "exp-2",
      company: "Acme Corp",
      role: "Frontend Developer",
      date: "2020 - 2023",
      description: "Built and maintained core SaaS checkout flow generating $12M+ ARR.\nOptimized page load speed by 1.2s, achieving Core Web Vitals targets.",
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      date: "2016 - 2020",
      description: "Graduated with Honors. Coursework in UI/UX Design and Distributed Systems.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "UI Components Library",
      tech: "React, Tailwind, Radix",
      link: "github.com/alexm/ui-core",
      description: "A lightweight, fully accessible component library with 10k+ weekly npm downloads.",
    },
  ],
  skills: [
    {
      id: "skill-1",
      category: "Languages",
      list: "JavaScript, TypeScript, HTML/CSS, SQL",
    },
    {
      id: "skill-2",
      category: "Frameworks",
      list: "React, Next.js, Vue, Tailwind CSS",
    },
    {
      id: "skill-3",
      category: "Tools & Libraries",
      list: "Git, Webpack, Vitest, Playwright, Figma",
    },
  ],
};

type TemplateType = "minimal" | "modern" | "classic";

export function ResumeBuilderTool() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [template, setTemplate] = useState<TemplateType>("minimal");
  const [activeTab, setActiveTab] = useState<"basics" | "experience" | "education" | "projects" | "skills">("basics");

  const updateField = (field: keyof ResumeData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  // List Management Helpers
  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: `exp-${Date.now()}`, company: "", role: "", date: "", description: "" },
      ],
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: `edu-${Date.now()}`, school: "", degree: "", date: "", description: "" },
      ],
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  const addProject = () => {
    setData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: `proj-${Date.now()}`, name: "", tech: "", link: "", description: "" },
      ],
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  };

  const addSkillGroup = () => {
    setData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: `skill-${Date.now()}`, category: "", list: "" },
      ],
    }));
  };

  const updateSkillGroup = (id: string, field: keyof SkillGroup, value: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeSkillGroup = (id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item.id !== id),
    }));
  };

  // Typography variables depending on template selection
  const getTemplateFonts = () => {
    switch (template) {
      case "classic":
        return {
          title: "font-serif text-3xl font-bold tracking-tight",
          subtitle: "font-serif text-sm tracking-wider uppercase",
          h2: "font-serif text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mt-5 mb-3",
          body: "font-serif text-xs leading-relaxed text-gray-800",
          nameHeader: "text-center border-b border-gray-400 pb-3 mb-4",
          contactRow: "flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-serif text-gray-600 mt-2",
        };
      case "modern":
        return {
          title: "font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-indigo-900",
          subtitle: "font-[family-name:var(--font-mono)] text-xs uppercase text-indigo-600 font-semibold tracking-wider",
          h2: "font-[family-name:var(--font-display)] text-md font-bold uppercase tracking-widest text-indigo-900 border-l-4 border-indigo-600 pl-2 mt-6 mb-3",
          body: "font-[family-name:var(--font-body)] text-xs leading-relaxed text-slate-700",
          nameHeader: "flex justify-between items-baseline border-b border-slate-200 pb-4 mb-4",
          contactRow: "flex flex-col items-end text-right text-[11px] font-[family-name:var(--font-mono)] text-slate-500",
        };
      default: // minimal
        return {
          title: "font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-gray-900",
          subtitle: "font-[family-name:var(--font-body)] text-xs text-gray-500 font-medium",
          h2: "font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mt-5 mb-2.5",
          body: "font-[family-name:var(--font-body)] text-[11px] leading-relaxed text-gray-700",
          nameHeader: "mb-4",
          contactRow: "flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-[family-name:var(--font-mono)] text-gray-500 mt-1.5",
        };
    }
  };

  const styles = getTemplateFonts();

  const inputClass =
    "w-full rounded-xl border border-border bg-ink/5 text-ink px-3 py-2 text-sm focus:border-indigo-500/50 outline-none transition-all";
  const labelClass = "block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5";
  const btnClass =
    "px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-ink/5 text-ink-soft hover:text-ink hover:border-border-hover transition-all";
  const removeBtnClass =
    "text-xs px-2 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all";

  return (
    <div className="space-y-6">
      {/* Styles for printing only the resume preview container */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-area, #print-area * {
            visibility: visible !important;
          }
          #print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
        }
      `}</style>

      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 no-print">
        <div className="flex gap-2">
          {(["minimal", "modern", "classic"] as TemplateType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                template === t
                  ? "bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20"
                  : "bg-ink/5 border-border text-ink-soft hover:text-ink hover:border-border-hover"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={handlePrint}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          Download PDF
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Editor (Left Column) */}
        <div className="lg:col-span-5 space-y-5 no-print editor-container">
          {/* Form navigation tabs */}
          <div className="flex border-b border-border text-xs overflow-x-auto whitespace-nowrap">
            {(["basics", "experience", "education", "projects", "skills"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-3 border-b-2 font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-ink-faint hover:text-ink-soft"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Basics Form */}
          {activeTab === "basics" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Personal Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    value={data.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Alex Morgan"
                  />
                </div>
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input
                    value={data.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    value={data.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={inputClass}
                    placeholder="alex@email.com"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    value={data.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={inputClass}
                    placeholder="+1 (555) 012-3456"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Website/Portfolio</label>
                  <input
                    value={data.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    className={inputClass}
                    placeholder="github.com/username"
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    value={data.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className={inputClass}
                    placeholder="City, ST"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Professional Summary</label>
                <textarea
                  value={data.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  className={`${inputClass} min-h-[100px] resize-y`}
                  placeholder="Summarize your professional background..."
                />
              </div>
            </div>
          )}

          {/* Work Experience Form */}
          {activeTab === "experience" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Work Experience</h3>
                <button onClick={addExperience} className={btnClass}>
                  + Add Position
                </button>
              </div>

              {data.experience.length === 0 && (
                <p className="text-xs text-[var(--color-ink-soft)] italic">No experience entries added.</p>
              )}

              {data.experience.map((exp) => (
                <div key={exp.id} className="p-3 border border-[var(--color-rule)] rounded-xl bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-[family-name:var(--font-mono)] text-[var(--color-ink-soft)]">Position</span>
                    <button onClick={() => removeExperience(exp.id)} className={removeBtnClass}>
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Company</label>
                      <input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Role</label>
                      <input
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Dates</label>
                    <input
                      value={exp.date}
                      onChange={(e) => updateExperience(exp.id, "date", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 2021 - 2023"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description (one bullet per line)</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      className={`${inputClass} min-h-[80px]`}
                      placeholder="Led deployment of major product features..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education Form */}
          {activeTab === "education" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Education</h3>
                <button onClick={addEducation} className={btnClass}>
                  + Add Education
                </button>
              </div>

              {data.education.length === 0 && (
                <p className="text-xs text-[var(--color-ink-soft)] italic">No education entries added.</p>
              )}

              {data.education.map((edu) => (
                <div key={edu.id} className="p-3 border border-[var(--color-rule)] rounded-xl bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-[family-name:var(--font-mono)] text-[var(--color-ink-soft)]">Education</span>
                    <button onClick={() => removeEducation(edu.id)} className={removeBtnClass}>
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>School</label>
                      <input
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Degree</label>
                      <input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Dates</label>
                    <input
                      value={edu.date}
                      onChange={(e) => updateEducation(edu.id, "date", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 2016 - 2020"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description / Honors</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                      className={`${inputClass} min-h-[60px]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects Form */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Projects</h3>
                <button onClick={addProject} className={btnClass}>
                  + Add Project
                </button>
              </div>

              {data.projects.length === 0 && (
                <p className="text-xs text-[var(--color-ink-soft)] italic">No project entries added.</p>
              )}

              {data.projects.map((proj) => (
                <div key={proj.id} className="p-3 border border-[var(--color-rule)] rounded-xl bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-[family-name:var(--font-mono)] text-[var(--color-ink-soft)]">Project</span>
                    <button onClick={() => removeProject(proj.id)} className={removeBtnClass}>
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Project Name</label>
                      <input
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Technologies</label>
                      <input
                        value={proj.tech}
                        onChange={(e) => updateProject(proj.id, "tech", e.target.value)}
                        className={inputClass}
                        placeholder="e.g. React, Node.js"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Link / URL</label>
                    <input
                      value={proj.link}
                      onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                      className={inputClass}
                      placeholder="github.com/..."
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                      className={`${inputClass} min-h-[60px]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Form */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Skills</h3>
                <button onClick={addSkillGroup} className={btnClass}>
                  + Add Category
                </button>
              </div>

              {data.skills.length === 0 && (
                <p className="text-xs text-[var(--color-ink-soft)] italic">No skill categories added.</p>
              )}

              {data.skills.map((skill) => (
                <div key={skill.id} className="p-3 border border-[var(--color-rule)] rounded-xl bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-[family-name:var(--font-mono)] text-[var(--color-ink-soft)]">Skill Category</span>
                    <button onClick={() => removeSkillGroup(skill.id)} className={removeBtnClass}>
                      Remove
                    </button>
                  </div>
                  <div>
                    <label className={labelClass}>Category Name</label>
                    <input
                      value={skill.category}
                      onChange={(e) => updateSkillGroup(skill.id, "category", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Languages"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Skills (comma separated)</label>
                    <input
                      value={skill.list}
                      onChange={(e) => updateSkillGroup(skill.id, "list", e.target.value)}
                      className={inputClass}
                      placeholder="TypeScript, React, CSS"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resume Preview Sheet (Right Column) */}
        <div className="lg:col-span-7 flex justify-center">
          {/* Print container wrapping A4 sized preview */}
          <div
            id="print-area"
            className="w-full max-w-[210mm] min-h-[297mm] bg-white border border-gray-200 shadow-md p-[15mm] flex flex-col justify-between"
          >
            <div id="resume-preview-sheet" className="space-y-4">
              {/* Header */}
              <div className={styles.nameHeader}>
                {template === "modern" ? (
                  <>
                    <div>
                      <h2 className={styles.title}>{data.name || "Your Name"}</h2>
                      <p className={styles.subtitle}>{data.title || "Your Profession"}</p>
                    </div>
                    <div className={styles.contactRow}>
                      {data.email && <div>{data.email}</div>}
                      {data.phone && <div>{data.phone}</div>}
                      {data.location && <div>{data.location}</div>}
                      {data.website && <div className="text-indigo-600 font-semibold">{data.website}</div>}
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className={styles.title}>{data.name || "Your Name"}</h2>
                    <p className={styles.subtitle}>{data.title || "Your Profession"}</p>
                    <div className={styles.contactRow}>
                      {data.email && <span>{data.email}</span>}
                      {data.phone && <span>{data.phone}</span>}
                      {data.location && <span>{data.location}</span>}
                      {data.website && <span>{data.website}</span>}
                    </div>
                  </>
                )}
              </div>

              {/* Summary */}
              {data.summary && (
                <div>
                  <h3 className={styles.h2}>Profile Summary</h3>
                  <p className={styles.body}>{data.summary}</p>
                </div>
              )}

              {/* Experience Section */}
              {data.experience.length > 0 && (
                <div>
                  <h3 className={styles.h2}>Professional Experience</h3>
                  <div className="space-y-3">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline font-medium text-xs text-gray-900">
                          <div>
                            <span className="font-semibold text-gray-950">{exp.role || "Role"}</span>
                            {exp.company && <span className="text-gray-500 font-normal"> · {exp.company}</span>}
                          </div>
                          {exp.date && (
                            <span className="font-[family-name:var(--font-mono)] text-[10px] text-gray-500">
                              {exp.date}
                            </span>
                          )}
                        </div>
                        {exp.description && (
                          <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
                            {exp.description.split("\n").filter(Boolean).map((bullet, idx) => (
                              <li key={idx} className={styles.body}>
                                {bullet.replace(/^-\s*/, "")}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {data.projects.length > 0 && (
                <div>
                  <h3 className={styles.h2}>Key Projects</h3>
                  <div className="space-y-2.5">
                    {data.projects.map((proj) => (
                      <div key={proj.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline font-medium text-xs text-gray-900">
                          <div>
                            <span className="font-semibold text-gray-950">{proj.name || "Project Name"}</span>
                            {proj.tech && (
                              <span className="text-gray-500 font-[family-name:var(--font-mono)] text-[10px] ml-1">
                                [{proj.tech}]
                              </span>
                            )}
                          </div>
                          {proj.link && (
                            <span className="font-[family-name:var(--font-mono)] text-[10px] text-indigo-600">
                              {proj.link}
                            </span>
                          )}
                        </div>
                        {proj.description && <p className={styles.body}>{proj.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {data.education.length > 0 && (
                <div>
                  <h3 className={styles.h2}>Education</h3>
                  <div className="space-y-2.5">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline font-medium text-xs text-gray-900">
                          <div>
                            <span className="font-semibold text-gray-950">{edu.school || "School"}</span>
                            {edu.degree && <span className="text-gray-500 font-normal"> — {edu.degree}</span>}
                          </div>
                          {edu.date && (
                            <span className="font-[family-name:var(--font-mono)] text-[10px] text-gray-500">
                              {edu.date}
                            </span>
                          )}
                        </div>
                        {edu.description && <p className={styles.body}>{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {data.skills.length > 0 && (
                <div>
                  <h3 className={styles.h2}>Skills & Expertise</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {data.skills.map((skill) => (
                      <div key={skill.id} className="flex gap-1 text-xs">
                        <span className="font-medium text-gray-900 min-w-[80px] shrink-0">
                          {skill.category || "Category"}:
                        </span>
                        <span className={styles.body}>{skill.list || "Skills..."}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Subtle local watermark for branding/attribution */}
            <div className="text-[9px] font-[family-name:var(--font-mono)] text-gray-400 mt-8 text-center pt-2 border-t border-gray-100 flex justify-between items-center">
              <span>Processed locally. No uploads.</span>
              <span>Generated via ToolHub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
