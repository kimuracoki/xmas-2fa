import { useMemo, useState } from "react";

/* =======================
   データ定義
======================= */

type Step =
  | { kind: "intro"; title: string; body: string; buttonLabel: string }
  | { kind: "auth"; title: string; body: string; pass: string }
  | { kind: "final"; title: string; body: string };

const steps: Step[] = [
  {
    kind: "intro",
    title: "サンタからの通知",
    body: `松原令佳 殿

メリークリスマス！
１年いい子にしていた君にクリスマスプレゼント！
……と言いたいところだが、昨今のセキュリティ意識の高まりを受け、
今年からは私たちサンタも２段階認証を取り入れることになった。

大丈夫！ 君が本人なら簡単解ける問題だ。ほんの数問さ。
それではがんばってくれたまえ！

サンタクロース日本支部　代表
三田 黒臼`,
    buttonLabel: "試練を開始する",
  },
  {
    kind: "auth",
    title: "第一認証",
    body: "ある筋肉質な妖精が持っている道具",
    pass: "MUTSUMI",
  },
  {
    kind: "auth",
    title: "第二認証",
    body: "天井に閉ざされた小さな湖",
    pass: "SMALLLAKE",
  },
  {
    kind: "final",
    title: "最終認証",
    body: `これが最後の問題。
空っぽの物語に君への贈り物を閉じ込めた。
見つけ出すことができれば、それは君のものだ。`,
  },
];

/* =======================
   メイン
======================= */

export default function App() {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const step = steps[idx];
  const bodyText = useMemo(() => step.body, [step]);

  function next() {
    setError(null);
    setInput("");
    setIdx((v) => Math.min(v + 1, steps.length - 1));
  }

  function submitAuth(expected: string) {
    setError(null);
    if (input.trim().toUpperCase() !== expected) {
      setError("PASS が違います。");
      return;
    }
    next();
  }

  return (
    <div style={styles.page}>
      <Snow />

      <div style={styles.wrap}>
        <header style={styles.header}>
          <h1 style={styles.h1}>サンタの試練</h1>
          <p style={styles.sub}>二段階認証を突破せよ</p>
        </header>

        <main style={styles.card}>
          <h2 style={styles.h2}>{step.title}</h2>

          <pre style={styles.pre}>{bodyText}</pre>

          {step.kind === "intro" && (
            <button style={styles.primaryBtn} onClick={next}>
              {step.buttonLabel}
            </button>
          )}

          {step.kind === "auth" && (
            <div style={styles.formBlock}>
              <label style={styles.label}>PASS（大文字）</label>
              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value.toUpperCase())
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitAuth(step.pass);
                }}
                style={styles.input}
                placeholder="例：XXXXXXX"
                autoFocus
              />
              <button
                style={styles.primaryBtn}
                onClick={() => submitAuth(step.pass)}
              >
                次へ
              </button>
              {error && <div style={styles.errorBox}>{error}</div>}
            </div>
          )}

          {step.kind === "final" && (
            <div style={styles.finalBox}>
              <strong>入力は不要です。</strong>
              <div>家の中を探してください。</div>
            </div>
          )}
        </main>

        <footer style={styles.footer}>
          <span style={styles.footerText}>
            © Santa Claus JP Branch
          </span>
        </footer>
      </div>
    </div>
  );
}

/* =======================
   雪エフェクト
======================= */

function Snow() {
  const flakes = Array.from({ length: 60 });

  return (
    <div style={snow.layer} aria-hidden>
      {flakes.map((_, i) => {
        const size = 2 + Math.random() * 4;
        const left = Math.random() * 100;
        const duration = 6 + Math.random() * 8;
        const delay = Math.random() * 6;
        const drift = (Math.random() * 20 - 10).toFixed(1);

        return (
          <span
            key={i}
            style={{
              ...snow.flake,
              left: `${left}%`,
              width: size,
              height: size,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              ["--drift" as any]: `${drift}vw`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes snow {
          from { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 1; }
          to { transform: translate(var(--drift), 110vh); }
        }
      `}</style>
    </div>
  );
}

const snow: Record<string, React.CSSProperties> = {
  layer: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    overflow: "hidden",
  },
  flake: {
    position: "absolute",
    top: "-10vh",
    borderRadius: "50%",
    background: "white",
    opacity: 0.9,
    animationName: "snow",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
};

/* =======================
   スタイル（全部）
======================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    background: "linear-gradient(180deg,#0b3d2e,#0e4a35)",
    padding: 16,
  },
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    display: "grid",
    gap: 14,
    position: "relative",
    zIndex: 1,
  },
  header: { color: "#fff" },
  h1: { margin: 0, fontSize: 26 },
  sub: { margin: "4px 0 0", fontSize: 13, opacity: 0.8 },
  card: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: 18,
    padding: 16,
    display: "grid",
    gap: 12,
    border: "1px solid #d4af37",
    boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
  },
  h2: { margin: 0, color: "#0b3d2e" },
  pre: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.8,
    padding: 12,
    borderRadius: 14,
    background: "rgba(11,61,46,0.06)",
    border: "1px solid rgba(11,61,46,0.15)",
    color: "#0b3d2e",
  },
  formBlock: { display: "grid", gap: 8 },
  label: { fontSize: 12, color: "#0b3d2e" },
  input: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    fontSize: 18,
    padding: "14px",
    borderRadius: 14,
    border: "2px solid #0b3d2e",
    letterSpacing: "0.08em",
    fontWeight: 700,
  },
  primaryBtn: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: 14,
    background: "#c62828",
    color: "#fff",
    fontWeight: 800,
    border: "1px solid #b71c1c",
  },
  errorBox: {
    padding: 10,
    borderRadius: 12,
    background: "rgba(198,40,40,0.1)",
    color: "#b71c1c",
    fontWeight: 700,
  },
  finalBox: {
    padding: 14,
    borderRadius: 14,
    background: "rgba(212,175,55,0.15)",
    border: "1px solid #d4af37",
    color: "#0b3d2e",
  },
  footer: { textAlign: "center" },
  footerText: { fontSize: 11, color: "rgba(255,255,255,0.7)" },
};