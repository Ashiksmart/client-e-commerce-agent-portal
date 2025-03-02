import { useFormik } from "formik";
import * as Yup from "yup";
import FormFields from "../FormFields";
import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import serviceProxy from "../../services/serviceProxy";
import Constants from "../../constants";
import { AppModal } from "../CommonEssentials";

const EditProfile = (props) => {
  const {
    open,
    setOpen,
    profile,
    setProfiledata,
    setOpenSnackbar,
    setSnackbarMessage,
  } = props;
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone_number: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must be numeric")
      .required("Phone number is required"),
  });
  const [popup, setPopup] = useState(false)

  const formik = useFormik({
    initialValues: profile,
    validationSchema: validationSchema,
    onSubmit: async (value, { resetForm }) => {
      serviceProxy.business
        .update(Constants.Application, Constants.MODULES.Profile, value)
        .then(() => {
          setProfiledata(value);
          resetForm();
          setOpen(false);
          setSnackbarMessage("Record Saved");
          setOpenSnackbar(true);
        })
        .catch((err) => {
          console.log("ERR : ", err);
          setSnackbarMessage("Failed");
          setOpenSnackbar(true);
        });
    },
  });
  const formikRef = React.useRef(formik);

  const handleResetForm = () => {
    formikRef.current.resetForm();
    setOpen(false);
  };

  const contentMsg = "Are you sure you want to update your profile?"

  const noFunc = () => {
    setPopup(false)
  };

  return (
    <>
      <Drawer anchor={"right"} open={open} onClose={handleResetForm}>
        <div className="container modal_cont">
        <div className="modal_head">

            Edit Your Profile
          </div>
          <div className="modal_body">
            <div className="form_container">
              <form onSubmit={formik.handleSubmit}>
                <div>
                  {Object.keys(formik.values).map((v, i) => {
                    if (v != "id") {
                      return (
                        <FormFields
                          key={i}
                          type={"text"}
                          name={v}
                          label={v.replace(/_/g, " ").toUpperCase()}
                          show={true}
                          formik={formik}
                          value={formik.values}
                          onChange={formik.handleChange}
                        />
                      );
                    }
                  })}
                </div>
                <div className="form_ft">
                  <div></div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <div
                      className="list_box_btn btn_danger"
                      onClick={handleResetForm}
                    >
                      Cancel
                    </div>
                    <div
                      className="list_box_btn list_box_btn_primary"
                      onClick={()=>{setPopup(true)}}
                    >
                      Update
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <AppModal content={contentMsg} yesFunc={formik.submitForm} noFunc={noFunc} confirmOpen={popup}></AppModal>
      </Drawer>
    </>
  );
};

export default EditProfile;
