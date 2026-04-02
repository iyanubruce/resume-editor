import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  LevelFormat,
  HeadingLevel,
} from "docx";
import Groq from "groq-sdk";
import fs from "fs";
import {
  tagLine,
  skillsTable,
  bullet,
  jobHeader,
  sectionHeading,
} from "./helpers";
import type { ResumeData, Job, Certification } from "./interfaces";
import { BASE_RESUME_DATA } from "./resume_data";
import dotenv from "dotenv";
dotenv.config();
// ── CONFIGURATION ───────────────────────────────────────────────────────
const ACCENT = "1B4F72"; // deep navy
const ACCENT_LIGHT = "D6E4F0"; // pale blue
const GRAY = "555555";
const MID = "888888";
const WHITE = "FFFFFF";

const JOB_DESCRIPTION = `
We are looking for a Software Engineer with strong leadership skills.
Must have experience with Node.js, REST APIs, and Agile methodologies.
Experience with cloud infrastructure (AWS) is a plus.
`;

// ── HELPER FUNCTIONS (Fixed Syntax Errors) ──────────────────────────────
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = {
  top: noBorder,
  bottom: noBorder,
  left: noBorder,
  right: noBorder,
};

const bottomRule = (color = ACCENT, size = 12) => ({
  border: { bottom: { style: BorderStyle.SINGLE, size, color, space: 1 } },
});

// ── AI TAILORING LOGIC ──────────────────────────────────────────────────
async function tailorResumeData(baseData: ResumeData, jobDesc: string) {
  console.log("🤖 Analyzing job description and tailoring resume...");

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an expert career coach. Tailor the resume to match the job description. Return ONLY a valid JSON object matching the input structure. DO NOT invent new jobs, dates, companies, or facts. Keep all history truthful.",
        },
        {
          role: "user",
          content: `Tailor this resume to match the job description:\n\nJOB DESCRIPTION:\n${jobDesc}\n\nCURRENT RESUME DATA:\n${JSON.stringify(baseData)}`,
        },
      ],
      temperature: 0.3,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "tailored_resume",
          strict: true,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
              title: { type: "string" },
              contact: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  phone: { type: "string" },
                  linkedin: { type: "string" },
                  github: { type: "string" },
                },
                required: ["email", "phone", "linkedin", "github"],
                additionalProperties: false, // ← ADD THIS
              },
              summary: { type: "string" },
              experience: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    company: { type: "string" },
                    location: { type: "string" },
                    dates: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                    bullets: { type: "array", items: { type: "string" } },
                  },
                  required: [
                    "title",
                    "company",
                    "location",
                    "dates",
                    "tags",
                    "bullets",
                  ],
                  additionalProperties: false, // ← ADD THIS
                },
              },
              skills: {
                type: "array",
                items: {
                  type: "array",
                  items: { type: "string" },
                  minItems: 2,
                  maxItems: 2,
                },
              },
              education: {
                type: "object",
                properties: {
                  degree: { type: "string" },
                  university: { type: "string" },
                  dates: { type: "string" },
                },
                required: ["degree", "university", "dates"],
                additionalProperties: false, // ← ADD THIS
              },
              certifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    year: { type: "string" },
                  },
                  required: ["name", "year"],
                  additionalProperties: false, // ← ADD THIS
                },
              },
            },
            required: [
              "name",
              "title",
              "contact",
              "summary",
              "experience",
              "skills",
              "education",
              "certifications",
            ],
            additionalProperties: false, // ← You already have this (good)
          },
        },
      },
    });
    if (
      !response.choices ||
      response.choices.length === 0 ||
      !response.choices[0] ||
      !response.choices[0].message.content
    ) {
      throw new Error("No response from Groq");
    }
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("❌ Groq Error:", error);
    console.log("⚠️  Falling back to base resume data");
    return baseData;
  }
}

