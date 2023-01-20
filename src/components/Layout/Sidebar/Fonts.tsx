import { HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { CheckIcon, MagnifyingGlassIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { fonts } from "@zocket/config/fonts";
import { FabricSelectedState } from "@zocket/interfaces/fabric";
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
    <Sidebar>
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
          <Item key={font} onClick={handleFontChange(font)}>
            <Text>{font}</Text>
            {selected?.details.fontFamily === font ? <Icon as={CheckIcon} fontSize="xl" /> : null}
          </Item>
        ))}
      </VStack>
    </Sidebar>
  );
}

const Item = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #ffffff;
  &:hover {
    background-color: #eeeeee;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  border-right: 1px solid #cccccc;
  background-color: #ffffff;
  flex-shrink: 0;
  overflow: hidden;
  height: 100vh;
  width: 350px;
`;
