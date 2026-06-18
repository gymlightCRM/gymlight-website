import nodemailer from "nodemailer";

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export interface CareerApplicationPayload {
  name: string;
  phone: string;
  email: string;
  center: string;
  position: string;
  message: string;
  portfolio?: {
    filename: string;
    content: Buffer;
    contentType: string;
  };
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP 설정이 필요합니다.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function validatePortfolioFile(file: File): string | null {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return "포트폴리오 파일은 10MB 이하여야 합니다.";
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return "PDF, ZIP, DOC, DOCX, JPG, PNG, WEBP 파일만 첨부 가능합니다.";
  }
  return null;
}

export async function sendCareerApplication(
  payload: CareerApplicationPayload,
): Promise<void> {
  const to = process.env.CAREERS_TO_EMAIL;
  if (!to) {
    throw new Error("CAREERS_TO_EMAIL 설정이 필요합니다.");
  }

  const transporter = getTransporter();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  const attachments = payload.portfolio
    ? [
        {
          filename: payload.portfolio.filename,
          content: payload.portfolio.content,
          contentType: payload.portfolio.contentType,
        },
      ]
    : [];

  await transporter.sendMail({
    from: `"짐라이트 채용" <${from}>`,
    to,
    replyTo: payload.email,
    subject: `[짐라이트 채용] ${payload.position} · ${payload.center} · ${payload.name}`,
    text: [
      "짐라이트 홈페이지 채용 지원",
      "",
      `이름: ${payload.name}`,
      `연락처: ${payload.phone}`,
      `이메일: ${payload.email}`,
      `희망 지점: ${payload.center}`,
      `지원 포지션: ${payload.position}`,
      "",
      "── 자기소개 / 메시지 ──",
      payload.message || "(없음)",
    ].join("\n"),
    attachments,
  });
}
