import { fabric as fabricJS } from "fabric";
import { Ref, useCallback, useImperativeHandle, useRef } from "react";
import { originalHeight, originalWidth } from "@zocket/config/app";
import { FabricCanvas, FabricState } from "@zocket/interfaces/fabric";
import { Template } from "@zocket/interfaces/app";

const { Canvas } = fabricJS;

interface UseFabricProps {
  ref: Ref<FabricCanvas>;
  template?: Template;
  state?: FabricState;
  callback?: () => void;
}

export function useFabric({ ref, template, state, callback }: UseFabricProps) {
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
