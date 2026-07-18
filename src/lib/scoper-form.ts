import type ExcelJS from "exceljs";

export type YesNo = "Yes" | "No";

export interface Brief {
  id: string;
  clientName: string;
  projectType: string;
  pages: string[];
  colorMood: string;
  primaryColor: string;
  uiStyle: string;
  referenceWebsites: string;
  animationLevel: string;
  animationTypes: string[];
  databaseNeeded: YesNo;
  dataTypes: string[];
  authNeeded: YesNo;
  authTypes: string[];
  paymentsNeeded: YesNo;
  paymentMethods: string[];
  cmsNeeded: YesNo;
  fileUploads: YesNo;
  realtime: YesNo;
  socialAccountsNeeded: YesNo;
  socialPlatforms: string[];
  socialLinks: string;
  seoPriority: string;
  multiLanguage: YesNo;
  platform: string;
  timeline: string;
  notes: string;
}

export const PROJECT_TYPES = [
  "Portfolio / Personal Site",
  "Business / Landing Page",
  "E-commerce Store",
  "Blog / Content Platform",
  "SaaS / Web App",
  "Community / Social Platform",
  "Booking / Reservation System",
  "Other",
];

export const PAGE_OPTIONS = [
  "Home", "About", "Services", "Portfolio / Projects", "Blog", "Pricing",
  "FAQ", "Contact", "Login / Signup", "Dashboard", "Admin Panel", "Checkout / Cart",
];

export const COLOR_MOODS = [
  "Dark & Bold", "Light & Minimal", "Colorful & Playful", "Corporate & Professional",
  "Pastel & Soft", "Luxury & Gold-accented", "Custom (see notes)",
];

export const UI_STYLES = [
  "Glassmorphism", "Flat / Minimal", "Neumorphism", "Material Design",
  "Brutalist", "Corporate Clean", "Playful / Rounded",
];

export const ANIMATION_LEVELS = ["None", "Subtle", "Moderate", "Heavy / Immersive"];

export const ANIMATION_TYPES = [
  "Scroll reveal", "Hover effects", "Page transitions", "Parallax",
  "Loading screen", "Micro-interactions", "3D elements",
];

export const DATA_TYPES = [
  "User accounts", "Product / inventory data", "Blog / content", "Bookings / orders",
  "Messages / chat", "Form submissions only",
];

export const AUTH_TYPES = ["Email & password", "Social login (Google etc.)", "Magic link", "Admin-only login"];

export const PAYMENT_METHODS = ["Stripe", "Razorpay", "PayPal", "Manual / offline"];

export const SOCIAL_PLATFORMS = [
  "Instagram", "Facebook", "X / Twitter", "LinkedIn", "YouTube",
  "TikTok", "Pinterest", "WhatsApp", "Telegram", "Other",
];

export const SEO_PRIORITIES = ["Low", "Medium", "High — organic search is the main channel"];

export const PLATFORMS = ["Responsive website only", "Website + installable PWA", "Native mobile app needed"];

export const TIMELINES = ["ASAP / rush", "1-2 weeks", "2-4 weeks", "Flexible / ongoing"];

export function emptyBrief(): Brief {
  return {
    id: crypto.randomUUID(),
    clientName: "",
    projectType: PROJECT_TYPES[0],
    pages: [],
    colorMood: COLOR_MOODS[0],
    primaryColor: "",
    uiStyle: UI_STYLES[0],
    referenceWebsites: "",
    animationLevel: ANIMATION_LEVELS[1],
    animationTypes: [],
    databaseNeeded: "No",
    dataTypes: [],
    authNeeded: "No",
    authTypes: [],
    paymentsNeeded: "No",
    paymentMethods: [],
    cmsNeeded: "No",
    fileUploads: "No",
    realtime: "No",
    socialAccountsNeeded: "No",
    socialPlatforms: [],
    socialLinks: "",
    seoPriority: SEO_PRIORITIES[1],
    multiLanguage: "No",
    platform: PLATFORMS[0],
    timeline: TIMELINES[1],
    notes: "",
  };
}

type QRowType = "text" | "yesno" | "select" | "section";

interface QRow {
  key: string;
  question: string;
  type: QRowType;
  options?: string[];
}

function hintFor(row: QRow): string {
  if (row.type === "yesno") return "Yes or No";
  if (row.type === "select") return (row.options || []).join(" | ");
  return "Free text";
}

