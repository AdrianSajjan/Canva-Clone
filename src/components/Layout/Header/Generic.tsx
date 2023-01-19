import { Box, Button, Icon } from "@chakra-ui/react";
import { ChatBubbleOvalLeftIcon, CloudArrowUpIcon, PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { Styles } from "@zocket/config/theme";

interface GenericHeaderProps {
  onAddText?: () => void;
  onOpenImageExplorer?: () => void;
}

export default function GenericHeader({ onAddText, onOpenImageExplorer }: GenericHeaderProps) {
  return (
    <Box sx={styles.header}>
      <Box>
        <Button onClick={onAddText} variant="outline" leftIcon={<Icon as={ChatBubbleOvalLeftIcon} fontSize="xl" />}>
          Add Text
        </Button>
        <Button ml={4} variant="outline" leftIcon={<Icon as={PhotoIcon} fontSize="xl" />} onClick={onOpenImageExplorer}>
          Add Image
        </Button>
      </Box>
      <Box ml="auto">
        <Button colorScheme="blue" variant="outline" leftIcon={<Icon as={CloudArrowUpIcon} fontSize="xl" />}>
          Save Changes
        </Button>
        <Button ml={4} colorScheme="green" leftIcon={<Icon as={PaperAirplaneIcon} fontSize="xl" />}>
          Export Video
        </Button>
      </Box>
    </Box>
  );
}

const styles = Styles.create({
  header: {
    height: 20,
    paddingY: 3,
    paddingX: 4,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#dddddd",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
  },
});
