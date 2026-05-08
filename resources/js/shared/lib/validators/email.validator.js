export default function emailValidator(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}
