"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";
import ToggleMorphingIcon, { type ToggleMorphingIconProps } from "@/lib/ToggleMorphingIcon";

type Props = ToggleMorphingIconProps;

const ToggleMorphingIconRemount: FC<Props> = (props) => {
  const pathname = usePathname() || "";
  const keyStr = `${pathname}-${props.firstId ?? "first"}-${props.secondId ?? "second"}`;
  return <ToggleMorphingIcon key={keyStr} {...props} />;
};

export default ToggleMorphingIconRemount;


