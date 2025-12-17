import { useMemo, useState } from "react";

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
……と言いたいところだが、昨今のセキュリティ意識の高まりを受け、今年からは私たちサンタも２段階認証を取り入れることになった。
大丈夫！ 君が本人なら簡単解ける問題だ。ほんの数問さ。
それではがんばってくれたまえ！

サンタクロース日本支部 代表
三田 黒臼`,
    buttonLabel: "試練を開始する",
  },
  {
    kind: "auth",
    title: "第一認証",
    body: `ある筋肉質な妖精が持っている道具`,
    pass: "MUTSUMI",
  },
  {
    kind: "auth",
    title: "第二認証",
    body: `天井に閉ざされた小さな湖`,
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

export default function App() {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const step = steps[idx];

  const containerStyle: React.CSSProperties = {
    maxWidth: 720,
    margin: "40px auto",
    padding: 16,
    lineHeight: 1.7,
  };

  const cardStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 16,
  };

  const bodyText = useMemo(() => step.body, [step]);

  function next() {
    setError(null);
    setInput("");
    setIdx((v) => Math.min(v + 1, steps.length - 1));
  }

  function submitAuth(expected: string) {
    setError(null);
    const normalized = input.trim().toUpperCase();
    if (normalized !== expected) {
      setError("PASS が違います。");
      return;
    }
    next();
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: 12 }}>サンタの試練</h1>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>{step.title}</h2>

        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{bodyText}</pre>

        <div style={{ marginTop: 16 }}>
          {step.kind === "intro" && (
            <button onClick={next}>{step.buttonLabel}</button>
          )}

          {step.kind === "auth" && (
            <>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  type="password"
                  placeholder="PASS"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitAuth(step.pass);
                  }}
                  style={{ flex: 1, padding: "8px 10px" }}
                  autoFocus
                />
                <button onClick={() => submitAuth(step.pass)}>次へ</button>
              </div>
              {error && <p style={{ marginTop: 8, color: "red" }}>{error}</p>}
            </>
          )}

          {step.kind === "final" && (
            <p style={{ marginTop: 16 }}>（入力は不要です。家の中を探してください。）</p>
          )}
        </div>
      </div>
    </div>
  );
}
