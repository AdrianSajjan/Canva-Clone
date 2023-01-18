import { mapFontsToSource } from "@zocket/config/fonts";

export const addFontFace = async (name: string) => {
  const source = mapFontsToSource[name];

  if (!source)
    return {
      error: "Cannot locate font. Default font will be used to preview",
      name: "Montserrat",
    };

  try {
    document.fonts.check(name);
    return {
      error: null,
      name,
    };
  } catch (e) {
    try {
      const fontFace = new FontFace(name, `url(${source})`);
      document.fonts.add(fontFace);
      await fontFace.load();
      return {
        error: null,
        name,
      };
    } catch (e) {
      return {
        error: "Unable to load font. Default font will be used to preview",
        name: "Montserrat",
      };
    }
  }
};
