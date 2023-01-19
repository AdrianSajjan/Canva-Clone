import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ArrowUturnLeftIcon, ArrowUturnRightIcon, PlayIcon } from "@heroicons/react/24/solid";
import { ImageHeader } from "@zocket/components/Layout/Header";
import { GenericHeader, TextHeader } from "@zocket/components/Layout/Header";
import { FontFamilySidebar } from "@zocket/components/Layout/Sidebar";
import { exportedProps, maxUndoRedoSteps, originalHeight, originalWidth } from "@zocket/config/fabric";
import { defaultFont, defaultFontSize } from "@zocket/config/fonts";
import { useFabric } from "@zocket/hooks/useFabric";
import { FabricCanvas, FabricEvent, FabricSelectedState, FabricStates, FabricTextbox, TextboxKeys } from "@zocket/interfaces/fabric";
import { addFontFace } from "@zocket/lib/add-font";
import { fabric as fabricJS } from "fabric";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as uuid from "uuid";

const { Textbox, Image } = fabricJS;

export default function App() {
  const toast = useToast({ position: "top-right", isClosable: true, variant: "left-accent" });

  const [scale, setScale] = useState(0.4);
  const [selected, setSelected] = useState<FabricSelectedState>({ status: false, type: "none", details: null });

  const [actionsEnabled, setActionsEnabled] = useState(true);
  const [undoStack, updateUndoStack] = useState<FabricStates>([]);
  const [redoStack, updateRedoStack] = useState<FabricStates>([]);

  const { isOpen: isFontSidebarOpen, onToggle: handleFontSidebarToggle, onClose: handleFontSidebarClose } = useDisclosure();

  const image = useRef<HTMLInputElement>(null);
  const canvas = useRef<FabricCanvas>(null);

  const fabric = useFabric({
    ref: canvas,
    state: [...undoStack].pop(),
    callback: () => {
      handleFontSidebarClose();
      setSelected({ status: false, type: "none", details: null });
    },
  });

  const canUndo = useMemo(() => actionsEnabled && undoStack.length > 1, [undoStack, actionsEnabled]);
  const canRedo = useMemo(() => actionsEnabled && redoStack.length, [redoStack, actionsEnabled]);

  const containerWidth = useMemo(() => originalWidth * scale, [scale]);
  const containerHeight = useMemo(() => originalHeight * scale, [scale]);

  const transform = useMemo(() => `scale(${scale})`, [scale]);

  const updateSelectionState = useCallback((event: FabricEvent) => {
    const element = event.selected![0];
    setSelected({ status: true, type: element.type!, details: element.toObject(exportedProps) });
  }, []);

  const clearSelectionState = useCallback(() => {
    setSelected({ status: false, type: "none", details: null });
    handleFontSidebarClose();
  }, []);

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
    canvas.current.clear();
    canvas.current.loadFromJSON(undoState, () => {
      setActionsEnabled(true);
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
    canvas.current.clear();
    canvas.current.loadFromJSON(redoState, () => {
      setActionsEnabled(true);
      canvas.current!.renderAll();
    });
  }, [undoStack, redoStack, canRedo, canvas]);

  const deleteCanvasObject = useCallback(() => {
    if (!canvas.current) return;
    const element = canvas.current.getActiveObject();
    if (element) canvas.current.remove(element);
    canvas.current.fire("object:modified", { target: null });
    canvas.current.requestRenderAll();
  }, [canvas]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.ctrlKey && event.key === "z") undoCanvasState();
      if (event.ctrlKey && event.key === "y") redoCanvasState();
      if (event.key === "Delete") deleteCanvasObject();
    },
    [undoCanvasState, redoCanvasState]
  );

  useEffect(() => {
    if (!canvas.current) return;
    const state = canvas.current.toObject();
    updateUndoStack([state]);
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

  const onOpenImageExplorer = () => {
    image.current?.click();
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
        objectCaching: false,
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
    none: <GenericHeader {...{ onAddText, onOpenImageExplorer }} />,
    textbox: <TextHeader {...{ selected, isFontSidebarOpen, handleFontSidebarToggle, onTextPropertyChange }} />,
    image: <ImageHeader {...{ selected }} />,
  };

  return (
    <Box display="flex">
      <FontFamilySidebar selected={selected} onClose={handleFontSidebarClose} handleChange={onTextFontChange} isOpen={isFontSidebarOpen} />
      <Layout>
        {headerComponentMap[selected.type]}
        <Main>
          <Box flex={1} display="grid" placeItems="center">
            <Box height={containerHeight} width={containerWidth} shadow="sm" pos="relative">
              <Video src="/sample-video.mp4" />
              <Box transform={transform} transformOrigin="0 0" top={0} left={0} height={originalHeight} width={originalWidth} pos="absolute">
                <canvas ref={fabric}></canvas>
                <Input type="file" ref={image} accept="images/*" display="none" onChange={handleImageInputChange} onClick={onFileInputClick} />
              </Box>
            </Box>
          </Box>
        </Main>
        <Footer>
          <HStack>
            <Button variant="outline" isDisabled={!canUndo} onClick={undoCanvasState} leftIcon={<Icon as={ArrowUturnLeftIcon} />}>
              Undo
            </Button>
            <Button variant="outline" isDisabled={!canRedo} onClick={redoCanvasState} rightIcon={<Icon as={ArrowUturnRightIcon} />}>
              Redo
            </Button>
          </HStack>
          <HStack ml="auto" spacing={8}>
            <HStack spacing={4}>
              <Button variant="ghost" fontWeight={600}>
                {Math.floor(scale * 100)}%
              </Button>
              <Slider value={scale} onChange={setScale} min={0.1} step={0.01} max={2} aria-label="zoom" w={48} defaultValue={30}>
                <SliderTrack bgColor="#EEEEEE">
                  <SliderFilledTrack bgColor="#AAAAAA" />
                </SliderTrack>
                <SliderThumb bgColor="#000000" />
              </Slider>
            </HStack>
            <Button variant="solid" colorScheme="purple" leftIcon={<Icon as={PlayIcon} fontSize="xl" />}>
              Preview Video
            </Button>
          </HStack>
        </Footer>
      </Layout>
    </Box>
  );
}

const Layout = styled.div`
  display: flex;
  height: 100vh;
  flex: 1;
  flex-direction: column;
`;

const Footer = styled.footer`
  height: 80px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-top: 1px solid #dddddd;
  background-color: #ffffff;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  max-width: 100vw;
  flex-direction: row;
`;

const Video = styled.video`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #ffffff;
`;
