import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

/**
 * Reusable confirmation modal for delete actions.
 *
 * Props:
 * - open: boolean, whether the modal is visible
 * - onCancel: called when the user cancels / closes the modal without deleting
 * - onContinue: called when the user confirms the deletion
 * - message: the confirmation message to display
 * - loading: disables the buttons and shows a "Deleting..." state on Continue
 */
function ConfirmDeleteModal({
  open,
  onCancel,
  onContinue,
  message = "Are you sure you want to delete this item?",
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      PaperProps={{
        style: {
          backgroundColor: "#517894",
          color: "#ffffff",
        },
      }}
    >
      <DialogTitle style={{ color: "#ffffff" }}>Confirm Deletion</DialogTitle>
      <DialogContent style={{ color: "#ffffff" }}>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading} style={{ color: "#ffffff" }}>
          Cancel
        </Button>
        <Button
          onClick={onContinue}
          disabled={loading}
          variant="contained"
          color="error"
        >
          {loading ? "Deleting..." : "Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteModal;
