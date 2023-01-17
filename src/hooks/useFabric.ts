import { fabric as fabricJS } from "fabric";
import { Ref, useCallback, useImperativeHandle, useRef } from "react";
import { FabricCanvas, originalHeight, originalWidth } from "@zocket/config/fabric";

const { Canvas } = fabricJS;

export function useFabric(ref: Ref<FabricCanvas>) {
  const canvas = useRef<FabricCanvas>(null);

  useImperativeHandle(ref, () => {
    return canvas.current;
  });

  const fabric = useCallback((element: HTMLCanvasElement) => {
    if (!element) return canvas.current?.dispose();
    canvas.current = new Canvas(element, { width: originalWidth, height: originalHeight, backgroundColor: "#FFFFFF" });
  }, []);

  return fabric;
}
