import { portfolioData as fallbackPortfolioData } from "../../shared/portfolio.js";
import type { AchievementCategory, PortfolioData, ProjectCategory, SkillIcon } from "../../shared/portfolio.js";
import { supabase } from "./supabase";

type ProfileRow = {
  name: string;
  short_name: string;
  brand_name: string;
  headline: string;
  summary: string;
  about: string;
  location: string;
  avatar_url: string;
  logo_avatar_url: string;
  roles: string[] | null;
  github_url: string;
  linkedin_url: string;
  resume_url: string;
  contact_email: string;
  phones: string[] | null;
  suggested_questions: string[] | null;
};

type SkillRow = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
};

type ProjectRow = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[] | null;
  categories: string[] | null;
  url: string | null;
  image_url: string | null;
  sort_order: number;
};

type EducationRow = {
  id: string;
  years: string;
  degree: string;
  institution: string;
  grade: string;
  image_url: string | null;
  sort_order: number;
};

type ExperienceRow = {
  id: string;
  title: string;
  company: string;
  type: "Internship" | "Job" | "Freelance" | "Contract" | "Volunteer";
  location: string;
  period: string;
  image_url: string | null;
  description: string;
  responsibilities: string[] | null;
  technologies: string[] | null;
  certificate_url: string | null;
  company_url: string | null;
  sort_order: number;
};

type AchievementRow = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  categories: string[] | null;
  sort_order: number;
};

type CertificateRow = {
  id: string;
  title: string;
  issuer: string;
  date_label: string;
  description: string;
  image_url: string | null;
  credential_url: string | null;
  category: string | null;
  categories: string[] | null;
  sort_order: number;
};

const skillIcons = new Set(["monitor", "gamepad", "brain", "database", "code", "rocket"]);
const projectCategories = new Set([
  "Web Development",
  "Machine Learning",
  "Game Development",
  "Data Structures",
  "Desktop Application",
]);
const achievementCategories = new Set(["Studies", "Projects", "Activities", "Sports", "Skills"]);

function asSkillIcon(value: string): SkillIcon {
  return skillIcons.has(value) ? (value as SkillIcon) : "code";
}

function asProjectCategories(values: string[] | null): ProjectCategory[] {
  return (values || []).filter((value): value is ProjectCategory => projectCategories.has(value));
}

function asAchievementCategories(values: string[] | null): AchievementCategory[] {
  return (values || []).filter((value): value is AchievementCategory => achievementCategories.has(value));
}

function sorted<T extends { sort_order: number }>(rows: T[] | null) {
  return [...(rows || [])].sort((a, b) => a.sort_order - b.sort_order);
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  if (!supabase) return fallbackPortfolioData;

  const [
    profileResult,
    skillsResult,
    projectsResult,
    educationResult,
    experiencesResult,
    achievementsResult,
    certificatesResult,
  ] = await Promise.all([
    supabase.from("profile").select("*").eq("id", "main").maybeSingle<ProfileRow>(),
    supabase.from("skills").select("*").eq("active", true).order("sort_order", { ascending: true }),
    supabase.from("projects").select("*").eq("active", true).order("sort_order", { ascending: true }),
    supabase.from("education").select("*").eq("active", true).order("sort_order", { ascending: true }),
    supabase.from("experiences").select("*").eq("active", true).order("sort_order", { ascending: true }),
    supabase.from("achievements").select("*").eq("active", true).order("sort_order", { ascending: true }),
    supabase.from("certificates").select("*").eq("active", true).order("sort_order", { ascending: true }),
  ]);

  if (
    profileResult.error ||
    skillsResult.error ||
    projectsResult.error ||
    educationResult.error ||
    experiencesResult.error ||
    achievementsResult.error ||
    certificatesResult.error
  ) {
    return fallbackPortfolioData;
  }

  const profile = profileResult.data;

  const data: PortfolioData = {
    ...fallbackPortfolioData,
    profile: profile
      ? {
          name: profile.name,
          shortName: profile.short_name,
          brandName: profile.brand_name,
          headline: profile.headline,
          summary: profile.summary,
          about: profile.about,
          location: profile.location,
          avatar: profile.avatar_url,
          logoAvatar: profile.logo_avatar_url,
          roles: profile.roles || [],
        }
      : fallbackPortfolioData.profile,
    links: profile
      ? {
          github: profile.github_url,
          linkedin: profile.linkedin_url,
          resume: profile.resume_url,
        }
      : fallbackPortfolioData.links,
    contact: profile
      ? {
          email: profile.contact_email,
          phones: profile.phones || [],
          location: profile.location,
        }
      : fallbackPortfolioData.contact,
    suggestedQuestions: profile?.suggested_questions?.length
      ? profile.suggested_questions
      : fallbackPortfolioData.suggestedQuestions,
    skills: skillsResult.data?.length
      ? sorted(skillsResult.data as SkillRow[]).map((skill) => ({
          icon: asSkillIcon(skill.icon),
          color: skill.color,
          title: skill.title,
          description: skill.description,
        }))
      : fallbackPortfolioData.skills,
    projects: projectsResult.data?.length
      ? sorted(projectsResult.data as ProjectRow[]).map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          techStack: project.tech_stack || [],
          url: project.url,
          image: project.image_url || undefined,
          categories: asProjectCategories(project.categories),
        }))
      : fallbackPortfolioData.projects,
    education: educationResult.data?.length
      ? sorted(educationResult.data as EducationRow[]).map((item) => ({
          id: item.id,
          years: item.years,
          degree: item.degree,
          institution: item.institution,
          grade: item.grade,
          image: item.image_url || "",
        }))
      : fallbackPortfolioData.education,
    achievements: achievementsResult.data?.length
      ? sorted(achievementsResult.data as AchievementRow[]).map((achievement) => ({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          image: achievement.image_url || "",
          category: asAchievementCategories(achievement.categories),
        }))
      : fallbackPortfolioData.achievements,
    experience: {
      ...fallbackPortfolioData.experience,
      roles: experiencesResult.data?.length
        ? sorted(experiencesResult.data as ExperienceRow[]).map((role) => ({
            title: role.title,
            company: role.company,
            type: role.type,
            location: role.location,
            period: role.period,
            image: role.image_url || undefined,
            description: role.description,
            responsibilities: role.responsibilities || [],
            technologies: role.technologies || [],
            certificateUrl: role.certificate_url || undefined,
            companyUrl: role.company_url || undefined,
          }))
        : fallbackPortfolioData.experience.roles,
    },
    certificates: certificatesResult.data?.length
      ? sorted(certificatesResult.data as CertificateRow[]).map((certificate) => ({
          id: certificate.id,
          title: certificate.title,
          issuer: certificate.issuer,
          dateLabel: certificate.date_label,
          description: certificate.description,
          image: certificate.image_url || "",
          credentialUrl: certificate.credential_url,
          categories: certificate.categories?.length
            ? asAchievementCategories(certificate.categories)
            : certificate.category && achievementCategories.has(certificate.category)
              ? [certificate.category as AchievementCategory]
              : ["Skills"],
        }))
      : [],
  };

  data.projectCategories = [
    "All",
    ...Array.from(new Set(data.projects.flatMap((project) => project.categories))),
  ] as PortfolioData["projectCategories"];
  data.achievementCategories = [
    "All",
    ...Array.from(new Set(data.achievements.flatMap((achievement) => achievement.category))),
  ] as PortfolioData["achievementCategories"];

  return data;
}

export { fallbackPortfolioData };


