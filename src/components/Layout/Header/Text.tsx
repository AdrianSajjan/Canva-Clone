import { Box, Button, Icon } from "@chakra-ui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { FabricSelectedState } from "@zocket/config/fabric";
import { Styles } from "@zocket/config/theme";
import { useMemo } from "react";

interface TextHeaderProps {
  isFontSidebarOpen?: boolean;
  selected: FabricSelectedState;
  handleFontSidebarToggle?: () => void;
}

export default function TextHeader({ isFontSidebarOpen, selected, handleFontSidebarToggle }: TextHeaderProps) {
  const background = useMemo(() => (isFontSidebarOpen ? "gray.200" : "white"), [isFontSidebarOpen]);

  return (
    <Box sx={styles.header}>
      <Button variant="outline" bgColor={background} rightIcon={<Icon as={ChevronDownIcon} fontSize="l" />} onClick={handleFontSidebarToggle}>
        {selected.details.fontFamily}
      </Button>
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
