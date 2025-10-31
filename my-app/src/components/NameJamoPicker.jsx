import { useMemo, useState } from "react";

// 초중종 배열
const L = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const V = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
  "ㅠ",
];
const T = [
  "(없음)",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const SBase = 0xac00,
  VCount = 21,
  TCount = 28,
  NCount = VCount * TCount;
function makeChar(l, v, t) {
  if (l < 0 || v < 0) return "";
  const code = SBase + l * NCount + v * TCount + (t > 0 ? t : 0);
  return String.fromCharCode(code);
}

export default function MultiSyllableNamePicker({ onChange }) {
  // 각 칸의 자모 인덱스를 배열로 관리 [0~3칸]
  const [syllables, setSyllables] = useState([
    { l: 0, v: 0, t: 0 },
    { l: 0, v: 0, t: 0 },
    { l: 0, v: 0, t: 0 },
    { l: 0, v: 0, t: 0 },
  ]);

  const update = (i, key, val) => {
    const next = [...syllables];
    next[i][key] = val;
    setSyllables(next);
    if (onChange) {
      const result = next.map((s) => makeChar(s.l, s.v, s.t)).join("");
      onChange(result);
    }
  };

  return (
    <div style={wrap}>
      {syllables.map((s, i) => (
        <div key={i} style={syllableBox}>
          <label style={label}>#{i + 1}</label>
          <select
            className="jamo-select"
            value={s.l}
            onChange={(e) => update(i, "l", +e.target.value)}
          >
            {L.map((ch, idx) => (
              <option key={idx} value={idx}>
                {ch}
              </option>
            ))}
          </select>
          <select
            className="jamo-select"
            value={s.v}
            onChange={(e) => update(i, "v", +e.target.value)}
          >
            {V.map((ch, idx) => (
              <option key={idx} value={idx}>
                {ch}
              </option>
            ))}
          </select>
          <select
            className="jamo-select"
            value={s.t}
            onChange={(e) => update(i, "t", +e.target.value)}
          >
            {T.map((ch, idx) => (
              <option key={idx} value={idx}>
                {ch}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

/* 스타일 */
const wrap = {
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
  marginTop: 12,
};

const syllableBox = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 12,
  background: "#f9fafe",
};

const label = {
  fontWeight: 600,
  fontSize: 13,
  marginBottom: 2,
};
