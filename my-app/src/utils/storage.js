const ATTEMPTS_KEY = "signup_attempts";
const SUCCESS_KEY = "signup_success";

export function saveAttempt(payload) {
  const arr = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
  arr.push(payload);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(arr));
}

export function saveSuccess(payload) {
  const arr = JSON.parse(localStorage.getItem(SUCCESS_KEY) || "[]");
  arr.push(payload);
  localStorage.setItem(SUCCESS_KEY, JSON.stringify(arr));
}

export function loadAll() {
  return {
    attempts: JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]"),
    success: JSON.parse(localStorage.getItem(SUCCESS_KEY) || "[]"),
  };
}
