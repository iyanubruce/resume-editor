import { Packer, BorderStyle } from "docx";
import Groq from "groq-sdk";
import fs from "fs";
import type { ResumeData } from "./src/interfaces";
import { BASE_RESUME_DATA } from "./src/resume_data_technical_support";
import dotenv from "dotenv";
import { JOB_DESCRIPTION } from "./src/job_description";
import { createDocument } from "./src/helpers";

dotenv.config();

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

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
            "You are an expert career coach. Tailor the resume to match the job description. Return ONLY a valid JSON object matching the input structure. DO NOT invent new jobs, dates, companies, or facts. Keep all history truthful. NOTE: When rewriting my title make sure to never use Junior, Entry-Level, or similar. Use more neutral terms, if the role requires Senior level experience, you can use senior, but if it doesn't specify, just use the title without modifiers.",
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
    const fileName = "Iyanuoluwa_Ikechukwu_Taiwo.docx";
    fs.writeFileSync(fileName, buffer);

    console.log(`✅ Success! Generated ${fileName}`);
    console.log(
      "⚠️  NOTE: This is a .docx file. Open it in Word/Google Docs to review, then Save As PDF.",
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
})();
