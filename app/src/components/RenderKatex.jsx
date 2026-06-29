import React from "react";
import { renderMath } from "@/utils/renderMath";
import "katex/dist/katex.min.css";

export default function RenderKatex({ text }) {
  return renderMath(text);
}
