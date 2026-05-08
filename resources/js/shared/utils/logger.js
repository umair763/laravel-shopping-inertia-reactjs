export default function logger(...args) {
  if (import.meta.env.DEV) {
    console.log("[BazaarDeck]", ...args);
  }
}
