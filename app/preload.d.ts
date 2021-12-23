export interface IMenuHandler {
  openFile: () => Promise<[ NodeJS.ErrnoException | null, string, string ]>;
  saveFile: (filename: string, content: string) => Promise<[ NodeJS.ErrnoException | null, "success" | "cancelled" ]>;
  onMenuItemClicked: (callback: (itemId: string) => void) => void;
  clearMenuListeners: () => void;
}

declare global {
  interface Window {
    menuHandler: IMenuHandler
  }
}
