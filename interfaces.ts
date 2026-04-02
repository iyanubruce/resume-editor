export interface Job {
  title: string;
  company: string;
  location: string;
  dates: string;
  tags: string[];
  bullets: string[];
}
export interface Certification {
  name: string;
  year: string;
}
export interface Education {
  degree: string;
  university: string;
  dates: string;
}

export interface ResumeData {
  name: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: Job[];
  skills: [string, string][];
  education: {
    degree: string;
    university: string;
    dates: string;
  };
  certifications: Certification[];
}
