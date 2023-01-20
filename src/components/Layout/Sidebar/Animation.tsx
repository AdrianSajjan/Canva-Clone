import styled from "@emotion/styled";
import { HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { FabricCanvas, FabricSelectedState } from "@zocket/interfaces/fabric";

interface AnimationSidebar {
  isOpen: boolean;
  onClose: () => void;
  canvas: FabricCanvas;
  selected: FabricSelectedState;
}

export default function AnimationSidebar({ isOpen, selected, onClose }: AnimationSidebar) {
  if (!isOpen || !selected.details) return null;

  return (
    <Sidebar>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="600">
          Animations
        </Text>
        <IconButton aria-label="Close Sidebar" variant="outline" icon={<Icon as={ChevronDoubleRightIcon} fontSize="xl" />} onClick={onClose} />
      </HStack>
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
