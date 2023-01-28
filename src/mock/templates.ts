import { FabricTemplate } from "@zocket/interfaces/app";
import * as uuid from "uuid";

export const templates: Array<FabricTemplate> = [
  {
    background: {
      type: "image",
      value: "/sample-image.webp",
    },
    state: [
      {
        name: uuid.v4(),
        type: "textbox",
        value: "Template 1",
        details: { top: 914.3, left: 314.5, width: 449, fill: "#FFFFFF", fontFamily: "Poppins Black", fontSize: 80 },
      },
    ],
  },
  {
    background: {
      type: "video",
      value: "/sample-video.mp4",
    },
    state: [
      {
        name: uuid.v4(),
        type: "textbox",
        value: "Template 2",
        details: { top: 914.3, left: 314.5, width: 463, fill: "#FFFFFF", fontFamily: "Poppins Black", fontSize: 80 },
      },
    ],
  },
];
