import { useEffect, useRef, useState } from "react";

const YEARS = Array.from({ length: 126 }, (_, i) => 1900 + i); // 1900~2025
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const daysInMonth = (y, m) => new Date(y, m, 0).getDate();

export default function DOBRoulette({ onMatched }) {
  const [target, setTarget] = useState({ year: "", month: "", day: "" });
  const [rolling, setRolling] = useState(false);
  const [show, setShow] = useState({ year: 2000, month: 1, day: 1 });
  const spinRef = useRef(null);
  const startTsRef = useRef(0);

  useEffect(
    () => () => {
      if (spinRef.current) clearInterval(spinRef.current);
    },
    []
  );

  const start = () => {
    if (!(+target.year && +target.month && +target.day)) return;
    if (spinRef.current) clearInterval(spinRef.current);
    setRolling(true);
    startTsRef.current = performance.now();

    spinRef.current = setInterval(() => {
      const y = YEARS[(Math.random() * YEARS.length) | 0];
      const m = MONTHS[(Math.random() * 12) | 0];
      const d = 1 + ((Math.random() * daysInMonth(y, m)) | 0);
      setShow({ year: y, month: m, day: d });

      const hit =
        +target.year === y && +target.month === m && +target.day === d;
      const elapsed = performance.now() - startTsRef.current;
      const softTimeout =
        elapsed > 5000 && Math.random() < Math.min(1, (elapsed - 5000) / 7000);

      if (hit || softTimeout) {
        const final = hit
          ? { year: y, month: m, day: d }
          : {
              year: +target.year,
              month: +target.month,
              day: +target.day,
            };
        setShow(final);
        clearInterval(spinRef.current);
        spinRef.current = null;
        setRolling(false);
        onMatched?.(final);
      }
    }, 45);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <NumericInput
          label="연도"
          placeholder="예: 1999"
          value={target.year}
          onChange={(v) => setTarget((t) => ({ ...t, year: v }))}
        />
        <NumericInput
          label="월"
          placeholder="1~12"
          value={target.month}
          onChange={(v) => setTarget((t) => ({ ...t, month: v }))}
        />
        <NumericInput
          label="일"
          placeholder="1~31"
          value={target.day}
          onChange={(v) => setTarget((t) => ({ ...t, day: v }))}
        />
        <button onClick={start} disabled={rolling} style={btn}>
          {rolling ? "돌리는 중..." : "룰렛 시작"}
        </button>
      </div>

      <div style={{ marginTop: 12, fontSize: 22 }}>
        현재 값:{" "}
        <b>
          {show.year}-{String(show.month).padStart(2, "0")}-
          {String(show.day).padStart(2, "0")}
        </b>
      </div>
      <p style={{ color: "#888", marginTop: 6 }}>
        ※ 목표 생년월일이 랜덤으로 <u>정확히</u> 나올 때까지 돌아갑니다.
      </p>
    </div>
  );
}

function NumericInput({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 12, color: "#666" }}>{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px 10px",
          border: "1px solid #ccc",
          borderRadius: 8,
          width: 120,
        }}
      />
    </label>
  );
}

const btn = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #888",
  background: "#fff",
  cursor: "pointer",
};
