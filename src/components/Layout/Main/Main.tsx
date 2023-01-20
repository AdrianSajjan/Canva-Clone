import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ReactNode, useMemo } from "react";

interface MainProps {
  isCollapsed?: boolean;
  children?: ReactNode;
}

const StyledMain = styled(Box)`
  flex: 1;
  display: flex;
  overflow: auto;
  flex-direction: row;
`;

export default function Main({ isCollapsed, children }: MainProps) {
  const width = useMemo(() => (isCollapsed ? "calc(100vw - 350px)" : "100vw"), [isCollapsed]);
  return (
    <StyledMain as="main" width={width}>
      {children}
    </StyledMain>
  );
}
