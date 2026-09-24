import { GlobalLoadingOverlay } from "./GlobalLoadingOverlay";
import { GlobalErrorDialog } from "./GlobalErrorDialog";
import { GlobalAlertDialog } from "./GlobalAlertDialog";
import { GlobalConfirmDialog } from "./GlobalConfirmDialog";

export function GlobalOverlay() {
  return (
    <>
      <GlobalLoadingOverlay />
      <GlobalErrorDialog />
      <GlobalAlertDialog />
      <GlobalConfirmDialog />
    </>
  );
}