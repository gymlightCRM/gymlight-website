"use client";

import { useState } from "react";
import { centers } from "@/data/centers";

const POSITIONS = ["트레이너", "FC", "아르바이트"] as const;

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#39FF14]/50 focus:ring-1 focus:ring-[#39FF14]/30";

export default function CareerApplicationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };

      if (!res.ok) {
        setErrorMsg(data.error ?? "접수에 실패했습니다.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-[#39FF14]/30 bg-[#39FF14]/10 p-8 text-center">
        <p className="text-2xl">✓</p>
        <h3 className="mt-3 text-lg font-bold text-[#39FF14]">접수 완료</h3>
        <p className="mt-2 text-sm text-white/60">
          지원서가 접수되었습니다. 검토 후 연락드리겠습니다.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-white/50 underline hover:text-white"
        >
          추가 지원하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="이름" required>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="홍길동"
            className={inputClass}
          />
        </Field>
        <Field label="연락처" required>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="010-0000-0000"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="이메일" required>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="example@email.com"
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="희망 지점" required>
          <select name="centerId" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              지점 선택
            </option>
            <option value="any">전 지점 / 상관없음</option>
            {centers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.number} {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="지원 포지션" required>
          <select name="position" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              포지션 선택
            </option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="자기소개 / 메시지">
        <textarea
          name="message"
          rows={4}
          placeholder="경력, 자격증, 근무 가능 시간 등을 간단히 작성해 주세요."
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field label="포트폴리오 첨부">
        <input
          name="portfolio"
          type="file"
          accept=".pdf,.zip,.doc,.docx,.jpg,.jpeg,.png,.webp"
          className="w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-[#39FF14] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:opacity-90"
        />
        <p className="mt-2 text-xs text-white/35">
          PDF, ZIP, DOC, JPG, PNG · 최대 10MB
        </p>
      </Field>

      {status === "error" && errorMsg && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-[#39FF14] py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "접수 중…" : "지원서 접수"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium tracking-wider text-white/50 uppercase">
        {label}
        {required && <span className="ml-1 text-[#39FF14]">*</span>}
      </span>
      {children}
    </label>
  );
}
