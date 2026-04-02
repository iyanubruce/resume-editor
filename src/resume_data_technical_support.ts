// resume_data.ts
import { type ResumeData } from "./interfaces";

export const BASE_RESUME_DATA: ResumeData = {
  name: "Iyanuoluwa I. Taiwo",
  title: "Technical Support Engineer",
  contact: {
    email: "iyanuoluwa938@gmail.com",
    phone: "+234 813 369 3469",
    linkedin: "https://www.linkedin.com/in/iyanuoluwa-taiwo-540823333/",
    github: "https://github.com/iyanubruce",
  },

  summary:
    "Dedicated Technical Support Engineer with 5+ years of experience resolving complex technical issues for fintech and SaaS platforms. Proven ability to troubleshoot API integrations, manage escalations, and collaborate with engineering teams to improve product reliability. Strong communicator passionate about empowering customers and reducing time-to-resolution.",
  experience: [
    {
      title: "Senior Technical Support Engineer",
      company: "LocalRamp",
      companyUrl: "https://www.localramp.com/",
      location: "Lagos, Nigeria",
      dates: "Jan 2021 – Present",
      tags: [
        "API Support",
        "Ticketing Systems",
        "Customer Escalations",
        "Technical Documentation",
        "SLA Management",
        "Fintech",
      ],
      bullets: [
        "Resolved 500+ tier-2/3 support tickets monthly for embedded finance APIs, maintaining a 98% CSAT score and <2hr average response time.",
        "Created and maintained a knowledge base of 100+ articles covering API authentication, webhook troubleshooting, and common integration patterns, reducing repeat tickets by 35%.",
        "Collaborated with engineering to reproduce and document bugs, accelerating fix deployment for critical payment flow issues affecting 10K+ end users.",
        "Led onboarding sessions for enterprise clients, guiding technical teams through sandbox testing, API key management, and production go-live checklists.",
        "Implemented automated ticket tagging and routing rules in Zendesk, improving team efficiency and reducing misrouted escalations by 40%.",
        "Mentored 3 junior support engineers on API fundamentals, debugging techniques, and customer communication best practices.",
      ],
    },
    {
      title: "Technical Support Engineer",
      company: "Levi-Finance",
      location: "Lagos, Nigeria",
      dates: "Jan 2021 – Present",
      tags: [
        "API Support",
        "Ticketing Systems",
        "Customer Escalations",
        "Technical Documentation",
        "SLA Management",
        "Fintech",
      ],
      bullets: [
        "Resolved 500+ tier-2/3 support tickets monthly for embedded finance APIs, maintaining a 98% CSAT score and <2hr average response time.",
        "Created and maintained a knowledge base of 100+ articles covering API authentication, webhook troubleshooting, and common integration patterns, reducing repeat tickets by 35%.",
        "Collaborated with engineering to reproduce and document bugs, accelerating fix deployment for critical payment flow issues affecting 10K+ end users.",
        "Led onboarding sessions for enterprise clients, guiding technical teams through sandbox testing, API key management, and production go-live checklists.",
        "Implemented automated ticket tagging and routing rules in Zendesk, improving team efficiency and reducing misrouted escalations by 40%.",
        "Mentored 3 junior support engineers on API fundamentals, debugging techniques, and customer communication best practices.",
      ],
    },
  ],
  skills: [
    [
      "Support Tools",
      "Zendesk, Jira Service Desk, Intercom, Freshdesk, Confluence, Notion",
    ],
    [
      "Technical Skills",
      "REST APIs, Webhooks, JSON, OAuth 2.0, Postman, cURL, Basic SQL, Bash",
    ],
    [
      "Networking & Systems",
      "HTTP/HTTPS, DNS, TCP/IP, Firewalls, Linux/Unix CLI, Windows/macOS Support",
    ],
    [
      "Remote Support",
      "Zoom, TeamViewer, Screen Sharing, Log Analysis, Error Tracking (Sentry, Datadog)",
    ],
    [
      "Customer Success",
      "SLA Management, Escalation Handling, Technical Writing, User Training, De-escalation",
    ],
    [
      "Processes",
      "ITIL Fundamentals, Agile/Scrum Support, Root Cause Analysis, Knowledge-Centered Service (KCS)",
    ],
  ],
  education: {
    degree: "B.Sc. Computer Science",
    university: "University Name",
    dates: "2013 – 2017",
  },
  certifications: [
    { name: "AWS Certified Cloud Practitioner", year: "2023" },
    { name: "ITIL 4 Foundation", year: "2022" },
    { name: "Zendesk Support Administrator", year: "2021" },
  ],
};
