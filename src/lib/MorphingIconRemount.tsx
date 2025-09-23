"use client";

import { FC, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MorphingIcon, { type MorphingIconProps } from "@/lib/MorphingIcon";

function normalizeKeyword(input?: string | null): string {
  if (!input) return "default";
  const k = input.toString().trim().toLowerCase();
  if (!k) return "default";
  if (k === "design") return "design-1";
  if (k === "marketing") return "marketing-2";
  if (k === "strategy") return "strategy-3";
  return k;
}

type Props = MorphingIconProps;

const MorphingIconRemount: FC<Props> = (props) => {
  const pathname = usePathname() || "";
  const keyStr = `${pathname}-${normalizeKeyword(props.keyword)}`;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <MorphingIcon key={keyStr} {...props} />;
};

export default MorphingIconRemount;


