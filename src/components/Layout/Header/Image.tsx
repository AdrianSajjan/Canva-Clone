import { Box, Button, ButtonGroup, Flex, HStack, Icon, IconButton, Input, Text } from "@chakra-ui/react";
import { Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3Icon, ChevronDownIcon, CircleStackIcon } from "@heroicons/react/24/solid";
import { FontColorPicker, FontSizeInput, RotateInput } from "@zocket/components/Input";
import { Header } from "@zocket/components/Layout/Header";
import { Styles } from "@zocket/config/theme";
import { FabricSelectedState, TextboxKeys } from "@zocket/interfaces/fabric";
import { useMemo } from "react";

interface ImageHeaderProps {
  selected: FabricSelectedState;
}

export default function ImageHeader({ selected }: ImageHeaderProps) {
  return <Header></Header>;
}
