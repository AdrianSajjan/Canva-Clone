import { HStack, IconButton, Input, InputGroup, InputLeftElement, Icon, VStack, Text, Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ArrowLeftOnRectangleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { FabricTemplate } from "@zocket/interfaces/app";
import { templates } from "@zocket/mock/templates";
import { ChangeEvent, useState } from "react";
import * as uuid from "uuid";

interface TemplateSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  handleTemplateChange?: (value: FabricTemplate) => void;
}

export default function TemplateSidebar({ isOpen, onClose, handleTemplateChange }: TemplateSidebarProps) {
  const [query, setQuery] = useState("");

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);

  const onTemplateChange = (value: FabricTemplate) => () => handleTemplateChange?.(value);

  if (!isOpen) return null;

  return (
    <Sidebar>
      <HStack p={4} spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={MagnifyingGlassIcon} fontSize="xl" mt={1.5} ml={1} />
          </InputLeftElement>
          <Input value={query} onChange={onQueryChange} size="lg" placeholder="Search video templates" fontSize="md" />
        </InputGroup>
        <IconButton aria-label="Close Sidebar" variant="ghost" icon={<Icon as={ArrowLeftOnRectangleIcon} fontSize="2xl" />} onClick={onClose} />
      </HStack>
      <VStack pt={2} alignItems="start" px={4} pb={4} overflowY="auto">
        <Text fontSize={14}>All Results</Text>
        <HStack wrap="nowrap">
          <Button onClick={onTemplateChange(templates[0])}>Template 1</Button>
          <Button onClick={onTemplateChange(templates[1])}>Template 2</Button>
        </HStack>
      </VStack>
    </Sidebar>
  );
}

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
