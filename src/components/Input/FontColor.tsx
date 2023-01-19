import { Box, Button, Input, SpaceProps, Text } from "@chakra-ui/react";
import { ChangeEvent, useRef } from "react";

interface FontColorPickerProps extends SpaceProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function FontColorPicker({ value, onChange, ...props }: FontColorPickerProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => ref.current?.click();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value);

  return (
    <Box pos="relative" {...props}>
      <Button flexDir="column" display="flex" variant="outline" px={2} onClick={handleOpenPicker}>
        <Text fontSize="2xl" lineHeight={1.1}>
          A
        </Text>
        <Box width="100%" height="5px" bgColor={value} rounded="full" />
      </Button>
      <Input type="color" value={value} onChange={handleChange} pos="absolute" top={0} left={0} opacity={0} ref={ref} pointerEvents="none" />
    </Box>
  );
}
