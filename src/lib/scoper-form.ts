export type YesNo = "Yes" | "No";

export interface Brief {
  id: string;
  clientName: string;
  projectType: string;
  pages: string[];
  colorMood: string;
  primaryColor: string;
  uiStyle: string;
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
    seoPriority: SEO_PRIORITIES[1],
    multiLanguage: "No",
    platform: PLATFORMS[0],
    timeline: TIMELINES[1],
    notes: "",
  };
}

interface QRow {
  key: string;
  question: string;
  hint: string;
}

function buildRows(): QRow[] {
  const rows: QRow[] = [];
  rows.push({ key: "clientName", question: "Your name / business name", hint: "Free text" });
  rows.push({ key: "projectType", question: "What type of project is this?", hint: PROJECT_TYPES.join(" | ") });
  for (const p of PAGE_OPTIONS) {
    rows.push({ key: `pages::${p}`, question: `Do you need a "${p}" page?`, hint: "Yes or No" });
  }
  rows.push({ key: "colorMood", question: "Color mood", hint: COLOR_MOODS.join(" | ") });
  rows.push({
    key: "primaryColor",
    question: "Primary brand color (optional)",
    hint: "Hex code or a color name, e.g. #f59e0b or 'deep violet'",
  });
  rows.push({ key: "uiStyle", question: "UI style", hint: UI_STYLES.join(" | ") });
  rows.push({ key: "animationLevel", question: "How much animation do you want?", hint: ANIMATION_LEVELS.join(" | ") });
  for (const a of ANIMATION_TYPES) {
    rows.push({ key: `animationTypes::${a}`, question: `Include "${a}"?`, hint: "Yes or No" });
  }
  rows.push({ key: "databaseNeeded", question: "Do you need user accounts or stored data?", hint: "Yes or No" });
  for (const d of DATA_TYPES) {
    rows.push({ key: `dataTypes::${d}`, question: `Does that include "${d}"?`, hint: "Yes or No" });
  }
  rows.push({ key: "authNeeded", question: "Do users need to log in?", hint: "Yes or No" });
  for (const a of AUTH_TYPES) {
    rows.push({ key: `authTypes::${a}`, question: `Login method — "${a}"?`, hint: "Yes or No" });
  }
  rows.push({ key: "paymentsNeeded", question: "Do you need to accept payments?", hint: "Yes or No" });
  for (const p of PAYMENT_METHODS) {
    rows.push({ key: `paymentMethods::${p}`, question: `Payment method — "${p}"?`, hint: "Yes or No" });
  }
  rows.push({ key: "cmsNeeded", question: "Do you need a blog or content section?", hint: "Yes or No" });
  rows.push({ key: "fileUploads", question: "Will users upload files or images?", hint: "Yes or No" });
  rows.push({
    key: "realtime",
    question: "Do you need live / real-time features (chat, live updates)?",
    hint: "Yes or No",
  });
  rows.push({ key: "seoPriority", question: "How important is search engine visibility?", hint: SEO_PRIORITIES.join(" | ") });
  rows.push({ key: "multiLanguage", question: "Do you need more than one language?", hint: "Yes or No" });
  rows.push({ key: "platform", question: "Platform", hint: PLATFORMS.join(" | ") });
  rows.push({ key: "timeline", question: "Timeline", hint: TIMELINES.join(" | ") });
  rows.push({ key: "notes", question: "Anything else we should know?", hint: "Free text" });
  return rows;
}

const HEADER_ROWS = 3; // title, instructions, header — data starts at row 4
const GOLD = "FFF59E0B";
const DARK_BG = "FF150F28";
const DARK_TEXT = "FFF6F4FB";
const ANSWER_FILL = "FFFFFBEB";
const ANSWER_TEXT = "FF111111";

export async function downloadQuestionnaireXlsx(clientName?: string): Promise<void> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Somen Biswas";
  wb.created = new Date();

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

  const rows = buildRows();
  rows.forEach((r) => {
    const row = ws.addRow({ key: r.key, question: r.question, hint: r.hint, answer: "" });
    row.getCell(2).alignment = { wrapText: true, vertical: "top" };
    row.getCell(3).alignment = { wrapText: true, vertical: "top" };
    row.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: ANSWER_FILL } };
    row.getCell(4).font = { color: { argb: ANSWER_TEXT } };
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

  if (clientName) {
    ws.getCell(`D${HEADER_ROWS + 1}`).note = `Prepared for ${clientName}`;
  }

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
  const ws = wb.worksheets[0];
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
    seoPriority: pickOption("seoPriority", SEO_PRIORITIES, SEO_PRIORITIES[1]),
    multiLanguage: yn("multiLanguage"),
    platform: pickOption("platform", PLATFORMS, PLATFORMS[0]),
    timeline: pickOption("timeline", TIMELINES, TIMELINES[1]),
    notes: answers.get("notes") || "",
  };
}
