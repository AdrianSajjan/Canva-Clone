import { originalHeight, originalWidth } from "@zocket/config/app";
import { FabricStaticCanvas } from "@zocket/interfaces/fabric";
import { fabric as fabricJS } from "fabric";
import { Ref, useCallback, useImperativeHandle, useRef } from "react";

const { StaticCanvas } = fabricJS;

interface UseFabricProps {
  ref: Ref<FabricStaticCanvas>;
}

export function usePreview({ ref }: UseFabricProps) {
  const canvas = useRef<FabricStaticCanvas>(null);

  useImperativeHandle(ref, () => {
    return canvas.current;
  });

  const fabric = useCallback((element: HTMLCanvasElement) => {
    if (!element) return canvas.current?.dispose();
    canvas.current = new StaticCanvas(element, { width: originalWidth, height: originalHeight, backgroundColor: "#FFFFFF", selection: false });
  }, []);

  return fabric;
}
