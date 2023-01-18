import { Button, HStack, Input, SpaceProps, SystemStyleObject, useNumberInput } from "@chakra-ui/react";
import { Styles } from "@zocket/config/theme";

interface FontSizeInputProps extends SpaceProps {
  sx?: SystemStyleObject;
  value?: string;
  handleChange?: (value: string) => void;
}

export default function FontSizeInput({ value, handleChange, ...props }: FontSizeInputProps) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    step: 1,
    min: 1,
    max: 1000,
    value,
    onChange: (value) => handleChange?.(value),
  });

  const increment = getIncrementButtonProps();
  const decrement = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack spacing={0} {...props}>
      <Button {...decrement} variant="outline" fontSize="xl" sx={styles.minus}>
        -
      </Button>
      <Input {...input} rounded="none" width={20} placeholder="- -" textAlign="center" />
      <Button {...increment} variant="outline" fontSize="xl" sx={styles.plus}>
        +
      </Button>
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
