import React from "react";
import { motion } from "framer-motion";
import { Award, BriefcaseBusiness, Building2, CheckCircle2, ExternalLink, Target } from "lucide-react";
import { portfolioData } from "../../shared/portfolio.js";

const experience = portfolioData.experience;
const roles = experience.roles;

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const ExperienceSection: React.FC = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-background">
      <div className="absolute top-12 right-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Experience{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Timeline
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {experience.summary}
          </p>
        </motion.div>

        {roles.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {roles.map((role) => (
              <motion.article
                key={`${role.company}-${role.title}-${role.period}`}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
              >
                <div className="mb-6 flex items-start gap-4">
                  {role.image ? (
                    <img
                      src={role.image}
                      alt={`${role.company} logo`}
                      className="h-14 w-14 shrink-0 rounded-xl border border-border object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20">
                      <BriefcaseBusiness className="h-7 w-7" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-500">
                        {role.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{role.period}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{role.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {role.company} | {role.location}
                    </p>
                  </div>
                </div>

                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{role.description}</p>

                <div className="mb-5 space-y-3">
                  {role.responsibilities.map((item) => (
                    <div key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                  {role.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {role.certificateUrl && (
                    <a
                      href={role.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 px-4 py-2 text-sm font-medium text-indigo-500 transition-colors hover:bg-indigo-500/10"
                    >
                      <Award className="h-4 w-4" />
                      View Certificate
                    </a>
                  )}

                  {role.companyUrl && (
                    <a
                      href={role.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Company
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Ready for verified roles
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-foreground">{experience.placeholderTitle}</h3>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {experience.placeholderDescription}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{experience.note}</p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500 dark:bg-pink-500/20">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">What Will Be Added</h3>
              </div>

              <div className="mb-5 space-y-3">
                {experience.futureEntryFields.map((field) => (
                  <div key={field} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{field}</span>
                  </div>
                ))}
              </div>

              <p className="mb-3 text-sm font-semibold text-foreground">Open to</p>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{experience.availability}</p>
              <div className="flex flex-wrap gap-2">
                {experience.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
