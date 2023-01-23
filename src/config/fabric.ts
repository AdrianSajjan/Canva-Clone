/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fabric as fabricJS } from "fabric";
import { Animation } from "@zocket/interfaces/animation";

const mtr = fabricJS.Textbox.prototype.controls.mtr;

fabricJS.Textbox.prototype.setControlsVisibility({ mt: false, mb: false });
fabricJS.Textbox.prototype.controls.mtr = new fabricJS.Control({
  x: 0,
  y: -0.5,
  offsetY: -40,
  actionHandler: mtr.actionHandler,
  cursorStyle: "url(/rotate-cursor.svg) 8 8, auto",
  actionName: "rotate",
  withConnection: true,
});

fabricJS.Object.prototype.transparentCorners = false;
fabricJS.Object.prototype.padding = 16;
fabricJS.Object.prototype.cornerSize = 16;
fabricJS.Object.prototype.cornerStyle = "circle";
fabricJS.Object.prototype.borderColor = "#BE94F5";
fabricJS.Object.prototype.cornerColor = "#BE94F5";
// @ts-ignore
fabricJS.Object.prototype._anim = {
  entryTime: 0,
  exitTime: 0,
  hasExitTime: false,
} as Animation;
