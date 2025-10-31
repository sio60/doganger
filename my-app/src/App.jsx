import { useState } from "react";
import Signup from "./pages/Signup.jsx";

export default function App() {
  const [screen, setScreen] = useState("home"); // home | signup | success
  const [lastUser, setLastUser] = useState(null);

  return (
    <div
      style={{
        fontFamily: "system-ui, Apple SD Gothic Neo, Noto Sans KR",
        padding: 24,
      }}
    >
      {screen === "home" && (
        <section>
          <h1 style={{ marginBottom: 8 }}>데모 홈</h1>
          <p style={{ color: "#666", marginBottom: 16 }}>
            이 페이지는 화면 전환만 합니다. 실제 회원가입 플로우는{" "}
            <b>Signup.jsx</b>에 있어요.
          </p>
          <button onClick={() => setScreen("signup")} style={btnPrimary}>
            회원가입 하러 가기
          </button>
        </section>
      )}

      {screen === "signup" && (
        <Signup
          onCancel={() => setScreen("home")}
          onSuccess={(user) => {
            setLastUser(user);
            setScreen("success");
          }}
        />
      )}

      {screen === "success" && (
        <section>
          <h1>가입 완료</h1>
          <p style={{ color: "#2a7" }}>🎉 정말 어렵게 성공했네요…</p>
          <pre style={pre}>{JSON.stringify(lastUser, null, 2)}</pre>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setScreen("signup")} style={btnSecondary}>
              다시 가입해보기
            </button>
            <button
              onClick={() => setScreen("home")}
              style={{ ...btnSecondary, marginLeft: 8 }}
            >
              홈으로
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

const btnPrimary = {
  padding: "12px 16px",
  borderRadius: 10,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
};

const btnSecondary = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #888",
  background: "#fff",
  cursor: "pointer",
};

const pre = {
  whiteSpace: "pre-wrap",
  background: "#0f0f0f",
  color: "#cfe",
  padding: 12,
  borderRadius: 8,
  maxHeight: 260,
  overflow: "auto",
};
