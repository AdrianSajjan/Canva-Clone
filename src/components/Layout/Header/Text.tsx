import { Box, Button, ButtonGroup, Flex, HStack, Icon, IconButton, Input, Text } from "@chakra-ui/react";
import { Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3Icon, ChevronDownIcon, CircleStackIcon } from "@heroicons/react/24/solid";
import { FontColorPicker, FontSizeInput, RotateInput } from "@zocket/components/Input";
import { Styles } from "@zocket/config/theme";
import { FabricSelectedState, TextboxKeys } from "@zocket/interfaces/fabric";
import { useMemo } from "react";

interface TextHeaderProps {
  isFontSidebarOpen: boolean;
  selected: FabricSelectedState;
  handleFontSidebarToggle: () => void;
  onTextPropertyChange: (property: TextboxKeys) => (value: any) => void;
}

const alignments = [
  {
    label: "Left Align",
    value: "left",
    icon: <Icon as={Bars3BottomLeftIcon} fontSize="2xl" />,
  },
  {
    label: "Center Align",
    value: "center",
    icon: <Icon as={Bars3Icon} fontSize="2xl" />,
  },
  {
    label: "Right Align",
    value: "right",
    icon: <Icon as={Bars3BottomRightIcon} fontSize="2xl" />,
  },
];

export default function TextHeader({ isFontSidebarOpen, selected, handleFontSidebarToggle, onTextPropertyChange }: TextHeaderProps) {
  const background = useMemo(() => (isFontSidebarOpen ? "gray.200" : "white"), [isFontSidebarOpen]);

  const fontFamily = useMemo(() => selected.details.fontFamily, [selected]);
  const fontSize = useMemo(() => selected.details.fontSize, [selected]);
  const align = useMemo(() => selected.details.textAlign, [selected]);
  const color = useMemo(() => selected.details.fill, [selected]);
  const angle = useMemo(() => selected.details.angle, [selected]);

  const onFontAlignClick = (value: string) => () => onTextPropertyChange("textAlign")(value);

  return (
    <Flex sx={styles.header}>
      <Button variant="outline" bgColor={background} rightIcon={<Icon as={ChevronDownIcon} ml={1} />} onClick={handleFontSidebarToggle}>
        {fontFamily}
      </Button>
      <FontSizeInput ml={6} value={fontSize} handleChange={onTextPropertyChange("fontSize")} />
      <ButtonGroup isAttached ml={6}>
        {alignments.map(({ icon, label, value }) => (
          <IconButton key={value} variant={align === value ? "solid" : "outline"} aria-label={label} icon={icon} onClick={onFontAlignClick(value)} />
        ))}
      </ButtonGroup>
      <FontColorPicker value={color} onChange={onTextPropertyChange("fill")} ml={6} />
      <RotateInput value={angle} ml={6} handleChange={onTextPropertyChange("angle")} />
      <Button variant="solid" colorScheme="blue" ml="auto" leftIcon={<Icon as={CircleStackIcon} fontSize="lg" />}>
        Animations
      </Button>
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
