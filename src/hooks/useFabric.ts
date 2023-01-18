import { fabric as fabricJS } from "fabric";
import { Ref, useCallback, useImperativeHandle, useRef } from "react";
import { originalHeight, originalWidth } from "@zocket/config/fabric";
import { FabricCanvas, FabricState } from "@zocket/interfaces/fabric";

const { Canvas, Object, Textbox, Control } = fabricJS;

Textbox.prototype.setControlsVisibility({ mt: false, mb: false });

const mtr = Textbox.prototype.controls.mtr;

Textbox.prototype.controls.mtr = new Control({
  x: 0,
  y: -0.5,
  offsetY: -40,
  actionHandler: mtr.actionHandler,
  cursorStyle: "url(/rotate-cursor.svg) 8 8, auto",
  actionName: "rotate",
  withConnection: false,
});

Object.prototype.transparentCorners = false;
Object.prototype.padding = 16;
Object.prototype.cornerSize = 16;
Object.prototype.cornerStyle = "circle";
Object.prototype.borderColor = "#BE94F5";
Object.prototype.cornerColor = "#BE94F5";

interface UseFabricProps {
  ref: Ref<FabricCanvas>;
  state?: FabricState;
  callback?: () => void;
}

export function useFabric({ ref, state, callback }: UseFabricProps) {
  const canvas = useRef<FabricCanvas>(null);

  useImperativeHandle(ref, () => {
    return canvas.current;
  });

  const fabric = useCallback((element: HTMLCanvasElement) => {
    if (!element) return canvas.current?.dispose();
    canvas.current = new Canvas(element, { width: originalWidth, height: originalHeight, backgroundColor: "#FFFFFF", selection: false });
    if (state) canvas.current.loadFromJSON(state, () => canvas.current!.renderAll());
    callback?.();
  }, []);

  return fabric;
}
