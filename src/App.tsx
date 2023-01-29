import "@zocket/config/fabric";
import { Box, Input, useDisclosure, useToast } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Footer } from "@zocket/components/Layout/Footer";
import { GenericHeader, ImageHeader, TextHeader } from "@zocket/components/Layout/Header";
import { Main } from "@zocket/components/Layout/Main";
import { AnimationSidebar, FontFamilySidebar, PropertySidebar, TemplateSidebar } from "@zocket/components/Layout/Sidebar";
import { exportedProps, maxUndoRedoSteps, originalHeight, originalWidth } from "@zocket/config/app";
import { defaultFont, defaultFontSize } from "@zocket/config/fonts";
import { useFabric } from "@zocket/hooks/useFabric";
import { usePreview } from "@zocket/hooks/usePreview";
import { Scene, SceneObject } from "@zocket/interfaces/animation";
import { Clipboard, FabricCanvas, FabricEvent, FabricObject, FabricSelectedState, FabricStates, FabricStaticCanvas, FabricTextbox, TextboxKeys } from "@zocket/interfaces/fabric";
import { addFontFace } from "@zocket/lib/add-font";
import { fabric as fabricJS } from "fabric";
import { FabricTemplate, Template } from "@zocket/interfaces/app";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as uuid from "uuid";

const { Textbox, Image } = fabricJS;

