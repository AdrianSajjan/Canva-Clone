import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ChatBubbleOvalLeftIcon, CloudArrowUpIcon, PaperAirplaneIcon, PhotoIcon, PlayIcon } from "@heroicons/react/24/solid";
import { FabricCanvas, FabricModifiedEvent, FabricStates, maxUndoRedoSteps, originalHeight, originalWidth } from "@zocket/config/fabric";
import { useFabric } from "@zocket/hooks/useFabric";
import { fabric as fabricJS } from "fabric";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as uuid from "uuid";

const { Text } = fabricJS;

export default function App() {
  const [scale, _] = useState(0.6);
  const [selected, setSelected] = useState({ status: false, type: "none", name: "" });

  const [actionsEnabled, setActionsEnabled] = useState(true);
  const [undoStack, updateUndoStack] = useState<FabricStates>([]);
  const [redoStack, updateRedoStack] = useState<FabricStates>([]);

  const canvas = useRef<FabricCanvas>(null);
  const fabric = useFabric(canvas);

  const containerWidth = useMemo(() => originalWidth * scale, [scale]);
  const containerHeight = useMemo(() => originalHeight * scale, [scale]);
  const transform = useMemo(() => `scale(${scale})`, [scale]);

  const saveCanvasState = useCallback(
    (_: FabricModifiedEvent) => {
      if (!canvas.current || !actionsEnabled) return;
      const state = canvas.current.toJSON(["name"]);
      console.log("SAVING");
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
    [undoStack]
  );

  const undoCanvasState = useCallback(
    (_: globalThis.KeyboardEvent) => {
      if (!actionsEnabled || !canvas.current || undoStack.length < 2) return;
      console.log("UNDO");
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
    },
    [undoStack, redoStack]
  );

  const redoCanvasState = useCallback(
    (_: globalThis.KeyboardEvent) => {
      if (!actionsEnabled || !canvas.current || !redoStack.length) return;
      console.log("REDO");
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
    },
    [undoStack, redoStack]
  );

  const handleKeyPress = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.repeat) return;
      if (event.ctrlKey && event.key === "z") undoCanvasState(event);
      if (event.ctrlKey && event.key === "y") redoCanvasState(event);
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
    console.log("UNDO STACK");
    console.log(undoStack);
  }, [undoStack]);

  useEffect(() => {
    console.log("REDO STACK");
    console.log(redoStack);
  }, [redoStack]);

  useEffect(() => {
    if (!canvas.current) return;

    canvas.current.off();

    canvas.current.on("object:modified", saveCanvasState);

    canvas.current.on("selection:created", (event) => {
      const element = event.selected![0];
      setSelected({ status: true, type: element.type!, name: element.name! });
    });

    canvas.current.on("selection:cleared", () => {
      setSelected({ status: false, type: "none", name: "" });
    });

    return () => {
      canvas.current?.off();
    };
  }, [canvas, saveCanvasState]);

  const onAddText = () => {
    if (!canvas.current) return;
    const text = new Text("New Text", {
      name: uuid.v4(),
      fontFamily: "Montserrat",
    });
    canvas.current.add(text);
    canvas.current.viewportCenterObject(text);
    canvas.current.fire("object:modified", { target: text });
    canvas.current.setActiveObject(text);
    canvas.current.requestRenderAll();
  };

  return (
    <Box display="flex">
      <Sidebar></Sidebar>
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
          ) : selected.type === "text" ? (
            <Button>Font Family</Button>
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
          <Button variant="solid" colorScheme="purple" leftIcon={<Icon as={PlayIcon} fontSize="xl" />}>
            Preview Video
          </Button>
        </Footer>
      </Layout>
    </Box>
  );
}

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #dddddd;
`;

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
