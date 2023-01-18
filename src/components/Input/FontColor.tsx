import { Box, Button, Input, SpaceProps, Text } from "@chakra-ui/react";
import { useRef } from "react";

interface FontColorPickerProps extends SpaceProps {}

export default function FontColorPicker({ ...props }: FontColorPickerProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => ref.current?.click();

  return (
    <Box pos="relative" {...props}>
      <Button flexDir="column" display="flex" variant="ghost" px={2} onClick={handleOpenPicker}>
        <Text fontSize="2xl" lineHeight={1.1}>
          A
        </Text>
        <Box width="100%" height="5px" bgColor="#000000" rounded="full" />
      </Button>
      <Input type="color" pos="absolute" top={0} left={0} opacity={0} ref={ref} pointerEvents="none" />
    </Box>
  );
}
