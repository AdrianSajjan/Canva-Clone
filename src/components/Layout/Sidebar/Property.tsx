import { Box, Button, HStack, Icon, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, Text, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { RotateInput } from "@zocket/components/Input";
import { FabricCanvas, FabricSelectedState, ObjectKeys } from "@zocket/interfaces/fabric";
import { ChangeEvent } from "react";

interface PropertySidebar {
  isOpen: boolean;
  onClose: () => void;
  canvas: FabricCanvas;
  selected: FabricSelectedState;
  onTextPropertyChange: (property: ObjectKeys) => (value: any) => void;
}

export default function PropertySidebar({ isOpen, canvas, selected, onClose, onTextPropertyChange }: PropertySidebar) {
  const handlePropertyChange = (property: ObjectKeys) => (event: ChangeEvent<HTMLInputElement>) =>
    event.target.value ? onTextPropertyChange(property)(parseFloat(event.target.value)) : onTextPropertyChange(property)(10);

  if (!isOpen || !selected.details) return null;

  const handleViewportCenter = () => {
    if (!canvas) return;
    const element = canvas.getActiveObject()!;
    canvas.viewportCenterObject(element);
    element.setCoords();
    canvas.fire("object:modified", { target: element });
  };

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
          <InputGroup>
            <InputLeftAddon>X</InputLeftAddon>
            <Input textAlign="center" value={selected.details.left} onChange={handlePropertyChange("left")} />
            <InputRightAddon>px</InputRightAddon>
          </InputGroup>
          <InputGroup>
            <InputLeftAddon>Y</InputLeftAddon>
            <Input textAlign="center" value={selected.details.top} onChange={handlePropertyChange("top")} />
            <InputRightAddon>px</InputRightAddon>
          </InputGroup>
        </VStack>
      </Box>
      <Box mt={6}>
        <Text textAlign="center" fontWeight="600">
          Dimension
        </Text>
        <VStack spacing={4} mt={2} alignItems="stretch">
          <InputGroup>
            <InputLeftAddon>W</InputLeftAddon>
            <Input textAlign="center" value={selected.details.width} onChange={handlePropertyChange("width")} />
            <InputRightAddon>px</InputRightAddon>
          </InputGroup>
          <InputGroup>
            <InputLeftAddon>H</InputLeftAddon>
            <Input textAlign="center" value={selected.details.height} onChange={handlePropertyChange("height")} />
            <InputRightAddon>px</InputRightAddon>
          </InputGroup>
        </VStack>
      </Box>
      <Box mt={6}>
        <Text textAlign="center" fontWeight="600">
          Scale
        </Text>
        <VStack spacing={4} mt={2} alignItems="stretch">
          <InputGroup>
            <InputLeftAddon>X</InputLeftAddon>
            <Input textAlign="center" value={selected.details.scaleX} onChange={handlePropertyChange("scaleX")} />
            <InputRightAddon>px</InputRightAddon>
          </InputGroup>
          <InputGroup>
            <InputLeftAddon>Y</InputLeftAddon>
            <Input textAlign="center" value={selected.details.scaleY} onChange={handlePropertyChange("scaleY")} />
            <InputRightAddon>px</InputRightAddon>
          </InputGroup>
        </VStack>
      </Box>
      <Box mt={6}>
        <Text textAlign="center" fontWeight="600">
          Rotation
        </Text>
        <RotateInput value={selected.details.angle} handleChange={onTextPropertyChange("angle")} mt={2} />
      </Box>
      <VStack alignItems="stretch" spacing={4} mt={8}>
        <Button onClick={handleViewportCenter}>Viewport Center</Button>
        <Button onClick={handleViewportHCenter}>Viewport Horizontal Center</Button>
        <Button onClick={handleViewportVCenter}>Viewport Vertical Center</Button>
      </VStack>
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
