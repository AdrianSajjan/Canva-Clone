import { HStack, IconButton, Input, SpaceProps, SystemStyleObject } from "@chakra-ui/react";
import { Styles } from "@zocket/config/theme";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

interface RotateInputProps extends SpaceProps {
  sx?: SystemStyleObject;
  value: string;
  onChange: (value: number) => void;
}

const step = 15;
const min = -360;
const max = 360;

export default function RotateInput({ value, onChange, ...props }: RotateInputProps) {
  const [angle, setAngle] = useState(value);

  useEffect(() => {
    if (value === angle) return;
    setAngle(value);
  }, [value]);

  const handleIncrease = () => {
    const next = (angle ? parseFloat(angle) : 0) + step;
    if (next > max) onChange(max);
    else onChange(next);
  };

  const handleDecrease = () => {
    const next = (angle ? parseFloat(angle) : 0) - step;
    if (next < min) onChange(min);
    else onChange(next);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAngle(event.target.value.replace("°", ""));
  };

  const handleBlur = () => {
    if (angle) {
      onChange(parseFloat(angle));
    } else {
      setAngle(value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    handleBlur();
    event.preventDefault();
  };

  return (
    <HStack spacing={0} {...props}>
      <IconButton
        onClick={handleDecrease}
        isDisabled={parseFloat(angle) <= min}
        icon={<img src="https://cdn-icons-png.flaticon.com/512/32/32418.png" height={16} width={16} />}
        variant="outline"
        aria-label="Rotate Left"
        sx={styles.minus}
      />
      <Input
        value={angle + "°"}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        px={2}
        rounded="none"
        placeholder="- -"
        textAlign="center"
      />
      <IconButton
        isDisabled={parseFloat(angle) >= max}
        onClick={handleIncrease}
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
