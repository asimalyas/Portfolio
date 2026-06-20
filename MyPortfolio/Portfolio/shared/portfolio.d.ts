export type SkillIcon = "monitor" | "gamepad" | "brain" | "database" | "code" | "rocket";
export type ProjectCategory =
  | "Web Development"
  | "Machine Learning"
  | "Game Development"
  | "Data Structures"
  | "Desktop Application";
export type AchievementCategory = "Studies" | "Projects" | "Activities" | "Sports" | "Skills";

export type PortfolioData = {
  profile: {
    name: string;
    shortName: string;
    brandName: string;
    headline: string;
    summary: string;
    about: string;
    location: string;
    avatar: string;
    logoAvatar: string;
    roles: string[];
  };
  skills: Array<{
    icon: SkillIcon;
    color: string;
    title: string;
    description: string;
  }>;
  projectCategories: Array<"All" | ProjectCategory>;
  projects: Array<{
    id: number | string;
    title: string;
    description: string;
    techStack: string[];
    url: string | null;
    image?: string;
    categories: ProjectCategory[];
  }>;
  education: Array<{
    id: number | string;
    years: string;
    degree: string;
    institution: string;
    grade: string;
    image: string;
  }>;
  achievementCategories: Array<"All" | AchievementCategory>;
  achievements: Array<{
    id: number | string;
    title: string;
    description: string;
    image: string;
    category: AchievementCategory[];
  }>;
  certificates?: Array<{
    id: number | string;
    title: string;
    issuer: string;
    dateLabel: string;
    description: string;
    image: string;
    credentialUrl: string | null;
    categories: AchievementCategory[];
  }>;
  experience: {
    summary: string;
    availability: string;
    placeholderTitle: string;
    placeholderDescription: string;
    roles: Array<{
      title: string;
      company: string;
      type: "Internship" | "Job" | "Freelance" | "Contract" | "Volunteer";
      location: string;
      period: string;
      image?: string;
      description: string;
      responsibilities: string[];
      technologies: string[];
      certificateUrl?: string;
      companyUrl?: string;
    }>;
    focusAreas: string[];
    futureEntryFields: string[];
    note: string;
  };
  links: {
    github: string;
    linkedin: string;
    resume: string;
  };
  contact: {
    email: string;
    phones: string[];
    location: string;
  };
  suggestedQuestions: string[];
};

export const portfolioData: PortfolioData;




