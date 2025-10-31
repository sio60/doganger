import { useState } from "react";
import NameJamoPicker from "../components/NameJamoPicker.jsx";
import DOBRoulette from "../components/DOBRoulette.jsx";
import PhoneTiltInput from "../components/PhoneTiltInput.jsx";
import CredentialsForm from "../components/CredentialsForm.jsx";
import { saveAttempt, saveSuccess } from "../utils/storage.js";

export default function Signup({ onCancel, onSuccess }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState(null); // {year, month, day}
  const [phone, setPhone] = useState("");
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("");

  const canSubmit =
    !!name &&
    !!dob &&
    (phone || "").replace(/\D/g, "").length >= 10 &&
    !!creds.username &&
    !!creds.password;

  const onSubmit = () => {
    const payload = {
      name,
      dob: dob
        ? `${dob.year}-${String(dob.month).padStart(2, "0")}-${String(
            dob.day
          ).padStart(2, "0")}`
        : "",
      phone,
      username: creds.username,
      createdAt: new Date().toISOString(),
    };
    saveAttempt(payload);

    // 요구했던 구조(20% 성공)는 유지하되, 문구는 일반 서비스처럼.
    const ok = Math.random() < 0.2;
    if (ok) {
      saveSuccess(payload);
      setStatus("가입이 완료되었습니다.");
      onSuccess?.(payload);
    } else {
      setStatus("일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <header style={header}>
          <h1 style={title}>회원가입</h1>
          <button onClick={onCancel} style={ghostBtn}>
            ← 홈으로
          </button>
        </header>

        <div style={grid}>
          <div style={col}>
            <label style={label}>이름 만들기</label>
            <NameJamoPicker value={name} onChange={setName} />
          </div>

          <div style={col}>
            <label style={label}>생년월일</label>
            <DOBRoulette onMatched={setDob} />
            <div
              style={{
                marginTop: 8,
                color: dob ? "#0a7a4b" : "#808080",
                fontSize: 14,
              }}
            >
              {dob
                ? `선택됨: ${dob.year}-${String(dob.month).padStart(
                    2,
                    "0"
                  )}-${String(dob.day).padStart(2, "0")}`
                : "목표 생년월일과 랜덤 값이 일치하면 선택됩니다."}
            </div>
          </div>

          <div style={col}>
            <label style={label}>전화번호</label>
            <PhoneTiltInput value={phone} onChange={setPhone} />
          </div>

          <div style={col}>
            <label style={label}>계정 정보</label>
            <CredentialsForm value={creds} onChange={setCreds} />
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <button
            disabled={!canSubmit}
            onClick={onSubmit}
            style={canSubmit ? primaryBtn : disabledBtn}
          >
            회원가입
          </button>
          {status && (
            <div style={{ marginTop: 10, fontSize: 14, color: "#333" }}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- styles ---- */
const page = {
  minHeight: "100vh",
  background: "#f5f7fb",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: "40px 16px",
};

const card = {
  width: "min(920px, 100%)",
  background: "#fff",
  border: "1px solid #e6e8ef",
  borderRadius: 14,
  boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  padding: "22px 22px 26px",
};

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
};

const title = { margin: 0, fontSize: 20, fontWeight: 700 };

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
};

const col = {
  border: "1px solid #eef0f5",
  borderRadius: 12,
  padding: 16,
  background: "#fafbff",
};

const label = {
  display: "block",
  fontSize: 13,
  color: "#5a5f6b",
  marginBottom: 8,
  fontWeight: 600,
};

const ghostBtn = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #d7dbe6",
  background: "#fff",
  cursor: "pointer",
};

const primaryBtn = {
  padding: "12px 16px",
  borderRadius: 10,
  border: "1px solid #0a7a4b",
  background: "#0a7a4b",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const disabledBtn = {
  ...primaryBtn,
  background: "#dfe3ea",
  border: "1px solid #dfe3ea",
  color: "#9aa3b2",
  cursor: "not-allowed",
};
