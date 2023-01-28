import styled from "@emotion/styled";
import { ArrowUturnLeftIcon, ArrowUturnRightIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Button, HStack, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Icon } from "@chakra-ui/react";

interface FooterProps {
  scale?: number;
  isPreview?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  handleUndo?: () => void;
  handleRedo?: () => void;
  handleStartPreview?: () => void;
  handleStopPreview?: () => void;
  onScaleChange?: (value: number) => void;
}

export default function Footer({ scale = 0.4, isPreview, canRedo, canUndo, handleRedo, handleUndo, onScaleChange, handleStartPreview, handleStopPreview }: FooterProps) {
  return (
    <StyledFooter>
      {isPreview ? (
        <Button variant="solid" onClick={handleStopPreview} colorScheme="purple" leftIcon={<Icon as={PauseIcon} fontSize="xl" />}>
          Stop Preview
        </Button>
      ) : (
        <Button onClick={handleStartPreview} variant="solid" colorScheme="purple" leftIcon={<Icon as={PlayIcon} fontSize="xl" />}>
          Start Preview
        </Button>
      )}
      <HStack ml="auto">
        <HStack spacing={2} mr={8}>
          <Button variant="ghost" fontWeight={600}>
            {Math.floor(scale * 100)}%
          </Button>
          <Slider value={scale} onChange={onScaleChange} min={0.1} step={0.01} max={2} aria-label="zoom" w={48} defaultValue={30}>
            <SliderTrack bgColor="#EEEEEE">
              <SliderFilledTrack bgColor="#AAAAAA" />
            </SliderTrack>
            <SliderThumb bgColor="#000000" />
          </Slider>
        </HStack>
        <Button variant="outline" isDisabled={!canUndo} onClick={handleUndo} leftIcon={<Icon as={ArrowUturnLeftIcon} />}>
          Undo
        </Button>
        <Button variant="outline" isDisabled={!canRedo} onClick={handleRedo} rightIcon={<Icon as={ArrowUturnRightIcon} />}>
          Redo
        </Button>
      </HStack>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  height: 80px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-top: 1px solid #dddddd;
  background-color: #ffffff;
`;
