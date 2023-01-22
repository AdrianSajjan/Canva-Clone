import { Input, InputGroup, InputLeftAddon, InputRightAddon } from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

interface PropertyInputProps {
  value: any;
  left?: string;
  right?: string;
  isDisabled?: boolean;
  onChange: (_: any) => void;
}

export default function PropertyInput({ onChange, value, left, right, isDisabled }: PropertyInputProps) {
  const [property, setProperty] = useState(value);

  useEffect(() => {
    setProperty(value);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setProperty(event.target.value);

  const handleBlur = () => {
    if (property) {
      onChange(property);
    } else {
      setProperty(value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    handleBlur();
    event.preventDefault();
  };

  return (
    <InputGroup>
      <InputLeftAddon>{left}</InputLeftAddon>
      <Input
        isDisabled={isDisabled}
        textAlign="center"
        placeholder="- -"
        value={property}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <InputRightAddon>{right}</InputRightAddon>
    </InputGroup>
  );
}
