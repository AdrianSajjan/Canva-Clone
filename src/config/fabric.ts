export const originalWidth = 1920;
export const originalHeight = 1080;

export const maxUndoRedoSteps = 5;

export type FabricCanvas = fabric.Canvas | null;
export type FabricModifiedEvent = fabric.IEvent<MouseEvent>;

export interface FabricState {
  version: string;
  objects: fabric.Object[];
}

export type FabricStates = Array<FabricState>;
