import styled from "@emotion/styled";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Animation } from "@zocket/interfaces/animation";
import { ChevronDoubleRightIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { FabricCanvas, FabricSelectedState } from "@zocket/interfaces/fabric";
import { ChangeEvent, useMemo } from "react";

interface AnimationSidebar {
  isOpen: boolean;
  onClose: () => void;
  canvas: FabricCanvas;
  selected: FabricSelectedState;
}

export default function AnimationSidebar({ isOpen, selected, canvas, onClose }: AnimationSidebar) {
  const animation: Animation = useMemo(() => selected.details?._anim, [selected]);

  const handleAnimationTimeChange = (property: "entryTime" | "exitTime") => (event: ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;
    const element = canvas.getActiveObject()!;
    const value = event.target.value ? parseFloat(event.target.value) : 0;
    element._anim = { ...element._anim, [property]: value };
    canvas.fire("object:modified", { target: element });
  };

  const handleAnimationTypeChange = (property: "entryAnim" | "exitAnim") => (value: string) => {
    if (!canvas) return;
    const element = canvas.getActiveObject()!;
    element._anim = { ...element._anim, [property]: value };
    canvas.fire("object:modified", { target: element });
  };

  const handleExitAnimToggle = (event: ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;
    const element = canvas.getActiveObject()!;
    element._anim = { ...element._anim, hasExitTime: event.target.checked };
    canvas.fire("object:modified", { target: element });
  };

  if (!isOpen || !selected.details) return null;

  return (
    <Sidebar>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="600">
          Animations
        </Text>
        <IconButton aria-label="Close Sidebar" variant="outline" icon={<Icon as={ChevronDoubleRightIcon} fontSize="xl" />} onClick={onClose} />
      </HStack>
      <Box mt={6}>
        <Text fontWeight="600">Entry Animation</Text>
        <VStack spacing={4} mt={4} alignItems="stretch">
          <FormControl>
            <InputGroup>
              <Input value={animation.entryTime} onChange={handleAnimationTimeChange("entryTime")} />
              <InputRightAddon>second</InputRightAddon>
            </InputGroup>
            <FormHelperText>Entry time of the object</FormHelperText>
          </FormControl>
          <Box>
            <AnimationSelect isDisabled variant="outline" rightIcon={<Icon as={ChevronDownIcon} fontSize="lg" />}>
              Fade
            </AnimationSelect>
            <Text fontSize="sm" mt={2} lineHeight="normal" color="gray.600">
              Entry animation of the object
            </Text>
          </Box>
        </VStack>
      </Box>
      <Box mt={8}>
        <HStack justify="space-between">
          <Text fontWeight="600">Exit Animation</Text>
          <Switch isChecked={animation.hasExitTime} onChange={handleExitAnimToggle} />
        </HStack>
        <VStack spacing={4} mt={4} alignItems="stretch">
          <FormControl>
            <InputGroup>
              <Input value={animation.exitTime} onChange={handleAnimationTimeChange("exitTime")} isDisabled={!animation.hasExitTime} />
              <InputRightAddon>second</InputRightAddon>
            </InputGroup>
            <FormHelperText>Exit time of the object</FormHelperText>
          </FormControl>
          <Box>
            <AnimationSelect isDisabled variant="outline" rightIcon={<Icon as={ChevronDownIcon} fontSize="lg" />}>
              Fade
            </AnimationSelect>
            <Text fontSize="sm" mt={2} lineHeight="normal" color="gray.600">
              Exit animation of the object
            </Text>
          </Box>
        </VStack>
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

const AnimationSelect = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  width: 100%;
`;
