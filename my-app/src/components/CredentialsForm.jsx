export default function CredentialsForm({ value, onChange }) {
  const { username = "", password = "" } = value || {};
  const setField = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <LabeledInput
        label="아이디"
        value={username}
        onChange={(v) => setField("username", v)}
        placeholder="아이디"
      />
      <LabeledInput
        label="비밀번호"
        type="password"
        value={password}
        onChange={(v) => setField("password", v)}
        placeholder="비밀번호"
      />
    </div>
  );
}

function LabeledInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 12, color: "#666" }}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px 10px",
          border: "1px solid #ccc",
          borderRadius: 8,
          width: 220,
        }}
      />
    </label>
  );
}
