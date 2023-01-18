import { extendTheme, SystemStyleObject } from "@chakra-ui/react";

type CreateProps = Record<string, SystemStyleObject>;

export const Styles = {
  create: function <T extends CreateProps>(styles: T): T {
    return styles;
  },
};

export const theme = extendTheme({
  fonts: {
    body: `"IBM Plex Sans", sans-serif`,
    heading: `"IBM Plex Sans", sans-serif`,
  },
  components: {},
  styles: {
    global: {
      "html, body": {
        scrollBehavior: "smooth",
        backgroundColor: "gray.200",
      },
      "::-webkit-scrollbar": {
        width: 2,
        height: 2,
        background: "gray.100",
      },
      "::-webkit-scrollbar-thumb": {
        background: "gray.400",
      },
      "::-webkit-scrollbar-corner": {
        background: "gray.100",
      },
    },
  },
  sizes: {
    container: {
      "2xl": "1440px",
    },
  },
});
