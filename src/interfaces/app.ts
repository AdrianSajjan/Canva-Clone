export type Template = FabricTemplate | undefined | null;

export interface FabricTemplate {
  background: TemplateBackground;
  state: Array<TemplateState>;
}

export interface TemplateBackground {
  type: "image" | "color" | "video";
  value: string;
}

export interface TemplateState {
  type: "textbox" | "image" | "rect";
  name: string;
  details: any;
  value?: string;
}
