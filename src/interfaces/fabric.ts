export type FabricCanvas = fabric.Canvas | null;
export type FabricEvent = fabric.IEvent<MouseEvent>;

export interface FabricState {
  version: string;
  objects: fabric.Object[];
}

export type FabricStates = Array<FabricState>;
export type FabricObject = fabric.Object;
export type FabricTextbox = fabric.Textbox;

export type TextboxKeys = keyof fabric.Textbox;
export type ObjectKeys = keyof fabric.Object;

export interface FabricSelectedState {
  status: boolean;
  type: string;
  details: any;
}
