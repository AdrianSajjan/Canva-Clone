export type Template = FabricTemplate | undefined | null;

export interface FabricTemplate {
  index: string;
  source: string;
  thumbnail?: string;
  background: "image" | "color" | "video";
  state: Array<TemplateState>;
}

export interface TemplateState {
  type: "textbox" | "image" | "rect";
  name: string;
  details: any;
  value?: string;
}
