import { type ResumeData } from "./interfaces";

export const BASE_RESUME_DATA: ResumeData = {
  name: "YOUR FULL NAME",
  title: "Senior Software Engineer",
  contact: {
    email: "you@email.com",
    phone: "+1 (555) 000-0000",
    linkedin: "linkedin.com/in/yourname",
    github: "github.com/yourname",
  },
  summary:
    "Senior software engineer with X+ years building scalable, high-performance systems across [industries]. Proven track record of leading cross-functional teams, driving architectural decisions, and delivering complex projects from concept to production. Passionate about clean code, mentorship, and engineering excellence.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Company C",
      location: "City, Country",
      dates: "Jan 2022 – Present",
      tags: ["Node.js", "React", "PostgreSQL", "AWS", "Docker", "CI/CD"],
      bullets: [
        "Architected and shipped a microservices platform serving 2M+ daily active users, reducing p99 latency by 40%.",
        "Led a team of 5 engineers; introduced quarterly planning, code-review standards, and an on-call rotation.",
        "Designed an event-driven pipeline (Kafka + Lambda) that cut data processing costs by $120K/year.",
        "Drove migration from monolith to microservices with zero downtime using a strangler-fig pattern.",
        "Mentored 3 junior engineers; two received promotions within 18 months.",
      ],
    },
    {
      title: "Software Engineer II",
      company: "Company B",
      location: "City, Country",
      dates: "Mar 2019 – Dec 2021",
      tags: ["Python", "Django", "Redis", "Celery", "GCP", "Kubernetes"],
      bullets: [
        "Built a real-time analytics dashboard used by 300+ enterprise clients, improving retention by 18%.",
        "Reduced CI pipeline duration from 22 min to 6 min by parallelizing test suites and caching dependencies.",
        "Authored internal API design standards adopted across 4 engineering teams.",
        "Collaborated with product and design to ship 12 features in 2 major releases on schedule.",
      ],
    },
    {
      title: "Software Engineer",
      company: "Company A",
      location: "City, Country",
      dates: "Jun 2017 – Feb 2019",
      tags: ["Java", "Spring Boot", "MySQL", "REST APIs", "Jenkins"],
      bullets: [
        "Developed RESTful APIs powering the company's core mobile app (1M+ downloads).",
        "Improved database query performance by 60% through query optimization and strategic indexing.",
        "Participated in on-call rotations and reduced mean-time-to-resolution by introducing better alerting.",
      ],
    },
  ],
  skills: [
    ["Languages", "JavaScript / TypeScript, Python, Java, Go, SQL, Bash"],
    ["Frontend", "React, Next.js, HTML5/CSS3, Tailwind, Webpack"],
    ["Backend", "Node.js, Django, Spring Boot, GraphQL, REST"],
    ["Data", "PostgreSQL, MySQL, Redis, MongoDB, Kafka, Elasticsearch"],
    [
      "Cloud & Ops",
      "AWS (EC2, Lambda, RDS, S3), GCP, Docker, Kubernetes, Terraform",
    ],
    [
      "Practices",
      "Agile / Scrum, TDD, CI/CD, Code Review, System Design, Mentorship",
    ],
  ],
  education: {
    degree: "B.Sc. Computer Science",
    university: "University Name",
    dates: "2013 – 2017",
  },
  certifications: [
    { name: "AWS Certified Solutions Architect – Associate", year: "2023" },
    { name: "Google Cloud Professional Data Engineer", year: "2022" },
  ],
};
