import { Button, HStack, Input, SpaceProps, SystemStyleObject } from "@chakra-ui/react";
import { Styles } from "@zocket/config/theme";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

interface FontSizeInputProps extends SpaceProps {
  sx?: SystemStyleObject;
  value: string;
  onChange: (value: number) => void;
}

const step = 1;
const min = 1;
const max = Number.MAX_SAFE_INTEGER;

export default function FontSizeInput({ value, onChange, ...props }: FontSizeInputProps) {
  const [fontSize, setFontSize] = useState(value);

  useEffect(() => {
    if (value === fontSize) return;
    setFontSize(value);
  }, [value]);

  const handleIncrease = () => {
    const next = (fontSize ? parseFloat(fontSize) : 0) + step;
    if (next > max) onChange(max);
    else onChange(next);
  };

  const handleDecrease = () => {
    const next = (fontSize ? parseFloat(fontSize) : 0) - step;
    if (next < min) onChange(min);
    else onChange(next);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFontSize(event.target.value);
  };

  const handleBlur = () => {
    if (fontSize) {
      onChange(parseFloat(fontSize));
    } else {
      setFontSize(value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    handleBlur();
    event.preventDefault();
  };
  return (
    <HStack spacing={0} {...props}>
      <Button onClick={handleDecrease} isDisabled={parseFloat(fontSize) <= min} variant="outline" fontSize="xl" sx={styles.minus}>
        -
      </Button>
      <Input
        value={fontSize}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        px={2}
        rounded="none"
        width={20}
        placeholder="- -"
        textAlign="center"
      />
      <Button onClick={handleIncrease} isDisabled={parseFloat(fontSize) >= max} variant="outline" fontSize="xl" sx={styles.plus}>
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
