import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import { createClass } from "../../actions";

function FormDialog(props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    props.createClass(data);
  };

  const handleClose = () => {
    props.handleClose();
  };

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.description}</DialogContentText>
          <form
            id="createClassForm"
            className="m-0 p-0"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl fullWidth>
              <Controller
                name="className"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    margin="dense"
                    label="Class's name"
                    variant="standard"
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <Controller
                name="description"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Description"
                    variant="standard"
                  />
                )}
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="createClassForm" onClick={handleClose}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default connect(null, { createClass })(FormDialog);
