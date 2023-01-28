import { Button, ButtonGroup, Flex, HStack, Icon, IconButton } from "@chakra-ui/react";
import { Bars4Icon, Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3Icon, ChevronDownIcon, CircleStackIcon } from "@heroicons/react/24/solid";
import { FontColorPicker, FontSizeInput } from "@zocket/components/Input";
import { Header } from "@zocket/components/Layout/Header";
import { FabricSelectedState, TextboxKeys } from "@zocket/interfaces/fabric";
import { useMemo } from "react";

interface TextHeaderProps {
  selected: FabricSelectedState;
  isFontFamilySidebarOpen: boolean;
  onFontFamilySidebarToggle: () => void;
  onPropertySidebarToggle: () => void;
  onAnimationSidebarToggle: () => void;
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

export default function TextHeader({
  selected,
  isFontFamilySidebarOpen,
  onFontFamilySidebarToggle,
  onPropertySidebarToggle,
  onTextPropertyChange,
  onAnimationSidebarToggle,
}: TextHeaderProps) {
  const background = useMemo(() => (isFontFamilySidebarOpen ? "gray.200" : "white"), [isFontFamilySidebarOpen]);
  const align = useMemo(() => selected.details.textAlign, [selected]);

  const onFontAlignClick = (value: string) => () => onTextPropertyChange("textAlign")(value);

  return (
    <Header as={Flex} gap={4} overflowX="auto" flexWrap="wrap">
      <Button variant="outline" bgColor={background} rightIcon={<Icon as={ChevronDownIcon} ml={1} />} onClick={onFontFamilySidebarToggle}>
        {selected.details.fontFamily}
      </Button>
      <FontSizeInput value={selected.details.fontSize} onChange={onTextPropertyChange("fontSize")} />
      <ButtonGroup isAttached>
        {alignments.map(({ icon, label, value }) => (
          <IconButton key={value} variant={align === value ? "solid" : "outline"} aria-label={label} icon={icon} onClick={onFontAlignClick(value)} />
        ))}
      </ButtonGroup>
      <FontColorPicker value={selected.details.fill} onChange={onTextPropertyChange("fill")} />
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
