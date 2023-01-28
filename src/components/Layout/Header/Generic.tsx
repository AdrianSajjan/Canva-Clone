import { Box, Button, Icon } from "@chakra-ui/react";
import { ChatBubbleOvalLeftIcon, CloudArrowUpIcon, DocumentChartBarIcon, PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { Header } from "@zocket/components/Layout/Header";

interface GenericHeaderProps {
  onAddText?: () => void;
  onOpenImageExplorer?: () => void;
  onTemplateSidebarToggle?: () => void;
}

export default function GenericHeader({ onAddText, onOpenImageExplorer, onTemplateSidebarToggle }: GenericHeaderProps) {
  return (
    <Header>
      <Box>
        <Button variant="outline" leftIcon={<Icon as={DocumentChartBarIcon} fontSize="xl" />} onClick={onTemplateSidebarToggle}>
          Select Template
        </Button>
        <Button onClick={onAddText} ml={4} variant="outline" leftIcon={<Icon as={ChatBubbleOvalLeftIcon} fontSize="xl" />}>
          Add Text
        </Button>
        <Button ml={4} variant="outline" leftIcon={<Icon as={PhotoIcon} fontSize="xl" />} onClick={onOpenImageExplorer}>
          Add Image
        </Button>
      </Box>
      <Box ml="auto">
        <Button isDisabled colorScheme="blue" variant="outline" leftIcon={<Icon as={CloudArrowUpIcon} fontSize="xl" />}>
          Save Changes
        </Button>
        <Button isDisabled ml={4} colorScheme="green" leftIcon={<Icon as={PaperAirplaneIcon} fontSize="xl" />}>
          Export Video
        </Button>
      </Box>
    </Header>
  );
}
