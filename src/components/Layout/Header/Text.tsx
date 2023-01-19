import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3Icon, ChevronDownIcon, CircleStackIcon } from "@heroicons/react/24/solid";
import { FontColorPicker, FontSizeInput, RotateInput } from "@zocket/components/Input";
import { Styles } from "@zocket/config/theme";
import { FabricSelectedState, TextboxKeys } from "@zocket/interfaces/fabric";
import { ChangeEvent, useMemo } from "react";

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
  const top = useMemo(() => selected.details.top, [selected]);
  const left = useMemo(() => selected.details.left, [selected]);
  const width = useMemo(() => selected.details.width, [selected]);
  const height = useMemo(() => selected.details.height, [selected]);

  const handlePosChange = (property: TextboxKeys) => (event: ChangeEvent<HTMLInputElement>) =>
    event.target.value ? onTextPropertyChange(property)(parseFloat(event.target.value)) : onTextPropertyChange(property)(10);

  const onFontAlignClick = (value: string) => () => onTextPropertyChange("textAlign")(value);

  return (
    <Flex sx={styles.header} overflowX="auto" flexWrap="wrap">
      <Button variant="outline" bgColor={background} rightIcon={<Icon as={ChevronDownIcon} ml={1} />} onClick={handleFontSidebarToggle}>
        {fontFamily}
      </Button>
      <FontSizeInput value={fontSize} handleChange={onTextPropertyChange("fontSize")} />
      <ButtonGroup isAttached>
        {alignments.map(({ icon, label, value }) => (
          <IconButton key={value} variant={align === value ? "solid" : "outline"} aria-label={label} icon={icon} onClick={onFontAlignClick(value)} />
        ))}
      </ButtonGroup>
      <FontColorPicker value={color} onChange={onTextPropertyChange("fill")} />
      <RotateInput value={angle} handleChange={onTextPropertyChange("angle")} />
      <HStack spacing={4}>
        <InputGroup w={32}>
          <InputLeftAddon>X</InputLeftAddon>
          <Input type="number" textAlign="center" px={2} value={left} onChange={handlePosChange("left")} />
        </InputGroup>
        <InputGroup w={32}>
          <InputLeftAddon>Y</InputLeftAddon>
          <Input type="number" textAlign="center" px={2} value={top} onChange={handlePosChange("top")} />
        </InputGroup>
        <InputGroup w={32}>
          <InputLeftAddon>H</InputLeftAddon>
          <Input type="number" textAlign="center" px={2} value={height} onChange={handlePosChange("height")} />
        </InputGroup>
        <InputGroup w={32}>
          <InputLeftAddon>W</InputLeftAddon>
          <Input type="number" textAlign="center" px={2} value={width} onChange={handlePosChange("width")} />
        </InputGroup>
      </HStack>
      <Button variant="solid" colorScheme="blue" leftIcon={<Icon as={CircleStackIcon} fontSize="lg" />}>
        Animations
      </Button>
    </Flex>
  );
}

const styles = Styles.create({
  header: {
    minHeight: 20,
    paddingY: 3,
    paddingX: 4,
    columnGap: 6,
    rowGap: 4,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#dddddd",
    backgroundColor: "#ffffff",
  },
});
