import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchClasses } from "../actions";
import MaterialCard from "../components/materialCard/MaterialCard";
import UserHeader from "../components/userHeader/UserHeader";
import Button from "@mui/material/Button";
import FormDialog from "../components/formDialog/FormDialog";

function Home(props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    props.fetchClasses();
  }, [props]);

  function handleShowDialog() {
    setOpen(true);
  }

  function handleHideDialog() {
    setOpen(false);
  }

  if (!props.classes) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container" style={{ minHeight: "calc(100vh - 56px)" }}>
      <div className="row pt-5">
        <div
          className="d-flex justify-content-between align-items-center mb-3"
          style={{ width: "100%" }}
        >
          <h3 className="text-info">Class list</h3>
          <Button onClick={handleShowDialog} variant="contained">
            Create class
          </Button>
        </div>
        <div
          className="classList col-12 d-flex justify-content-center align-items-center"
          style={{
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {props.classes.map((classItem) => {
            return (
              <MaterialCard
                key={classItem._id}
                preTitle={`JoinId: ${classItem.joinId}`}
                title={classItem.className}
                subTitle={<UserHeader userId={classItem.teacher} />}
                description={classItem.description}
              />
            );
          })}
        </div>
      </div>
      <FormDialog
        title="Create class"
        open={open}
        handleClose={handleHideDialog}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    classes: Object.values(state.classes),
  };
};

export default connect(mapStateToProps, { fetchClasses })(Home);
