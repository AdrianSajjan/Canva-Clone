import { Box, chakra, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import { CheckIcon, MagnifyingGlassIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { fonts } from "@zocket/config/fonts";
import { Styles } from "@zocket/config/theme";
import { FabricSelectedState } from "@zocket/interfaces/fabric";
import { motion } from "framer-motion";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

interface FontSidebarProps {
  isOpen?: boolean;
  selected?: FabricSelectedState;
  handleChange?: (value: string) => void;
  onClose?: () => void;
}

export default function FontSidebar({ isOpen, selected, handleChange, onClose }: FontSidebarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) return;
    setQuery("");
  }, [isOpen]);

  const list = useMemo(() => {
    if (!isOpen) return [];
    if (!query.length) return selected ? [selected.details.fontFamily, ...fonts.filter((font) => font !== selected.details.fontFamily)] : fonts;
    return fonts.filter((font) => font.toLowerCase().includes(query.toLowerCase()));
  }, [query, isOpen]);

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);

  const handleFontChange = (font: string) => () => handleChange?.(font);

  if (!isOpen) return null;

  return (
    <Box as={motion.div} sx={styles.sidebar} height="100vh" width={350}>
      <HStack p={4} spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={MagnifyingGlassIcon} fontSize="xl" mt={1.5} ml={1} />
          </InputLeftElement>
          <Input value={query} onChange={onQueryChange} size="lg" placeholder="Try 'Poppins' or 'Lato'" fontSize="md" />
        </InputGroup>
        <IconButton aria-label="Close Sidebar" variant="ghost" icon={<Icon as={ArrowLeftOnRectangleIcon} fontSize="2xl" />} onClick={onClose} />
      </HStack>
      <VStack spacing={0} pb={4} overflowY="auto">
        {list.map((font) => (
          <FontItem key={font} onClick={handleFontChange(font)}>
            <Text>{font}</Text>
            {selected?.details.fontFamily === font ? <Icon as={CheckIcon} fontSize="xl" /> : null}
          </FontItem>
        ))}
      </VStack>
    </Box>
  );
}

const FontItem = chakra("button", {
  baseStyle: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 6,
    py: 3,
    transitionProperty: "background-color",
    transitionDuration: "100ms",
    _hover: {
      backgroundColor: "#EEEEEE",
    },
  },
});

const styles = Styles.create({
  sidebar: {
    display: "flex",
    flexDirection: "column",
    borderRightWidth: 1,
    flexShrink: 0,
    borderRightStyle: "solid",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderRightColor: "#CCCCCC",
  },
});
