import { Box, Button, Flex, HStack, Icon, useToast } from "@chakra-ui/react";
import styled from "@emotion/styled";
import {
  ChatBubbleOvalLeftIcon,
  CloudArrowUpIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  PlayIcon,
  ChevronDownIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/solid";
import FontSidebar from "@zocket/components/Layout/Sidebar/Fonts";
import {
  FabricCanvas,
  FabricEvent,
  FabricSelectedState,
  FabricStates,
  FabricTextbox,
  maxUndoRedoSteps,
  originalHeight,
  originalWidth,
} from "@zocket/config/fabric";
import { defaultFont } from "@zocket/config/fonts";
import { useFabric } from "@zocket/hooks/useFabric";
import { addFontFace } from "@zocket/lib/add-font";
import { fabric as fabricJS } from "fabric";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as uuid from "uuid";

const { Textbox } = fabricJS;

export default function App() {
  const toast = useToast({ position: "top-right", isClosable: true, variant: "left-accent" });

  const [scale] = useState(0.6);
  const [fontSidebarOpen, setFontSidebarOpen] = useState(false);
  const [selected, setSelected] = useState<FabricSelectedState>({ status: false, type: "none", details: null });

  const [actionsEnabled, setActionsEnabled] = useState(true);
  const [undoStack, updateUndoStack] = useState<FabricStates>([]);
  const [redoStack, updateRedoStack] = useState<FabricStates>([]);

  const canvas = useRef<FabricCanvas>(null);
  const fabric = useFabric({
    ref: canvas,
    state: [...undoStack].pop(),
    callback: () => {
      setFontSidebarOpen(false);
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
    setSelected({ status: true, type: element.type!, details: element.toObject(["name"]) });
  }, []);

  const saveCanvasState = useCallback(
    (_: FabricEvent) => {
      if (!canvas.current) return;
      const state = canvas.current.toJSON(["name"]);
      if (undoStack.length >= maxUndoRedoSteps) {
        updateUndoStack((prev) => {
          const stack = prev.slice(1);
          return [...stack, state];
        });
      } else {
        updateUndoStack((prev) => [...prev, state]);
      }
      updateRedoStack([]);
    },
    [undoStack, canvas]
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

    canvas.current.on("selection:created", updateSelectionState);

    canvas.current.on("selection:updated", updateSelectionState);

    canvas.current.on("selection:cleared", () => {
      setSelected({ status: false, type: "none", details: null });
    });

    return () => {
      canvas.current?.off();
    };
  }, [canvas, saveCanvasState, updateSelectionState]);

  const onAddText = async () => {
    if (!canvas.current) return;

    const { error, name } = await addFontFace(defaultFont);

    if (error) {
      toast({ title: "Error", description: error, status: "error" });
    }

    const text = new Textbox("New Text", { name: uuid.v4(), fontFamily: name });

    canvas.current.add(text);
    canvas.current.viewportCenterObject(text);
    canvas.current.setActiveObject(text);
    canvas.current.fire("object:modified", { target: text });
    canvas.current.requestRenderAll();
  };

  const onTextFontChange = async (value: string) => {
    if (!canvas.current) return;

    const { error, name } = await addFontFace(value);

    if (error) toast({ title: "Error", description: error, status: "error" });

    const text = canvas.current.getActiveObject() as FabricTextbox;
    text.set("fontFamily", name);

    canvas.current.fire("object:modified", { target: text });
    canvas.current.requestRenderAll();

    setSelected((state) => ({ ...state, details: text.toObject(["name"]) }));
  };

  const handleFontSidebar = () => setFontSidebarOpen((state) => !state);

  return (
    <Box display="flex">
      {selected.type === "textbox" && fontSidebarOpen ? (
        <FontSidebar selected={selected.details?.fontFamily} handleChange={onTextFontChange} />
      ) : null}
      <Layout>
        <Header>
          {selected.type === "none" ? (
            <Flex flex={1} alignItems="center" justifyContent="space-between">
              <Box>
                <Button onClick={onAddText} variant="outline" leftIcon={<Icon as={ChatBubbleOvalLeftIcon} fontSize="xl" />}>
                  Add Text
                </Button>
                <Button ml={4} variant="outline" leftIcon={<Icon as={PhotoIcon} fontSize="xl" />}>
                  Add Image
                </Button>
              </Box>
              <Box ml="auto">
                <Button colorScheme="blue" variant="outline" leftIcon={<Icon as={CloudArrowUpIcon} fontSize="xl" />}>
                  Save Changes
                </Button>
                <Button ml={4} colorScheme="green" leftIcon={<Icon as={PaperAirplaneIcon} fontSize="xl" />}>
                  Export Video
                </Button>
              </Box>
            </Flex>
          ) : selected.type === "textbox" ? (
            <Button
              variant="outline"
              backgroundColor={fontSidebarOpen ? "gray.200" : "white"}
              rightIcon={<Icon as={ChevronDownIcon} fontSize="l" />}
              onClick={handleFontSidebar}
            >
              {selected.details.fontFamily}
            </Button>
          ) : (
            <Button>Change Image</Button>
          )}
        </Header>
        <Main>
          <Box height={containerHeight} width={containerWidth} backgroundColor="#FFFFFF" shadow="sm">
            <Box transform={transform} transformOrigin="0 0" height={originalHeight} width={originalWidth}>
              <canvas ref={fabric}></canvas>
            </Box>
          </Box>
        </Main>
        <Footer>
          <HStack>
            <Button variant="outline" isDisabled={!canUndo} onClick={undoCanvasState} leftIcon={<Icon as={ArrowUturnLeftIcon} />}>
              Undo State
            </Button>
            <Button variant="outline" isDisabled={!canRedo} onClick={redoCanvasState} rightIcon={<Icon as={ArrowUturnRightIcon} />}>
              Redo State
            </Button>
          </HStack>
          <Button ml="auto" variant="solid" colorScheme="purple" leftIcon={<Icon as={PlayIcon} fontSize="xl" />}>
            Preview Video
          </Button>
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

const Header = styled.header`
  height: 80px;
  padding: 12px 16px;
  border-bottom: 1px solid #dddddd;
  background-color: #ffffff;
  display: flex;
  align-items: center;
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
  overflow: auto;
  display: grid;
  place-items: center;
`;
