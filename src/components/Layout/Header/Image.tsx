import { Box, Button, ButtonGroup, Flex, HStack, Icon, IconButton, Input, Text } from "@chakra-ui/react";
import { Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3Icon, ChevronDownIcon, CircleStackIcon } from "@heroicons/react/24/solid";
import { FontColorPicker, FontSizeInput, RotateInput } from "@zocket/components/Input";
import { Styles } from "@zocket/config/theme";
import { FabricSelectedState, TextboxKeys } from "@zocket/interfaces/fabric";
import { useMemo } from "react";

interface ImageHeaderProps {
  selected: FabricSelectedState;
}

export default function ImageHeader({ selected }: ImageHeaderProps) {
  return <Flex sx={styles.header}></Flex>;
}

const styles = Styles.create({
  header: {
    height: 20,
    paddingY: 3,
    paddingX: 4,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#dddddd",
    backgroundColor: "#ffffff",
  },
});
