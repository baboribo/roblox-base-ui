// 실제 메뉴와 대화상자가 열릴 공간을 확보합니다.
const overlays = [
  "select",
  "menu",
  "context-menu",
  "combobox",
  "autocomplete",
  "dialog",
  "alert-dialog",
  "drawer",
  "popover",
  "preview-card",
  "tooltip",
  "toast",
  "navigation-menu",
  "menubar",
  "card-asset-detail",
];
export function getPreviewOptions(name: string) {
  const matches = (id: string) => name === id || name.startsWith(`${id}-`);
  return {
    minHeight:
      name === "settings"
        ? 1100
        : matches("sidebar")
          ? 640
          : overlays.some(matches)
            ? 440
            : matches("icon") && !matches("icon-button")
              ? 580
              : 192,
    center: ["button", "icon-button", "badge", "checkbox", "switch"].some(
      matches,
    ),
  };
}
