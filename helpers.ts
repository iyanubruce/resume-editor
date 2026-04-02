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

const ACCENT = "1B4F72"; // deep navy
const ACCENT_LIGHT = "D6E4F0"; // pale blue
const GRAY = "555555";
const MID = "888888";
const WHITE = "FFFFFF";

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
                  new TextRun({
                    text: company,
                    bold: true,
                    size: 22,
                    color: ACCENT,
                    font: "Arial",
                  }),
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