function section(label: string): QRow {
  return { key: "", question: label, type: "section" };
}

function buildRows(): QRow[] {
  const rows: QRow[] = [];

  rows.push(section("Project Basics"));
  rows.push({ key: "clientName", question: "Your name / business name", type: "text" });
  rows.push({ key: "projectType", question: "What type of project is this?", type: "select", options: PROJECT_TYPES });

  rows.push(section("Pages Needed"));
  for (const p of PAGE_OPTIONS) {
    rows.push({ key: `pages::${p}`, question: `Do you need a "${p}" page?`, type: "yesno" });
  }

  rows.push(section("Design Direction"));
  rows.push({ key: "colorMood", question: "Color mood", type: "select", options: COLOR_MOODS });
  rows.push({
    key: "primaryColor",
    question: "Primary brand color (optional)",
    type: "text",
  });
  rows.push({ key: "uiStyle", question: "UI style", type: "select", options: UI_STYLES });
  rows.push({
    key: "referenceWebsites",
    question: "Any websites whose look you like? Paste links and what you like about each one",
    type: "text",
  });
  rows.push({
    key: "animationLevel",
    question: "How much animation do you want?",
    type: "select",
    options: ANIMATION_LEVELS,
  });
  for (const a of ANIMATION_TYPES) {
    rows.push({ key: `animationTypes::${a}`, question: `Include "${a}"?`, type: "yesno" });
  }

  rows.push(section("Accounts & Data"));
  rows.push({ key: "databaseNeeded", question: "Do you need user accounts or stored data?", type: "yesno" });
  for (const d of DATA_TYPES) {
    rows.push({ key: `dataTypes::${d}`, question: `Does that include "${d}"?`, type: "yesno" });
  }
  rows.push({ key: "authNeeded", question: "Do users need to log in?", type: "yesno" });
  for (const a of AUTH_TYPES) {
    rows.push({ key: `authTypes::${a}`, question: `Login method — "${a}"?`, type: "yesno" });
  }

  rows.push(section("Payments"));
  rows.push({ key: "paymentsNeeded", question: "Do you need to accept payments?", type: "yesno" });
  for (const p of PAYMENT_METHODS) {
    rows.push({ key: `paymentMethods::${p}`, question: `Payment method — "${p}"?`, type: "yesno" });
  }

  rows.push(section("Content & Features"));
  rows.push({ key: "cmsNeeded", question: "Do you need a blog or content section?", type: "yesno" });
  rows.push({ key: "fileUploads", question: "Will users upload files or images?", type: "yesno" });
  rows.push({
    key: "realtime",
    question: "Do you need live / real-time features (chat, live updates)?",
    type: "yesno",
  });

  rows.push(section("Social Media"));
  rows.push({
    key: "socialAccountsNeeded",
    question: "Do you want social media links/icons added to the site?",
    type: "yesno",
  });
  for (const p of SOCIAL_PLATFORMS) {
    rows.push({ key: `socialPlatforms::${p}`, question: `Include a link to your ${p} account?`, type: "yesno" });
  }
  rows.push({
    key: "socialLinks",
    question: "Paste each account's link here (one per line, next to its platform name)",
    type: "text",
  });

  rows.push(section("SEO & Platform"));
  rows.push({
    key: "seoPriority",
    question: "How important is search engine visibility?",
    type: "select",
    options: SEO_PRIORITIES,
  });
  rows.push({ key: "multiLanguage", question: "Do you need more than one language?", type: "yesno" });
  rows.push({ key: "platform", question: "Platform", type: "select", options: PLATFORMS });
  rows.push({ key: "timeline", question: "Timeline", type: "select", options: TIMELINES });

  rows.push(section("Anything Else"));
  rows.push({ key: "notes", question: "Anything else we should know?", type: "text" });

  return rows;
}

const HEADER_ROWS = 3; // title, instructions, header — data starts at row 4
const GOLD = "FFF59E0B";
const DARK_BG = "FF150F28";
const DARK_TEXT = "FFF6F4FB";
const ANSWER_FILL = "FFFFFBEB";
const ANSWER_TEXT = "FF111111";
const SECTION_BG = "FFF3E4C4";
const ZEBRA_FILL = "FFF7F7F7";

function listWsSetColumn(ws: ExcelJS.Worksheet, col: string, header: string, options: string[]) {
  ws.getCell(`${col}1`).value = header;
  options.forEach((opt, i) => {
    ws.getCell(`${col}${i + 2}`).value = opt;
  });
}

