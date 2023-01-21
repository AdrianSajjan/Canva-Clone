export type Scene = Array<SceneObject>;

export interface SceneObject {
  type: string;
  name: string;
  details: any;
  animation: Animation;
}

export interface Animation {
  entryTime: number;
  entryAnim?: string;
  hasExitTime: boolean;
  exitTime: number;
  exitAnim?: string;
}