export default function App() {
  const toast = useToast({ position: "top-right", isClosable: true, variant: "left-accent" });

  const [scale, setScale] = useState(0.4);
  const [isPreview, setPreview] = useState(false);
  const [actionsEnabled, setActionsEnabled] = useState(true);

  const [template, setTemplate] = useState<Template>(null);
  const [clipboard, setClipboard] = useState<Clipboard>(null);
  const [selected, setSelected] = useState<FabricSelectedState>({ status: false, type: "none", name: "", details: null });

  const [undoStack, updateUndoStack] = useState<FabricStates>([]);
  const [redoStack, updateRedoStack] = useState<FabricStates>([]);

  const canUndo = useMemo(() => actionsEnabled && undoStack.length > 1, [undoStack, actionsEnabled]);
  const canRedo = useMemo(() => actionsEnabled && redoStack.length > 0, [redoStack, actionsEnabled]);

  const { isOpen: isPropertySidebarOpen, onClose: onPropertySidebarClose, onToggle: onPropertySidebarToggle } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isAnimationSidebarOpen, onClose: onAnimationSidebarClose, onToggle: onAnimationSidebarToggle } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isTemplateSidebarOpen, onClose: onTemplateSidebarClose, onToggle: onTemplateSidebarToggle } = useDisclosure({ onOpen: () => onFontFamilySidebarClose() });
  const { isOpen: isFontFamilySidebarOpen, onClose: onFontFamilySidebarClose, onToggle: onFontFamilySidebarToggle } = useDisclosure({ onOpen: () => onTemplateSidebarClose() });

  const isMainCollapsed = useMemo(() => isFontFamilySidebarOpen || isTemplateSidebarOpen, [isFontFamilySidebarOpen, isTemplateSidebarOpen]);

  const canvas = useRef<FabricCanvas>(null);
  const video = useRef<HTMLVideoElement>(null);
  const image = useRef<HTMLInputElement>(null);
  const preview = useRef<FabricStaticCanvas>(null);

  const initFabric = useFabric({
    ref: canvas,
    state: [...undoStack].pop(),
    callback: () => {
      onFontFamilySidebarClose();
      setSelected({ status: false, type: "none", name: "", details: null });
    },
  });

  const initPreview = usePreview({
    ref: preview,
  });

  const containerWidth = useMemo(() => originalWidth * scale, [scale]);
  const containerHeight = useMemo(() => originalHeight * scale, [scale]);

  const transform = useMemo(() => `scale(${scale})`, [scale]);

  const updateSelectionState = useCallback((event: FabricEvent) => {
    const element = event.selected![0];
    setSelected({ status: true, type: element.type!, name: element.name!, details: element.toObject(exportedProps) });
  }, []);

  const clearSelectionState = useCallback(() => {
    setSelected({ status: false, type: "none", name: "", details: null });
    onFontFamilySidebarClose();
  }, []);

  const initializeCanvasBackground = useCallback((canvas: NonNullable<FabricCanvas | FabricStaticCanvas>, template: FabricTemplate, preview?: boolean) => {
    switch (template.background) {
      case "color":
        canvas.setBackgroundColor(template.source, canvas.renderAll.bind(canvas));
        return;
      case "image":
        canvas.setBackgroundImage(template.source, canvas.renderAll.bind(canvas));
        return;
      case "video":
        if (!video.current) return;
        if (template.thumbnail) video.current.poster = template.thumbnail;
        video.current.src = template.source;
        video.current.currentTime = 0.1;
        video.current.load();
        if (!preview) {
          video.current.style.display = "block";
        } else {
          video.current.style.display = "none";
          const element = new Image(video.current!, { name: uuid.v4(), objectCaching: false, height: 1920, width: 1080, selectable: false });
          canvas.add(element);
          fabricJS.util.requestAnimFrame(function render() {
            canvas.renderAll();
            fabricJS.util.requestAnimFrame(render);
          });
        }
    }
  }, []);

  const initializeCanvasTemplate = useCallback(
    async (template: FabricTemplate) => {
      if (!canvas.current) return;
      canvas.current.clear();
      updateRedoStack([]);
      updateUndoStack([]);
      setTemplate(template);
      initializeCanvasBackground(canvas.current, template);
      for (const element of template.state) {
        switch (element.type) {
          case "textbox":
            const { error, name } = await addFontFace(element.details.fontFamily || defaultFont);
            if (error) toast({ title: "Error", description: error, status: "error" });
            const textbox = new Textbox(element.value!, { ...element.details, name: element.name, fontFamily: name });
            canvas.current.add(textbox);
        }
      }
      canvas.current.fire("object:modified", { target: null });
      canvas.current.requestRenderAll();
    },
    [canvas]
  );

  const saveCanvasState = useCallback(
    (_: FabricEvent) => {
      if (!canvas.current) return;
      updateRedoStack([]);
      const state = canvas.current.toJSON(exportedProps);
      const element = canvas.current.getActiveObject();
      if (element) setSelected((state) => ({ ...state, details: element.toObject(exportedProps) }));
      if (undoStack.length < maxUndoRedoSteps) return updateUndoStack((prev) => [...prev, state]);
      updateUndoStack((prev) => {
        const stack = prev.slice(1);
        return [...stack, state];
      });
    },
    [undoStack, canvas]
  );

  const handleObjectScaling = useCallback(
    (event: FabricEvent) => {
      if (!canvas.current) return;
      const element = event.target!;
      if (element.type === "textbox") {
        const text = element as FabricTextbox;
        text.set({ fontSize: Math.round(text.fontSize! * element.scaleY!), width: element.width! * element.scaleX!, scaleX: 1, scaleY: 1 });
      }
      canvas.current.renderAll();
    },
    [canvas]
  );

  const undoCanvasState = useCallback(() => {
    if (!canvas.current || !canUndo) return;
    setActionsEnabled(false);
    const stack = [...undoStack];
    const currentState = stack.pop()!;
    const undoState = stack[stack.length - 1];
    updateUndoStack(stack);
    updateRedoStack((state) => [...state, currentState]);
    const active = selected.name;
    canvas.current.clear();
    canvas.current.loadFromJSON(undoState, () => {
      setActionsEnabled(true);
      if (active) {
        const elements = canvas.current!.getObjects();
        for (const element of elements) {
          if (element.name === active) {
            canvas.current!.setActiveObject(element);
          }
        }
      }
      canvas.current!.renderAll();
    });
  }, [undoStack, redoStack, canUndo, canvas]);

  const redoCanvasState = useCallback(() => {
    if (!canvas.current || !canRedo) return;
    setActionsEnabled(false);
    const stack = [...redoStack];
    const redoState = stack.pop()!;
    updateUndoStack((state) => [...state, redoState]);
    updateRedoStack(stack);
    const active = selected.name;
    canvas.current.clear();
    canvas.current.loadFromJSON(redoState, () => {
      setActionsEnabled(true);
      if (active) {
        const elements = canvas.current!.getObjects();
        for (const element of elements) {
          if (element.name === active) {
            canvas.current!.setActiveObject(element);
            break;
          }
        }
        canvas.current!.renderAll();
      }
    });
  }, [undoStack, redoStack, canRedo, canvas]);

  const deleteCanvasObject = useCallback(() => {
    if (!canvas.current) return;
    const element = canvas.current.getActiveObject();
    if (!element) return;
    canvas.current.remove(element);
    canvas.current.fire("object:modified", { target: null });
    canvas.current.requestRenderAll();
  }, [canvas]);

  const copyCanvasObject = useCallback(() => {
    if (!canvas.current) return;
    const element = canvas.current.getActiveObject();
    if (!element) return;
    element.clone((clone: FabricObject) => {
      setClipboard(clone);
    }, exportedProps);
  }, [canvas]);

  const pasteCanvasObject = useCallback(() => {
    if (!canvas.current || !clipboard) return;
    clipboard.clone(function (clone: FabricObject) {
      canvas.current!.discardActiveObject();
      clone.set({ name: uuid.v4(), left: clone.left! + 10, top: clone.top! + 10, evented: true });
      clone.setCoords();
      canvas.current!.add(clone);
      canvas.current!.setActiveObject(clone);
      canvas.current!.fire("object:modified", { target: clone });
      canvas.current!.requestRenderAll();
      setClipboard((state) => {
        state!.left! += 10;
        state!.top! += 10;
        return state;
      });
    }, exportedProps);
  }, [canvas, clipboard]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.ctrlKey && event.key === "z") undoCanvasState();
      if (event.ctrlKey && event.key === "y") redoCanvasState();
      if (event.ctrlKey && event.key === "c") copyCanvasObject();
      if (event.ctrlKey && event.key === "v") pasteCanvasObject();
      if (event.key === "Delete") deleteCanvasObject();
    },
    [undoCanvasState, redoCanvasState, copyCanvasObject, pasteCanvasObject, deleteCanvasObject]
  );

  // dev-only -> replace with initialize undo stack in callback function in fabric initialization hook
  useEffect(() => {
    if (!canvas.current) return;
    const state = canvas.current.toObject();
    updateUndoStack([state]);
  }, []);

  // dev-only
  useEffect(() => {
    if (!template || !canvas.current) return;
    initializeCanvasTemplate(template);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (!canvas.current) return;
    canvas.current.off();
    canvas.current.on("object:modified", saveCanvasState);
    canvas.current.on("object:scaling", handleObjectScaling);
    canvas.current.on("selection:created", updateSelectionState);
    canvas.current.on("selection:updated", updateSelectionState);
    canvas.current.on("selection:cleared", clearSelectionState);
  }, [canvas, saveCanvasState, updateSelectionState]);

  const handleStartPreview = () => {
    if (!canvas.current || !preview.current) return;
    if (template) initializeCanvasBackground(preview.current, template);
    const state = onSaveScene();
    for (const object of state) {
      switch (object.type) {
        case "textbox":
          const textbox = new Textbox(object.details.text, { ...object.details });
          preview.current.add(textbox);
          handleAnimation(textbox, object);
          break;
        case "image":
          Image.fromURL(
            object.details.src,
            (image) => {
              preview.current!.add(image);
              handleAnimation(image, object);
            },
            {
              ...object.details,
              objectCaching: true,
            }
          );
          break;
      }
    }
    preview.current.requestRenderAll();
    setPreview(true);
  };

  const handleAnimation = (element: FabricObject, state: SceneObject) => {
    if (state.animation.entryTime > 0) {
      const entryTime = state.animation.entryTime * 1000;
      const duration = 500;
      const timeout = entryTime - duration;
      element.set("opacity", 0);
      setTimeout(() => {
        element.animate("opacity", 1, {
          duration,
          onChange: () => preview.current!.renderAll(),
          easing: fabricJS.util.ease.easeInSine,
        });
      }, timeout);
    }
    if (state.animation.hasExitTime) {
      const exitTime = state.animation.exitTime * 1000;
      const duration = 500;
      const timeout = exitTime - duration;
      setTimeout(() => {
        element.animate("opacity", 0, {
          duration,
          onChange: () => preview.current!.renderAll(),
          onComplete: () => preview.current!.remove(element),
          easing: fabricJS.util.ease.easeInSine,
        });
      }, timeout);
    }
  };

  const handleStopPreview = () => {
    setPreview(false);
    if (preview.current) preview.current.clear();
  };

  const onSaveScene = () => {
    const objects = canvas.current!.getObjects();
    // @ts-ignore
    const state = objects.map((object) => ({ type: object.type!, animation: object._anim, details: object.toObject(), name: object.name! }));
    return state as Scene;
  };

  const onOpenImageExplorer = () => {
    if (!image.current) return;
    image.current.click();
  };

  const onFileInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement;
    element.value = "";
  };

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    onAddImage(url);
  };

  const onAddText = async () => {
    if (!canvas.current) return;
    const { error, name } = await addFontFace(defaultFont);
    if (error) toast({ title: "Error", description: error, status: "error" });
    const text = new Textbox("Text", { name: uuid.v4(), fontFamily: name, fill: "#000000", fontSize: defaultFontSize });
    canvas.current.add(text);
    canvas.current.viewportCenterObject(text);
    canvas.current.setActiveObject(text);
    canvas.current.fire("object:modified", { target: text });
    canvas.current.requestRenderAll();
  };

  const onAddImage = (source: string) => {
    if (!canvas.current) return;
    Image.fromURL(
      source,
      (image) => {
        image.scaleToHeight(500);
        image.scaleToWidth(500);
        canvas.current!.add(image);
        canvas.current!.viewportCenterObject(image);
        canvas.current!.setActiveObject(image);
        canvas.current!.fire("object:modified", { target: image });
        canvas.current!.requestRenderAll();
      },
      {
        name: uuid.v4(),
        objectCaching: true,
      }
    );
  };

  const onTextFontChange = async (value: string) => {
    if (!canvas.current) return;
    const { error, name } = await addFontFace(value);
    if (error) toast({ title: "Error", description: error, status: "error" });
    const text = canvas.current.getActiveObject() as FabricTextbox;
    text.set("fontFamily", name);
    canvas.current.fire("object:modified", { target: text });
    canvas.current.requestRenderAll();
    setSelected((state) => ({ ...state, details: text.toObject(exportedProps) }));
  };

  const onTextPropertyChange = (property: TextboxKeys) => (value: any) => {
    if (!canvas.current) return;
    const text = canvas.current.getActiveObject() as FabricTextbox;
    text.set(property, value);
    canvas.current.fire("object:modified", { target: text });
    canvas.current.requestRenderAll();
    setSelected((state) => ({ ...state, details: text.toObject(exportedProps) }));
  };

  const headerComponentMap = {
    none: <GenericHeader {...{ onAddText, onOpenImageExplorer, onTemplateSidebarToggle }} />,
    image: <ImageHeader {...{ selected, onPropertySidebarToggle, onAnimationSidebarToggle }} />,
    textbox: <TextHeader {...{ selected, isFontFamilySidebarOpen, onFontFamilySidebarToggle, onTextPropertyChange, onPropertySidebarToggle, onAnimationSidebarToggle }} />,
  };

  return (
    <Box display="flex">
      <FontFamilySidebar selected={selected} onClose={onFontFamilySidebarClose} handleChange={onTextFontChange} isOpen={isFontFamilySidebarOpen} />
      <TemplateSidebar isOpen={isTemplateSidebarOpen} onClose={onTemplateSidebarClose} handleTemplateChange={initializeCanvasTemplate} />
      <Layout>
        {headerComponentMap[selected.type]}
        <Main isCollapsed={isMainCollapsed}>
          <MainContainer>
            <Box height={containerHeight} width={containerWidth} shadow="sm" pos="relative">
              <Video ref={video} width={1080} height={1920} />
              <Input type="file" ref={image} accept="images/*" display="none" onChange={handleImageInputChange} onClick={onFileInputClick} />
              <CanvasContainer transform={transform} display={isPreview ? "none" : "block"}>
                <canvas ref={initFabric} />
              </CanvasContainer>
              <CanvasContainer transform={transform} display={isPreview ? "block" : "none"}>
                <canvas ref={initPreview} />
              </CanvasContainer>
            </Box>
          </MainContainer>
          <PropertySidebar canvas={canvas.current} isOpen={isPropertySidebarOpen} onClose={onPropertySidebarClose} {...{ selected, onTextPropertyChange }} />
          <AnimationSidebar canvas={canvas.current} isOpen={isAnimationSidebarOpen} onClose={onAnimationSidebarClose} {...{ selected }} />
        </Main>
        <Footer
          {...{ scale, canRedo, canUndo, isPreview, handleRedo: redoCanvasState, handleUndo: undoCanvasState, onScaleChange: setScale, handleStartPreview, handleStopPreview }}
        />
      </Layout>
    </Box>
  );
}

const MainContainer = styled(Box)`
  flex: 1;
  display: grid;
  place-items: center;
  overflow: auto;
  max-height: calc(100vh - 144px);
`;

const CanvasContainer = styled(Box)`
  transform-origin: 0 0;
  top: 0;
  left: 0;
  position: absolute;
  height: ${originalHeight}px;
  width: ${originalWidth}px;
`;

const Layout = styled.div`
  display: flex;
  height: 100vh;
  flex: 1;
  flex-direction: column;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  display: none;
`;