// ── DOCUMENT GENERATION ─────────────────────────────────────────────────
function createDocument(data: ResumeData) {
  return new Document({
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "▸",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 440, hanging: 280 } } },
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: { run: { font: "Arial", size: 20, color: "1A1A1A" } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children: [
          // ── NAME HEADER BLOCK ──────────────────────────────────────────────
          new Table({
            width: { size: 10080, type: WidthType.DXA },
            columnWidths: [10080],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: noBorders,
                    shading: { fill: ACCENT, type: ShadingType.CLEAR },
                    width: { size: 10080, type: WidthType.DXA },
                    margins: { top: 240, bottom: 240, left: 360, right: 360 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 0, after: 60 },
                        children: [
                          new TextRun({
                            text: data.name,
                            bold: true,
                            size: 52,
                            font: "Arial",
                            color: WHITE,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 0, after: 80 },
                        children: [
                          new TextRun({
                            text: data.title,
                            size: 26,
                            font: "Arial",
                            color: ACCENT_LIGHT,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 0, after: 0 },
                        children: [
                          new TextRun({
                            text: `📧 ${data.contact.email} `,
                            size: 19,
                            font: "Arial",
                            color: WHITE,
                          }),
                          new TextRun({
                            text: "   |    ",
                            size: 19,
                            font: "Arial",
                            color: ACCENT_LIGHT,
                          }),
                          new TextRun({
                            text: `📞 ${data.contact.phone} `,
                            size: 19,
                            font: "Arial",
                            color: WHITE,
                          }),
                          new TextRun({
                            text: "   |    ",
                            size: 19,
                            font: "Arial",
                            color: ACCENT_LIGHT,
                          }),
                          new TextRun({
                            text: `🔗 ${data.contact.linkedin} `,
                            size: 19,
                            font: "Arial",
                            color: WHITE,
                          }),
                          new TextRun({
                            text: "   |    ",
                            size: 19,
                            font: "Arial",
                            color: ACCENT_LIGHT,
                          }),
                          new TextRun({
                            text: `🐙 ${data.contact.github} `,
                            size: 19,
                            font: "Arial",
                            color: WHITE,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // ── PROFESSIONAL SUMMARY ───────────────────────────────────────────
          sectionHeading("Professional Summary"),
          new Paragraph({
            spacing: { before: 60, after: 80 },
            children: [
              new TextRun({
                text: data.summary,
                size: 20,
                font: "Arial",
                color: GRAY,
                italics: true,
              }),
            ],
          }),

          // ── EXPERIENCE ────────────────────────────────────────────────────
          sectionHeading("Experience"),
          ...data.experience
            .map((job: Job) => [
              jobHeader(job.title, job.company, job.location, job.dates),
              tagLine(job.tags),
              ...job.bullets.map((b) => bullet(b)),
            ])
            .flat(),

          // ── SKILLS ────────────────────────────────────────────────────────
          sectionHeading("Technical Skills"),
          skillsTable(data.skills),

          // ── EDUCATION ─────────────────────────────────────────────────────
          sectionHeading("Education"),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [6800, 2560],
            borders: {
              top: noBorder,
              bottom: noBorder,
              left: noBorder,
              right: noBorder,
              insideHorizontal: noBorder,
              insideVertical: noBorder,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: noBorders,
                    width: { size: 6800, type: WidthType.DXA },
                    margins: { top: 60, bottom: 0, left: 0, right: 0 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: data.education.degree,
                            bold: true,
                            size: 21,
                            font: "Arial",
                          }),
                          new TextRun({
                            text: `  –  ${data.education.university} `,
                            size: 20,
                            font: "Arial",
                            color: GRAY,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: noBorders,
                    width: { size: 2560, type: WidthType.DXA },
                    margins: { top: 60, bottom: 0, left: 0, right: 0 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: data.education.dates,
                            size: 20,
                            font: "Arial",
                            color: MID,
                            italics: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // ── CERTIFICATIONS & AWARDS ───────────────────────────────────────
          sectionHeading("Certifications & Awards"),
          ...data.certifications.map(
            (cert: Certification) =>
              new Paragraph({
                spacing: { before: 60, after: 40 },
                children: [
                  new TextRun({
                    text: cert.name,
                    bold: true,
                    size: 20,
                    font: "Arial",
                  }),
                  new TextRun({
                    text: `   (${cert.year}) `,
                    size: 19,
                    font: "Arial",
                    color: MID,
                  }),
                ],
              }),
          ),
        ],
      },
    ],
  });
}

// ── MAIN EXECUTION ──────────────────────────────────────────────────────
(async () => {
  try {
    // 1. Tailor Data
    const tailoredData = await tailorResumeData(
      BASE_RESUME_DATA,
      JOB_DESCRIPTION,
    );

    // 2. Create Document
    const doc = createDocument(tailoredData);

    // 3. Save File
    const buffer = await Packer.toBuffer(doc);
    const fileName = "Tailored_Resume.docx";
    fs.writeFileSync(fileName, buffer);

    console.log(`✅ Success! Generated ${fileName}`);
    console.log(
      "⚠️  NOTE: This is a .docx file. Open it in Word/Google Docs to review, then Save As PDF.",
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
})();
