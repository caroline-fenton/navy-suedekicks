import { useState, useEffect, useRef } from "react";

const SECTIONS = ["about", "experience", "case-studies", "projects", "contact"];

// Password gate component for case studies
function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    // Simple client-side gate — replace with real auth for production
    if (pw.toLowerCase() === "discover") {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      maxWidth: 440,
      margin: "80px auto",
      padding: "48px 32px",
      textAlign: "center",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        border: "2px solid var(--ink)", display: "flex",
        alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px",
        fontSize: 20,
      }}>🔒</div>
      <h3 style={{
        fontFamily: "var(--display)", fontSize: 20,
        fontWeight: 500, marginBottom: 8,
      }}>Protected Content</h3>
      <p style={{
        fontFamily: "var(--body)", fontSize: 14,
        color: "var(--muted)", lineHeight: 1.6, marginBottom: 32,
      }}>
        These case studies contain proprietary work. Enter the password I've shared with you to view them.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter password"
          style={{
            flex: 1, padding: "12px 16px",
            border: error ? "1.5px solid #c44" : "1.5px solid var(--border)",
            borderRadius: 6, fontFamily: "var(--body)",
            fontSize: 14, background: "var(--surface)",
            color: "var(--ink)", outline: "none",
            transition: "border-color 0.2s",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 24px", background: "var(--ink)",
            color: "var(--bg)", border: "none", borderRadius: 6,
            fontFamily: "var(--body)", fontSize: 14,
            cursor: "pointer", fontWeight: 500,
          }}
        >View</button>
      </div>
      {error && <p style={{
        fontFamily: "var(--body)", fontSize: 13,
        color: "#c44", marginTop: 12,
      }}>Incorrect password. Please try again.</p>}
    </div>
  );
}

// Fade-in wrapper
function FadeIn({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >{children}</div>
  );
}

