import { useMemo } from "react";
import styled from "@emotion/styled";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { MiddleAlignIcon } from "@zocket/components/Icons/MiddleAlign";
import { PropertyInput, RotateInput } from "@zocket/components/Input";
import { Box, Button, HStack, Icon, IconButton, Text, VStack } from "@chakra-ui/react";
import { FabricCanvas, FabricSelectedState, ObjectKeys } from "@zocket/interfaces/fabric";
import { CenterAlignIcon } from "@zocket/components/Icons/CenterAlign";

interface PropertySidebar {
  isOpen: boolean;
  onClose: () => void;
  canvas: FabricCanvas;
  selected: FabricSelectedState;
  onTextPropertyChange: (property: ObjectKeys) => (value: any) => void;
}

export default function PropertySidebar({ isOpen, canvas, selected, onClose, onTextPropertyChange }: PropertySidebar) {
  const isText = useMemo(() => (selected.details ? selected.details.type === "textbox" : false), [selected]);

  const handleViewportHCenter = () => {
    if (!canvas) return;
    const element = canvas.getActiveObject()!;
    canvas.viewportCenterObjectH(element);
    element.setCoords();
    canvas.fire("object:modified", { target: element });
  };

  const handleViewportVCenter = () => {
    if (!canvas) return;
    const element = canvas.getActiveObject()!;
    canvas.viewportCenterObjectV(element);
    element.setCoords();
    canvas.fire("object:modified", { target: element });
  };

  const handlePropertyChange = (property: ObjectKeys) => (value: string) => {
    onTextPropertyChange(property)(parseFloat(value));
  };

  const handleDimensionChange = (property: "height" | "width") => (value: string) => {
    if (!canvas) return;
    const element = canvas.getActiveObject()!;
    if (property === "height") {
      if (element.type === "textbox") return;
      if (element.type === "image") {
        const scale = parseFloat(value) / element.height!;
        element.set("scaleY", scale);
      } else {
        element.set("height", parseFloat(value));
      }
    } else {
      if (element.type === "image") {
        const scale = parseFloat(value) / element.width!;
        element.set("scaleX", scale);
      } else {
        element.set("width", parseFloat(value));
      }
    }
    canvas.requestRenderAll();
  };

  if (!isOpen || !selected.details) return null;

  return (
    <Sidebar>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="600">
          Properties
        </Text>
        <IconButton aria-label="Close Sidebar" variant="outline" icon={<Icon as={ChevronDoubleRightIcon} fontSize="xl" />} onClick={onClose} />
      </HStack>
      <Box mt={6}>
        <Text textAlign="center" fontWeight="600">
          Position
        </Text>
        <VStack spacing={4} mt={2} alignItems="stretch">
          <PropertyInput left="X" right="px" value={selected.details.left} onChange={handlePropertyChange("left")} />
          <PropertyInput left="Y" right="px" value={selected.details.top} onChange={handlePropertyChange("top")} />
        </VStack>
      </Box>
      <Box mt={6}>
        <Text textAlign="center" fontWeight="600">
          Dimension
        </Text>
        <VStack spacing={4} mt={2} alignItems="stretch">
          <PropertyInput left="W" right="px" value={selected.details.width * selected.details.scaleX} onChange={handleDimensionChange("width")} />
          <PropertyInput isDisabled={isText} left="H" right="px" value={selected.details.height * selected.details.scaleY} onChange={handleDimensionChange("height")} />
        </VStack>
      </Box>
      <Box mt={6}>
        <Text textAlign="center" fontWeight="600">
          Rotation
        </Text>
        <RotateInput value={selected.details.angle} onChange={onTextPropertyChange("angle")} mt={2} />
      </Box>
      <Box mt={6}>
        <Text textAlign="center" fontWeight="600">
          Viewport Align
        </Text>
        <HStack spacing={2} mt={2}>
          <Button fontWeight={500} width="full" variant="outline" leftIcon={<Icon as={MiddleAlignIcon} />} onClick={handleViewportVCenter}>
            Middle
          </Button>
          <Button fontWeight={500} width="full" variant="outline" leftIcon={<Icon as={CenterAlignIcon} />} onClick={handleViewportHCenter}>
            Center
          </Button>
        </HStack>
      </Box>
    </Sidebar>
  );
}

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  border-left: 1px solid #cccccc;
  background-color: #ffffff;
  flex-shrink: 0;
  overflow: auto;
  padding: 20px 24px;
  width: 350px;
`;
