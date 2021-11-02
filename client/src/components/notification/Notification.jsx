import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Notification(props) {
  const { notify } = props;

  return (
    <Snackbar
      open={notify.open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={notify.type}>{notify.message}</Alert>
    </Snackbar>
  );
}

export default Notification;
