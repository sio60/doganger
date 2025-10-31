import { useEffect, useRef, useState } from "react";

/**
 * 기울기(gamma: -45~+45)를 0~9로 매핑해서 현재 숫자를 선택.
 * 모바일: 장치 기울기 / iOS는 권한 필요. 데스크탑: ← → 로 이동, Enter로 추가, Backspace로 삭제.
 */
export default function PhoneTiltInput({ value, onChange, maxLen = 11 }) {
  const [perm, setPerm] = useState("unknown"); // unknown | granted | denied
  const [digit, setDigit] = useState(5); // 현재 포인터 숫자
  const [gamma, setGamma] = useState(0);
  const gammaRef = useRef(0);

  const digits = value || "";

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setDigit((d) => Math.max(0, d - 1));
      if (e.key === "ArrowRight") setDigit((d) => Math.min(9, d + 1));
      if (e.key === "Enter") lockDigit();
      if (e.key === "Backspace") backspace();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, []);

  const askPermission = async () => {
    if (
      typeof window === "undefined" ||
      typeof DeviceOrientationEvent === "undefined"
    ) {
      setPerm("denied");
      return;
    }
    try {
      // iOS
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== "granted") throw new Error("not granted");
      }
      window.addEventListener("deviceorientation", onOrientation, true);
      setPerm("granted");
    } catch (e) {
      setPerm("denied");
    }
  };

  const onOrientation = (e) => {
    const g = typeof e.gamma === "number" ? e.gamma : 0; // -90~+90
    gammaRef.current = g;
    setGamma(g);
    const d = mapGammaToDigit(g);
    setDigit(d);
  };

  function mapGammaToDigit(g) {
    // clamp -45..+45 -> 0..9
    const clamped = Math.max(-45, Math.min(45, g));
    const t = (clamped + 45) / 90; // 0..1
    return Math.round(t * 9);
  }

  const lockDigit = () => {
    if (digits.length >= maxLen) return;
    onChange(String(digits + digit));
  };

  const backspace = () => onChange(digits.slice(0, -1));
  const reset = () => onChange("");

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <button onClick={askPermission} style={btnSmall}>
          {perm === "granted"
            ? "기울기: 허용됨"
            : perm === "denied"
            ? "기울기: 불가"
            : "기울기 허용"}
        </button>
        <div style={{ fontSize: 14, color: "#666" }}>
          γ(gamma): {gamma.toFixed(1)}° → 현재 선택: <b>{digit}</b>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: 6,
          marginTop: 8,
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              padding: "8px 0",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: 8,
              background: i === digit ? "#111" : "#fff",
              color: i === digit ? "#fff" : "#111",
            }}
          >
            {i}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={lockDigit} style={btn}>
          현재 숫자 추가(Enter)
        </button>
        <button onClick={backspace} style={{ ...btn, marginLeft: 8 }}>
          지우기(Backspace)
        </button>
        <button onClick={reset} style={{ ...btn, marginLeft: 8 }}>
          초기화
        </button>
      </div>

      <div style={{ marginTop: 8, fontSize: 18 }}>
        입력된 번호: <b>{digits || "(없음)"}</b>
      </div>
      <p style={{ color: "#888", marginTop: 4 }}>
        ※ 최대 {maxLen}자리. 모바일은 기울기, PC는 키보드로 조작.
      </p>
    </div>
  );
}

const btn = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #888",
  background: "#fff",
  cursor: "pointer",
};
const btnSmall = {
  padding: "6px 8px",
  borderRadius: 8,
  border: "1px solid #bbb",
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
};
