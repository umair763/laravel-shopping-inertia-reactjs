export default function passwordValidator(value) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value || "");
}
