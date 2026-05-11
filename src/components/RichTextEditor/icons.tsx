import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  List,
  ListOrdered,
  Paperclip,
  Braces,
  Plus,
  X,
} from "lucide-react";

export const Icons = {
  bold: Bold,
  italic: Italic,
  underline: Underline,
  alignLeft: AlignLeft,
  bullets: List,
  numbered: ListOrdered,
  attachment: Paperclip,
  braces: Braces,
  plus: Plus,
  close: X,
} as const;

export type ToolbarIconName = keyof typeof Icons;