export async function downloadQuestionnaireXlsx(clientName?: string): Promise<void> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Somen Biswas";
  wb.lastModifiedBy = "Somen Biswas";
  wb.created = new Date();
  wb.modified = new Date();
  wb.title = `Project Questionnaire${clientName ? ` — ${clientName}` : ""}`;
  wb.subject = "Project Questionnaire";
  wb.company = "somenbiswas.com";
  wb.description = "Fill in the 'Your Answer' column and send this back.";

  const rows = buildRows();

  // Hidden helper sheet holding each select field's option list, so the
  // "Your Answer" cells can use a real Excel dropdown (data validation)
  // instead of relying on the client to type an option exactly.
  const listsWs = wb.addWorksheet("Lists");
  listsWs.state = "hidden";
  const LIST_COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const listColumnFor = new Map<string, string>();
  let listColIndex = 0;
  rows
    .filter((r) => r.type === "select")
    .forEach((r) => {
      const col = LIST_COLUMNS[listColIndex++];
      listColumnFor.set(r.key, col);
      listWsSetColumn(listsWs, col, r.key, r.options || []);
    });

  const ws = wb.addWorksheet("Project Questionnaire", {
    views: [{ state: "frozen", ySplit: HEADER_ROWS }],
  });

  ws.columns = [
    { key: "key", width: 4 },
    { key: "question", width: 46 },
    { key: "hint", width: 48 },
    { key: "answer", width: 32 },
  ];

  ws.mergeCells("A1:D1");
  const title = ws.getCell("A1");
  title.value = "Project Questionnaire — Somen Biswas";
  title.font = { bold: true, size: 14, color: { argb: DARK_TEXT } };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: DARK_BG } };
  ws.getRow(1).height = 26;

  ws.mergeCells("A2:D2");
  const instructions = ws.getCell("A2");
  instructions.value =
    "Please fill in the 'Your Answer' column only. For Yes/No questions, type Yes or No — leave a row blank if it doesn't apply to you. For the other questions, copy one option exactly from the 'Notes / Options' column.";
  instructions.font = { italic: true, color: { argb: "FF555555" } };
  instructions.alignment = { wrapText: true, vertical: "top" };
  ws.getRow(2).height = 34;

  const headerRow = ws.getRow(HEADER_ROWS);
  headerRow.values = ["", "Question", "Notes / Options", "Your Answer"];
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: DARK_TEXT } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GOLD } };
  });
  headerRow.height = 20;

  let dataRowIndex = 0; // counts only real question rows, for zebra striping
  let firstAnswerRowNumber: number | null = null;

  rows.forEach((r) => {
    if (r.type === "section") {
      const row = ws.addRow({ key: "", question: "", hint: "", answer: "" });
      ws.mergeCells(`B${row.number}:D${row.number}`);
      const cell = row.getCell(2);
      cell.value = r.question.toUpperCase();
      cell.font = { bold: true, size: 11, color: { argb: DARK_BG } };
      cell.alignment = { vertical: "middle" };
      row.height = 22;
      row.eachCell({ includeEmpty: true }, (c) => {
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: SECTION_BG } };
      });
      return;
    }

    const row = ws.addRow({ key: r.key, question: r.question, hint: hintFor(r), answer: "" });
    if (!firstAnswerRowNumber) firstAnswerRowNumber = row.number;

    const zebra = dataRowIndex % 2 === 1;
    dataRowIndex++;

    row.getCell(2).alignment = { wrapText: true, vertical: "top" };
    row.getCell(3).alignment = { wrapText: true, vertical: "top" };
    if (zebra) {
      row.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: ZEBRA_FILL } };
      row.getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: ZEBRA_FILL } };
    }

    const answerCell = row.getCell(4);
    answerCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ANSWER_FILL } };
    answerCell.font = { color: { argb: ANSWER_TEXT } };

    if (r.type === "yesno") {
      answerCell.dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: ['"Yes,No"'],
        showErrorMessage: true,
        errorStyle: "warning",
        errorTitle: "Invalid entry",
        error: "Please choose Yes or No from the dropdown.",
      };
    } else if (r.type === "select" && r.options?.length) {
      const col = listColumnFor.get(r.key);
      if (col) {
        answerCell.dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`Lists!$${col}$2:$${col}$${1 + r.options.length}`],
          showErrorMessage: true,
          errorStyle: "warning",
          errorTitle: "Invalid entry",
          error: "Please choose one of the listed options from the dropdown.",
        };
      }
    }

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E5E5" } },
        bottom: { style: "thin", color: { argb: "FFE5E5E5" } },
        left: { style: "thin", color: { argb: "FFE5E5E5" } },
        right: { style: "thin", color: { argb: "FFE5E5E5" } },
      };
    });
  });

  ws.getColumn(1).hidden = true;

  if (clientName && firstAnswerRowNumber) {
    ws.getCell(`D${firstAnswerRowNumber}`).note = `Prepared for ${clientName}`;
  }

  const footerRow = ws.addRow({ key: "", question: "", hint: "", answer: "" });
  ws.mergeCells(`A${footerRow.number}:D${footerRow.number}`);
  const footerCell = footerRow.getCell(1);
  footerCell.value = `Prepared by Somen Biswas · somenbiswas.com · ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`;
  footerCell.font = { italic: true, size: 9, color: { argb: "FF999999" } };
  footerRow.height = 18;

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `project-questionnaire${clientName ? `-${clientName.toLowerCase().replace(/\s+/g, "-")}` : ""}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function parseQuestionnaireXlsx(file: File): Promise<Partial<Brief>> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  const buf = await file.arrayBuffer();
  await wb.xlsx.load(buf);
  const ws = wb.getWorksheet("Project Questionnaire") || wb.worksheets[0];
  if (!ws) throw new Error("No worksheet found in this file.");

  const answers = new Map<string, string>();
  ws.eachRow((row, rowNumber) => {
    if (rowNumber <= HEADER_ROWS) return;
    const key = String(row.getCell(1).value ?? "").trim();
    const answerCell = row.getCell(4).value;
    const answer = typeof answerCell === "object" && answerCell !== null
      ? String((answerCell as { text?: string; result?: string }).text ?? (answerCell as { result?: string }).result ?? "")
      : String(answerCell ?? "");
    if (key) answers.set(key, answer.trim());
  });

  const yn = (key: string): YesNo => (answers.get(key)?.toLowerCase().startsWith("y") ? "Yes" : "No");

  const pickOption = (key: string, options: string[], fallback: string): string => {
    const raw = (answers.get(key) || "").trim().toLowerCase();
    const match = options.find((o) => o.toLowerCase() === raw);
    return match || fallback;
  };

  const multiselect = (prefix: string, options: string[]): string[] =>
    options.filter((o) => answers.get(`${prefix}::${o}`)?.toLowerCase().startsWith("y"));

  return {
    clientName: answers.get("clientName") || "",
    projectType: pickOption("projectType", PROJECT_TYPES, PROJECT_TYPES[0]),
    pages: multiselect("pages", PAGE_OPTIONS),
    colorMood: pickOption("colorMood", COLOR_MOODS, COLOR_MOODS[0]),
    primaryColor: answers.get("primaryColor") || "",
    uiStyle: pickOption("uiStyle", UI_STYLES, UI_STYLES[0]),
    referenceWebsites: answers.get("referenceWebsites") || "",
    animationLevel: pickOption("animationLevel", ANIMATION_LEVELS, ANIMATION_LEVELS[1]),
    animationTypes: multiselect("animationTypes", ANIMATION_TYPES),
    databaseNeeded: yn("databaseNeeded"),
    dataTypes: multiselect("dataTypes", DATA_TYPES),
    authNeeded: yn("authNeeded"),
    authTypes: multiselect("authTypes", AUTH_TYPES),
    paymentsNeeded: yn("paymentsNeeded"),
    paymentMethods: multiselect("paymentMethods", PAYMENT_METHODS),
    cmsNeeded: yn("cmsNeeded"),
    fileUploads: yn("fileUploads"),
    realtime: yn("realtime"),
    socialAccountsNeeded: yn("socialAccountsNeeded"),
    socialPlatforms: multiselect("socialPlatforms", SOCIAL_PLATFORMS),
    socialLinks: answers.get("socialLinks") || "",
    seoPriority: pickOption("seoPriority", SEO_PRIORITIES, SEO_PRIORITIES[1]),
    multiLanguage: yn("multiLanguage"),
    platform: pickOption("platform", PLATFORMS, PLATFORMS[0]),
    timeline: pickOption("timeline", TIMELINES, TIMELINES[1]),
    notes: answers.get("notes") || "",
  };
}
