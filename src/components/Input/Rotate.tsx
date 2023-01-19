import { HStack, IconButton, Input, SpaceProps, SystemStyleObject, useNumberInput } from "@chakra-ui/react";
import { Styles } from "@zocket/config/theme";

interface RotateInputProps extends SpaceProps {
  sx?: SystemStyleObject;
  value?: string;
  handleChange?: (value: number) => void;
}

export default function RotateInput({ value, handleChange, ...props }: RotateInputProps) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    step: 15.0,
    min: 0,
    max: 360,
    value: value,
    onChange: (value) => handleChange?.(parseFloat(value || "0")),
  });

  const increment = getIncrementButtonProps();
  const decrement = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack spacing={0} {...props}>
      <IconButton
        {...decrement}
        icon={<img src="https://cdn-icons-png.flaticon.com/512/32/32418.png" height={16} width={16} />}
        variant="outline"
        aria-label="Rotate Left"
        sx={styles.minus}
      />
      <Input {...input} rounded="none" width={24} placeholder="- -" textAlign="center" />
      <IconButton
        {...increment}
        icon={<img src="https://cdn-icons-png.flaticon.com/512/33/33811.png" height={16} width={16} />}
        variant="outline"
        aria-label="Rotate Right"
        sx={styles.plus}
      />
    </HStack>
  );
}

const styles = Styles.create({
  plus: {
    borderLeftWidth: 0,
    borderLeftRadius: 0,
  },
  minus: {
    borderRightWidth: 0,
    borderRightRadius: 0,
  },
});
