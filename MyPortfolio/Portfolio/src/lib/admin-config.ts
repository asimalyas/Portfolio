export type AdminField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "array" | "number" | "boolean" | "select";
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export type AdminCollectionConfig = {
  slug: string;
  table: string;
  title: string;
  description: string;
  listLabel: string;
  fields: AdminField[];
};

export const adminCollections: AdminCollectionConfig[] = [
  {
    slug: "projects",
    table: "projects",
    title: "Projects",
    description: "Manage portfolio projects, links, categories, and tech stacks.",
    listLabel: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "tech_stack", label: "Tech Stack", type: "array", placeholder: "React, TypeScript, Vite" },
      { key: "categories", label: "Categories", type: "array", options: ["Web Development", "Machine Learning", "Game Development", "Data Structures", "Desktop Application"], placeholder: "Web Development, Machine Learning" },
      { key: "url", label: "Project URL", type: "url" },
      { key: "image_url", label: "Project Image", type: "url" },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "active", label: "Show Publicly", type: "boolean" },
    ],
  },
  {
    slug: "certificates",
    table: "certificates",
    title: "Certificates",
    description: "Manage certificates, issuers, images, and credential links.",
    listLabel: "title",
    fields: [
      { key: "image_url", label: "Certificate Image", type: "url" },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "date_label", label: "Date", type: "text", placeholder: "January 2026" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "categories", label: "Categories", type: "array", options: ["Studies", "Projects", "Activities", "Sports", "Skills"] },
      { key: "credential_url", label: "Credential URL (optional)", type: "url" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "active", label: "Show Publicly", type: "boolean" },
    ],
  },
  {
    slug: "skills",
    table: "skills",
    title: "Skills",
    description: "Manage skill cards shown in the About section.",
    listLabel: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "icon", label: "Icon", type: "select", options: ["monitor", "gamepad", "brain", "database", "code", "rocket"] },
      { key: "color", label: "Color Class", type: "text", placeholder: "text-blue-500" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "active", label: "Show Publicly", type: "boolean" },
    ],
  },
  {
    slug: "experience",
    table: "experiences",
    title: "Experience",
    description: "Manage internships, jobs, freelance roles, certificates, and company links.",
    listLabel: "title",
    fields: [
      { key: "certificate_url", label: "Experience Certificate (optional)", type: "url" },
      { key: "title", label: "Role Title", type: "text", required: true },
      { key: "company", label: "Company", type: "text", required: true },
      { key: "type", label: "Type", type: "select", options: ["Internship", "Job", "Freelance", "Contract", "Volunteer"] },
      { key: "location", label: "Location", type: "text" },
      { key: "period", label: "Period", type: "text", placeholder: "June 2026 - August 2026" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "responsibilities", label: "Responsibilities", type: "array" },
      { key: "technologies", label: "Technologies", type: "array" },
      { key: "image_url", label: "Company Logo/Image", type: "url" },
      { key: "company_url", label: "Company URL", type: "url" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "active", label: "Show Publicly", type: "boolean" },
    ],
  },
  {
    slug: "education",
    table: "education",
    title: "Education",
    description: "Manage education timeline entries.",
    listLabel: "degree",
    fields: [
      { key: "degree", label: "Degree", type: "text", required: true },
      { key: "institution", label: "Institution", type: "text", required: true },
      { key: "years", label: "Years", type: "text" },
      { key: "grade", label: "Grade", type: "text" },
      { key: "image_url", label: "Image", type: "url" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "active", label: "Show Publicly", type: "boolean" },
    ],
  },
  {
    slug: "achievements",
    table: "achievements",
    title: "Achievements",
    description: "Manage public achievement cards and categories.",
    listLabel: "title",
    fields: [
      { key: "image_url", label: "Image", type: "url" },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "categories", label: "Categories", type: "array", options: ["Studies", "Projects", "Activities", "Sports", "Skills"], placeholder: "Studies, Projects" },
      { key: "date_label", label: "Date", type: "text" },
      { key: "credential_url", label: "Credential URL (optional)", type: "url" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "active", label: "Show Publicly", type: "boolean" },
    ],
  },
];

export const adminNavItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Profile", href: "/admin/profile" },
  ...adminCollections.map((collection) => ({
    label: collection.title,
    href: `/admin/${collection.slug}`,
  })),
];

