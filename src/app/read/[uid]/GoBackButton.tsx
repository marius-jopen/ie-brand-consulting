"use client";

import { useRouter } from "next/navigation";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors"
    >
      <span aria-hidden className="relative -top-px">←</span> Go back
    </button>
  );
}
