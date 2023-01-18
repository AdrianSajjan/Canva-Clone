import { Box, Button, ButtonGroup, Flex, HStack, Icon, IconButton, Input, Text } from "@chakra-ui/react";
import { Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { FontColorPicker, FontSizeInput } from "@zocket/components/Input";
import { Styles } from "@zocket/config/theme";
import { FabricSelectedState } from "@zocket/interfaces/fabric";
import { useMemo } from "react";

interface TextHeaderProps {
  isFontSidebarOpen?: boolean;
  selected: FabricSelectedState;
  handleFontSidebarToggle?: () => void;
  onTextFontSizeChange?: (value: string) => void;
}

export default function TextHeader({ isFontSidebarOpen, selected, handleFontSidebarToggle, onTextFontSizeChange }: TextHeaderProps) {
  const background = useMemo(() => (isFontSidebarOpen ? "gray.200" : "white"), [isFontSidebarOpen]);

  const fontFamily = useMemo(() => selected.details.fontFamily, [selected]);
  const fontSize = useMemo(() => selected.details.fontSize, [selected]);
  const align = useMemo(() => selected.details.textAlign, [selected]);

  return (
    <Flex sx={styles.header}>
      <Button variant="outline" bgColor={background} rightIcon={<Icon as={ChevronDownIcon} ml={1} />} onClick={handleFontSidebarToggle}>
        {fontFamily}
      </Button>
      <FontSizeInput ml={6} value={fontSize} handleChange={onTextFontSizeChange} />
      <ButtonGroup isAttached ml={6}>
        <IconButton variant={align === "left" ? "solid" : "outline"} aria-label="Left" icon={<Icon as={Bars3BottomLeftIcon} fontSize="2xl" />} />
        <IconButton variant={align === "center" ? "solid" : "outline"} aria-label="Center" icon={<Icon as={Bars3Icon} fontSize="2xl" />} />
        <IconButton variant={align === "right" ? "solid" : "outline"} aria-label="Right" icon={<Icon as={Bars3BottomRightIcon} fontSize="2xl" />} />
      </ButtonGroup>
      <FontColorPicker ml={6} />
    </Flex>
  );
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