// Project card
function ProjectCard({ title, tag, description, link, index, noBorder }) {
  const [hovered, setHovered] = useState(false);
  const Wrapper = link ? "a" : "div";
  return (
    <FadeIn delay={index * 0.1}>
      <Wrapper
        href={link || undefined}
        target={link ? "_blank" : undefined}
        rel={link ? "noopener noreferrer" : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
          padding: "28px 0",
          borderBottom: noBorder ? "none" : "1px solid var(--border)",
          cursor: "pointer",
          transition: "padding-left 0.3s ease",
          paddingLeft: hovered ? 12 : 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
          <h3 style={{
            fontFamily: "var(--display)", fontSize: 18,
            fontWeight: 500, color: "var(--ink)",
          }}>{title}</h3>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 11,
            color: "var(--accent)", letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>{tag}</span>
        </div>
        <p style={{
          fontFamily: "var(--body)", fontSize: 14,
          color: "var(--muted)", lineHeight: 1.6, maxWidth: 560,
        }}>{description}</p>
      </Wrapper>
    </FadeIn>
  );
}

// Experience entry
function ExperienceEntry({ role, company, period, bullets, index }) {
  return (
    <FadeIn delay={index * 0.1}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 32,
        padding: "32px 0",
        borderBottom: "1px solid var(--border)",
      }}>
        <div>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 12,
            color: "var(--muted)", letterSpacing: "0.03em",
          }}>{period}</span>
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--display)", fontSize: 17,
            fontWeight: 500, marginBottom: 4,
          }}>{role}</h3>
          <p style={{
            fontFamily: "var(--body)", fontSize: 14,
            color: "var(--accent)", marginBottom: 16,
          }}>{company}</p>
          {bullets.map((b, i) => (
            <p key={i} style={{
              fontFamily: "var(--body)", fontSize: 14,
              color: "var(--muted)", lineHeight: 1.65,
              marginBottom: 8, paddingLeft: 0,
            }}>— {b}</p>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [caseStudyUnlocked, setCaseStudyUnlocked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      for (const id of [...SECTIONS].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLabels = {
    "about": "About",
    "experience": "Experience",
    "case-studies": "Case Studies",
    "projects": "Projects",
    "contact": "Contact",
  };

  return (
    <div style={{
      "--bg": "#FAFAF8",
      "--surface": "#F2F1EE",
      "--ink": "#1A1A18",
      "--muted": "#6B6B65",
      "--accent": "#3D6B5E",
      "--border": "#E2E0DB",
      "--display": "'Sora', 'Helvetica Neue', sans-serif",
      "--body": "'DM Sans', 'Helvetica Neue', sans-serif",
      "--mono": "'JetBrains Mono', 'SF Mono', monospace",
      background: "var(--bg)",
      color: "var(--ink)",
      minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: #3D6B5E33; }
      `}</style>

      {/* Navigation */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 100, background: "rgba(250,250,248,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          padding: "0 32px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", height: 60,
        }}>
          <span
            onClick={() => scrollTo("about")}
            style={{
              fontFamily: "var(--mono)", fontSize: 12,
              fontWeight: 400, cursor: "pointer",
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: "var(--ink)",
            }}
          >Caroline Fenton</span>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                style={{
                  fontFamily: "var(--mono)", fontSize: 11,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  color: activeSection === s ? "var(--accent)" : "var(--muted)",
                  background: "none", border: "none", cursor: "pointer",
                  transition: "color 0.2s",
                  padding: 0,
                }}
              >{navLabels[s]}</button>
            ))}
            <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 2px" }} />
            <a
              href="https://www.linkedin.com/in/caroline-fenton-9aab4411/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              style={{ display: "flex", alignItems: "center", color: "var(--muted)", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a
              href="https://github.com/caroline-fenton"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              style={{ display: "flex", alignItems: "center", color: "var(--muted)", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px" }}>

        {/* Hero / About */}
        <section id="about" style={{ paddingTop: 140, paddingBottom: 80 }}>
          <FadeIn>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 12,
              color: "var(--accent)", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 20,
            }}>Senior Product Leader, Digital Courseware & EdTech Platforms</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 style={{
              fontFamily: "var(--display)", fontSize: 52,
              fontWeight: 400, lineHeight: 1.15,
              marginBottom: 32, maxWidth: 650,
            }}>Caroline Fenton</h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{
              fontFamily: "var(--body)", fontSize: 17,
              color: "var(--muted)", lineHeight: 1.7,
              maxWidth: 580, fontWeight: 300,
            }}>
              Product leader with 15+ years driving digital transformation in EdTech,
              recognized for bridging the gap between technical and content teams to translate
              complex requirements into actionable, scalable delivery plans. Deep expertise in
              digital publishing, adaptive learning, and accessible courseware.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{
              display: "flex", gap: 32, marginTop: 40,
              fontFamily: "var(--mono)", fontSize: 12,
              color: "var(--muted)",
            }}>
              <span>Somerville, MA</span>
              <span>·</span>
              <span>Pearson Education</span>
              <span>·</span>
              <span style={{ color: "var(--accent)", cursor: "pointer" }}
                onClick={() => scrollTo("contact")}
              >Get in touch ↓</span>
            </div>
          </FadeIn>
        </section>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)" }} />

        {/* Experience */}
        <section id="experience" style={{ padding: "80px 0" }}>
          <FadeIn>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 12,
              color: "var(--accent)", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 48,
            }}>Experience</p>
          </FadeIn>

          <ExperienceEntry
            index={0}
            role="Senior Product Leader, eText & Courseware Authoring"
            company="Pearson Education"
            period="2022 — Present"
            bullets={[
              "Managed $4.5M annual budget including business case creation, roadmap planning, engineering sizing, and initiative prioritization for content authoring platforms — delivering on budget across cost-savings initiatives and revenue-generating student comprehension features",
              "Led and mentored 6 product managers, setting product vision and OKRs, managing performance, and developing talent. Stabilized and re-energized a cross-functional team during multiple leadership transitions, realigning 50+ product, engineering, QA, PMO and design partners around shared delivery goals",
              "Drove operational transformation from print-first to digital-first content production. Accelerated delivery by 3–6 months, consistently hitting sales season windows on a $275M portfolio. Drove 30% average cost savings across 250 titles/year serving 2M learners",
              "Delivered accessibility compliance and offline reading features to expand usability and equity of access, improving student NPS by 14 points",
              "Closed a critical workflow gap by designing an in-platform AI suite for content authors, replacing external tool usage with a governed, embedded toolkit — cutting content remediation tasks from days to hours",
            ]}
          />
          <ExperienceEntry
            index={1}
            role="Director, Production & Digital Studio Content Standards"
            company="Pearson Education"
            period="2020 — 2022"
            bullets={[
              "Owned ROI analysis and production execution for $3M interactive eText conversion program, overseeing producers to build the catalog that launched Pearson+, Pearson's first higher ed subscription model",
              "Defined feature benchmarks with the product team and built a title classification system to manage execution complexity — categorizing 1,500 eTexts by markup quality to prioritize and direct vendor-led glossary, flash card and quiz generation at scale",
              "Managed content risk review pipeline, coordinating cross-functional assessment of materials flagged for potential bias or sociopolitical sensitivity to mitigate legal and reputational exposure",
            ]}
          />
          <ExperienceEntry
            index={2}
            role="Digital Product Manager; Technical Content Manager"
            company="Pearson Education"
            period="2014 — 2020"
            bullets={[
              "Served as technical product lead for Revel, an interactive learning platform. Promoted to manage a team producing multimedia and assessment capabilities and delivering 80 high-quality digital courses at scale",
              "Documented and trained production teams on new standards, defining quality frameworks and instructional materials for distributed teams",
              "Executed IRB-approved efficacy study on adaptive branching scenarios for intro psychology — coordinating participating institutions, directing vendors, and overseeing UI design and QA — with results confirming targeted misconception instruction improved student exam scores",
            ]}
          />
          <ExperienceEntry
            index={3}
            role="Media Production Coordinator; Associate Media Producer"
            company="Pearson Education"
            period="2010 — 2014"
            bullets={[
              "Early roles establishing expertise in digital content production and emerging EdTech tools",
            ]}
          />
          <ExperienceEntry
            index={4}
            role="Creative Brand Copywriter"
            company="Hasbro Games"
            period="2007 — 2010"
            bullets={[
              "Wrote creative taglines, web copy and instructions, ensuring adherence to style guides for high-profile licensed brands including Disney, Lucasfilm and Nickelodeon",
            ]}
          />
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        {/* Case Studies */}
        <section id="case-studies" style={{ padding: "80px 0" }}>
          <FadeIn>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 12,
              color: "var(--accent)", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 12,
            }}>Case Studies</p>
            <p style={{
              fontFamily: "var(--body)", fontSize: 14,
              color: "var(--muted)", lineHeight: 1.6,
              marginBottom: 48, maxWidth: 500,
            }}>
              Detailed explorations of product work including discovery process,
              strategic framing, and outcomes.
            </p>
          </FadeIn>

          {!caseStudyUnlocked ? (
            <PasswordGate onUnlock={() => setCaseStudyUnlocked(true)} />
          ) : (
            <div>
              <FadeIn>
                <div style={{
                  background: "var(--surface)", borderRadius: 10,
                  padding: "36px 32px", marginBottom: 20,
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 500 }}>
                      Bronte Viewer Express
                    </h3>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 11,
                      color: "var(--accent)", letterSpacing: "0.05em",
                    }}>PERFORMANCE</span>
                  </div>
                  <p style={{
                    fontFamily: "var(--body)", fontSize: 14,
                    color: "var(--muted)", lineHeight: 1.6,
                  }}>
                    How we identified and addressed critical load time bottlenecks
                    in Pearson's courseware viewer, targeting a 2.5x improvement
                    through strategic decomposition of the rendering pipeline.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div style={{
                  background: "var(--surface)", borderRadius: 10,
                  padding: "36px 32px", marginBottom: 20,
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 500 }}>
                      Composable Learning Blocks
                    </h3>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 11,
                      color: "var(--accent)", letterSpacing: "0.05em",
                    }}>AUTHORING</span>
                  </div>
                  <p style={{
                    fontFamily: "var(--body)", fontSize: 14,
                    color: "var(--muted)", lineHeight: 1.6,
                  }}>
                    Designing a next-generation structured authoring system with typed content
                    slots, AI quality agents, and multi-format publishing — navigating the
                    architectural tension between flexibility and structure.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div style={{
                  background: "var(--surface)", borderRadius: 10,
                  padding: "36px 32px",
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 500 }}>
                      Adaptive Learning Platform
                    </h3>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 11,
                      color: "var(--accent)", letterSpacing: "0.05em",
                    }}>STRATEGY</span>
                  </div>
                  <p style={{
                    fontFamily: "var(--body)", fontSize: 14,
                    color: "var(--muted)", lineHeight: 1.6,
                  }}>
                    Evolving Pearson's adaptive learning capabilities from acquired technology
                    (Smart Sparrow) into an integrated platform feature — balancing technical
                    debt, user needs, and organizational alignment.
                  </p>
                </div>
              </FadeIn>
            </div>
          )}
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        {/* Side Projects */}
        <section id="projects" style={{ padding: "80px 0" }}>
          <FadeIn>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 12,
              color: "var(--accent)", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 12,
            }}>Projects</p>
            <p style={{
              fontFamily: "var(--body)", fontSize: 14,
              color: "var(--muted)", lineHeight: 1.6,
              marginBottom: 32, maxWidth: 500,
            }}>
              Side projects where I explore ideas at the intersection of technology,
              learning, and personal curiosity.
            </p>
          </FadeIn>

          <ProjectCard
            index={0}
            title="Encore Atlas"
            tag="Music Discovery"
            description="A full-stack music discovery app built with React, TypeScript, Supabase, and Claude API. Uses a two-layer recommendation system combining tag overlap with bio-derived scene adjacency to surface meaningful musical connections."
            link="https://www.encoreatlas.fm"
          />
          <ProjectCard
            index={1}
            title="Brain Blocks"
            tag="Interactive Learning"
            description="A collection of bite-sized learning modules for prototyping interactive learning components — exploring how modular, composable content units can make instructional design more dynamic and engaging."
            noBorder
          />
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        {/* Contact */}
        <section id="contact" style={{ padding: "80px 0 120px" }}>
          <FadeIn>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 12,
              color: "var(--accent)", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 20,
            }}>Contact</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 style={{
              fontFamily: "var(--display)", fontSize: 36,
              fontWeight: 400,
              marginBottom: 24, lineHeight: 1.3,
            }}>Let's connect.</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{
              fontFamily: "var(--body)", fontSize: 15,
              color: "var(--muted)", lineHeight: 1.7,
              maxWidth: 480, marginBottom: 40,
            }}>
              I'm always interested in conversations about EdTech, product leadership,
              and the future of learning. Reach out any time.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{
              display: "flex", gap: 24, flexWrap: "wrap",
            }}>
              {[
                { label: "Email", value: "fenton.caroline@gmail.com", href: "mailto:fenton.caroline@gmail.com" },
                { label: "LinkedIn", value: "Caroline Fenton", href: "https://www.linkedin.com/in/caroline-fenton-9aab4411/" },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block", padding: "20px 28px",
                    background: "var(--surface)", borderRadius: 10,
                    textDecoration: "none", transition: "transform 0.2s",
                    minWidth: 240,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: 11,
                    color: "var(--accent)", letterSpacing: "0.06em",
                    textTransform: "uppercase", display: "block",
                    marginBottom: 6,
                  }}>{c.label}</span>
                  <span style={{
                    fontFamily: "var(--body)", fontSize: 14,
                    color: "var(--ink)",
                  }}>{c.value}</span>
                </a>
              ))}
            </div>
          </FadeIn>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px 32px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--muted)", letterSpacing: "0.03em",
        }}>
          © 2026 Caroline Fenton
        </p>
      </footer>
    </div>
  );
}
