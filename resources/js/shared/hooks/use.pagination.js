import { useState } from "react";

export default function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);
  return { page, setPage, nextPage: () => setPage((p) => p + 1), prevPage: () => setPage((p) => Math.max(1, p - 1)) };
}
