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
  ExternalHyperlink,
} from "docx";
import Groq from "groq-sdk";
import fs from "fs";
import type { ResumeData } from "./interfaces";
import type { Job, Certification } from "./interfaces";

const BLACK = "000000";
const ACCENT = "1B4F72"; // deep navy
const ACCENT_LIGHT = "D6E4F0"; // pale blue
const GRAY = "555555";
const MID = "888888";

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

export function tagLine(tags: string[]) {
  const runs = tags.flatMap((t, i) => [
    new TextRun({
      text: " " + t + " ",
      size: 18,
      font: "Arial",
      color: ACCENT,
      shading: { fill: ACCENT_LIGHT, type: ShadingType.CLEAR },
    }),
    ...(i < tags.length - 1
      ? [new TextRun({ text: "  ", size: 18, font: "Arial" })]
      : []),
  ]);
  return new Paragraph({ spacing: { before: 60, after: 80 }, children: runs });
}

export function skillsTable(rows: [string, string][]) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1560, 7800],
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: 1560, type: WidthType.DXA },
              shading: { fill: ACCENT_LIGHT, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: label,
                      bold: true,
                      size: 20,
                      font: "Arial",
                      color: ACCENT,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders,
              width: { size: 7800, type: WidthType.DXA },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: value,
                      size: 20,
                      font: "Arial",
                      color: GRAY,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
    ),
  });
}

export function bullet(text: string, bold_part = "") {
  const runs = [];
  if (bold_part) {
    runs.push(
      new TextRun({
        text: bold_part + " ",
        bold: true,
        size: 20,
        font: "Arial",
        color: "1A1A1A",
      }),
    );
    runs.push(new TextRun({ text, size: 20, font: "Arial", color: GRAY }));
  } else {
    runs.push(new TextRun({ text, size: 20, font: "Arial", color: GRAY }));
  }
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: runs,
  });
}

export function jobHeader(
  title: string,
  company: string,
  location: string,
  dates: string,
  companyUrl?: string,
) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [6200, 3160],
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
            width: { size: 6200, type: WidthType.DXA },
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            children: [
              new Paragraph({
                spacing: { before: 160, after: 0 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 22,
                    color: "1A1A1A",
                    font: "Arial",
                  }),
                  new TextRun({
                    text: "  ·   ",
                    size: 22,
                    color: MID,
                    font: "Arial",
                  }),
                  (companyUrl
                    ? new ExternalHyperlink({
                        children: [
                          new TextRun({
                            text: company,
                            bold: true,
                            size: 22,
                            color: ACCENT,
                            font: "Arial",
                          }),
                        ],
                        link: companyUrl,
                      })
                    : new TextRun({
                        text: company,
                        bold: true,
                        size: 22,
                        color: ACCENT,
                        font: "Arial",
                      })),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: noBorders,
            width: { size: 3160, type: WidthType.DXA },
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 160, after: 0 },
                children: [
                  new TextRun({
                    text: dates,
                    italics: true,
                    size: 18,
                    color: MID,
                    font: "Arial",
                  }),
                  new TextRun({
                    text: "    " + location,
                    size: 18,
                    color: MID,
                    font: "Arial",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

export function sectionHeading(text: string) {
  return new Paragraph({
    spacing: { before: 280, after: 60 },
    ...bottomRule(ACCENT, 10),
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: ACCENT,
        font: "Arial",
      }),
    ],
  });
}

export function createDocument(data: ResumeData) {
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
                            color: BLACK,
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
                            color: GRAY,
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
                            color: BLACK,
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
                            color: BLACK,
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
                            color: BLACK,
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
                            color: BLACK,
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
              jobHeader(
                job.title,
                job.company,
                job.location,
                job.dates,
                job.companyUrl,
              ),
              tagLine(job.tags),
              ...job.bullets.map((b) => bullet(b)),
            ])
            .flat(),

          // ── SKILLS ────────────────────────────────────────────────────────
          sectionHeading("Technical Skills"),
          skillsTable(data.skills),

          // // ── EDUCATION ─────────────────────────────────────────────────────
          // sectionHeading("Education"),
          // new Table({
          //   width: { size: 9360, type: WidthType.DXA },
          //   columnWidths: [6800, 2560],
          //   borders: {
          //     top: noBorder,
          //     bottom: noBorder,
          //     left: noBorder,
          //     right: noBorder,
          //     insideHorizontal: noBorder,
          //     insideVertical: noBorder,
          //   },
          //   rows: [
          //     new TableRow({
          //       children: [
          //         new TableCell({
          //           borders: noBorders,
          //           width: { size: 6800, type: WidthType.DXA },
          //           margins: { top: 60, bottom: 0, left: 0, right: 0 },
          //           children: [
          //             new Paragraph({
          //               children: [
          //                 new TextRun({
          //                   text: data.education.degree,
          //                   bold: true,
          //                   size: 21,
          //                   font: "Arial",
          //                 }),
          //                 new TextRun({
          //                   text: `  –  ${data.education.university} `,
          //                   size: 20,
          //                   font: "Arial",
          //                   color: GRAY,
          //                 }),
          //               ],
          //             }),
          //           ],
          //         }),
          //         new TableCell({
          //           borders: noBorders,
          //           width: { size: 2560, type: WidthType.DXA },
          //           margins: { top: 60, bottom: 0, left: 0, right: 0 },
          //           children: [
          //             new Paragraph({
          //               alignment: AlignmentType.RIGHT,
          //               children: [
          //                 new TextRun({
          //                   text: data.education.dates,
          //                   size: 20,
          //                   font: "Arial",
          //                   color: MID,
          //                   italics: true,
          //                 }),
          //               ],
          //             }),
          //           ],
          //         }),
          //       ],
          //     }),
          //   ],
          // }),

          // // ── CERTIFICATIONS & AWARDS ───────────────────────────────────────
          // sectionHeading("Certifications & Awards"),
          // ...data.certifications.map(
          //   (cert: Certification) =>
          //     new Paragraph({
          //       spacing: { before: 60, after: 40 },
          //       children: [
          //         new TextRun({
          //           text: cert.name,
          //           bold: true,
          //           size: 20,
          //           font: "Arial",
          //         }),
          //         new TextRun({
          //           text: `   (${cert.year}) `,
          //           size: 19,
          //           font: "Arial",
          //           color: MID,
          //         }),
          //       ],
          //     }),
          // ),
        ],
      },
    ],
  });
}
