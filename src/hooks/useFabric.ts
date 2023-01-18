import { fabric as fabricJS } from "fabric";
import { Ref, useCallback, useImperativeHandle, useRef } from "react";
import { FabricCanvas, FabricState, originalHeight, originalWidth } from "@zocket/config/fabric";

const { Canvas } = fabricJS;

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
    canvas.current = new Canvas(element, { width: originalWidth, height: originalHeight, backgroundColor: "#FFFFFF" });
    if (state) canvas.current.loadFromJSON(state, () => canvas.current!.renderAll());
    callback?.();
  }, []);

  return fabric;
}
