import { Box, Input, InputGroup, InputLeftElement, Icon, VStack, chakra, Text } from "@chakra-ui/react";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/solid";
import { fonts } from "@zocket/config/fonts";
import { Styles } from "@zocket/config/theme";
import { motion } from "framer-motion";
import { ChangeEvent, useMemo, useState } from "react";

interface FontSidebarProps {
  selected?: string;
  handleChange?: (value: string) => void;
}

export default function FontSidebar({ selected, handleChange }: FontSidebarProps) {
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    if (!query.length) return selected ? [selected, ...fonts.filter((font) => font !== selected)] : fonts;
    return fonts.filter((font) => font.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);

  return (
    <Box as={motion.div} sx={styles.sidebar} height="100vh" width={350}>
      <Box p={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={MagnifyingGlassIcon} fontSize="xl" mt={1.5} ml={1} />
          </InputLeftElement>
          <Input value={query} onChange={onQueryChange} size="lg" placeholder="Try 'Poppins' or 'Open Sans'" fontSize="md" />
        </InputGroup>
      </Box>
      <VStack spacing={0} pb={4} overflowY="auto">
        {list.map((font) => (
          <FontItem key={font} onClick={() => handleChange?.(font)}>
            <Text>{font}</Text>
            {selected === font ? <Icon as={CheckIcon} fontSize="xl" /> : null}
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
