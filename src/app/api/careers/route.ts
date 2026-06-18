import { NextResponse } from "next/server";
import { centers } from "@/data/centers";
import {
  sendCareerApplication,
  validatePortfolioFile,
  type CareerApplicationPayload,
} from "@/lib/email";

export const runtime = "nodejs";

const POSITIONS = new Set(["트레이너", "FC", "아르바이트"]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const centerId = String(formData.get("centerId") ?? "").trim();
    const position = String(formData.get("position") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const portfolio = formData.get("portfolio");

    if (!name || !phone || !email || !centerId || !position) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해 주세요." },
        { status: 400 },
      );
    }

    if (!POSITIONS.has(position)) {
      return NextResponse.json(
        { error: "올바른 지원 포지션을 선택해 주세요." },
        { status: 400 },
      );
    }

    const center =
      centerId === "any"
        ? "전 지점 / 상관없음"
        : centers.find((c) => c.id === centerId)?.name;

    if (!center) {
      return NextResponse.json(
        { error: "올바른 지점을 선택해 주세요." },
        { status: 400 },
      );
    }

    let attachment: CareerApplicationPayload["portfolio"];

    if (portfolio instanceof File && portfolio.size > 0) {
      const fileError = validatePortfolioFile(portfolio);
      if (fileError) {
        return NextResponse.json({ error: fileError }, { status: 400 });
      }
      const buffer = Buffer.from(await portfolio.arrayBuffer());
      attachment = {
        filename: portfolio.name,
        content: buffer,
        contentType: portfolio.type,
      };
    }

    await sendCareerApplication({
      name,
      phone,
      email,
      center,
      position,
      message,
      portfolio: attachment,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[careers/apply]", error);
    const message =
      error instanceof Error && error.message.includes("SMTP")
        ? "메일 서버 설정을 확인해 주세요."
        : "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
