import { Box, Button, ButtonGroup, Flex, HStack, Icon, IconButton, Input, Text } from "@chakra-ui/react";
import { Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3Icon, Bars4Icon, ChevronDownIcon, CircleStackIcon } from "@heroicons/react/24/solid";
import { FontColorPicker, FontSizeInput, RotateInput } from "@zocket/components/Input";
import { Header } from "@zocket/components/Layout/Header";
import { Styles } from "@zocket/config/theme";
import { FabricSelectedState, TextboxKeys } from "@zocket/interfaces/fabric";
import { useMemo } from "react";

interface ImageHeaderProps {
  selected: FabricSelectedState;
  onPropertySidebarToggle: () => void;
  onAnimationSidebarToggle: () => void;
}

export default function ImageHeader({ selected, onAnimationSidebarToggle, onPropertySidebarToggle }: ImageHeaderProps) {
  return (
    <Header>
      <HStack ml="auto" spacing={4}>
        <Button variant="outline" onClick={onPropertySidebarToggle} leftIcon={<Icon fontSize="lg" as={Bars4Icon} />}>
          Properties
        </Button>
        <Button variant="solid" onClick={onAnimationSidebarToggle} colorScheme="blue" leftIcon={<Icon as={CircleStackIcon} fontSize="lg" />}>
          Animations
        </Button>
      </HStack>
    </Header>
  );
}
