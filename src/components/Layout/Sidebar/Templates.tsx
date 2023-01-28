import { HStack, IconButton, Input, InputGroup, InputLeftElement, Icon, VStack, Text, Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ArrowLeftOnRectangleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { FabricTemplate } from "@zocket/interfaces/app";
import { ChangeEvent, useState } from "react";

interface TemplateSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  handleTemplateChange?: (value: FabricTemplate) => void;
}

export default function TemplateSidebar({ isOpen, onClose, handleTemplateChange }: TemplateSidebarProps) {
  const [query, setQuery] = useState("");

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);

  const onTemplateChange = (_?: FabricTemplate) => () =>
    handleTemplateChange?.({
      background: {
        type: "color",
        value: "#000000",
      },
      state: [
        {
          name: "djsioahduh3192391203o123llwjiasu9seiosek",
          type: "textbox",
          value: "Hello World",
          details: { top: 500, left: 500, fill: "#FFFFFF", fontFamily: "Raleway Regular", fontSize: 80 },
        },
      ],
    });

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
        <VStack>
          <Button onClick={onTemplateChange()}>Template 1</Button>
        </VStack>
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
