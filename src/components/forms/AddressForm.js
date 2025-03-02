import { useFormik } from "formik";
import FormFields from "../FormFields";
import * as Yup from "yup";
import React, { useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Constants from "../../constants";
import serviceProxy from "../../services/serviceProxy";

const AddressForm = (props) => {
  const {
    open,
    setOpen,
    address,
    setAddressdata,
    setOpenSnackbar,
    setSnackbarMessage,
    profileId,
    fetchAddress
  } = props;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    mobile: Yup.string().matches(/^[0-9]+$/, "Mobile must be numeric").required("Mobile is required"),
    address: Yup.string().required("Address is required"),
    landmark: Yup.string().required("LandMark is required"),
    pincode: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must be numeric")
      .required("Phone number is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
  });

  const formik = useFormik({
    initialValues: address,
    validationSchema: validationSchema,
    onSubmit: async (value, { resetForm }) => {
      if ("id" in value) {
        serviceProxy.business
          .update(Constants.Application, Constants.MODULES.Address, value)
          .then(() => {
            setAddressdata();
            setOpen(false);
            resetForm();
            setSnackbarMessage("Record Saved");
            setOpenSnackbar(true);
          })
          .catch((err) => {
            console.log("ERR : ", err);
            setSnackbarMessage("Failed");
            setOpenSnackbar(true);
          });
      } else {
        value.user_id = profileId
        serviceProxy.business
          .create(Constants.Application, Constants.MODULES.Address, value)
          .then(async () => {
            await fetchAddress(profileId);
            setOpen(false);
            resetForm();
            setSnackbarMessage("Record Saved");
            setOpenSnackbar(true);
          })
          .catch((err) => {
            console.log("ERR : ", err);
            setSnackbarMessage("Failed");
            setOpenSnackbar(true);
          });
      }

    },
  });

  const formikRef = React.useRef(formik);

  const handleResetForm = () => {
    formikRef.current.resetForm();
    setOpen(false);
  };

  return (
    <>
      <Drawer anchor={"right"} open={open} onClose={handleResetForm}>
        <div className="container modal_cont">
          <div className="modal_head">
            {"id" in address ? "Edit Your Address" : "Add Address"}
          </div>
          <div className="modal_body">
            <div className="form_container">
              <form onSubmit={formik.handleSubmit}>
                <div>
                  <FormFields
                    type={"text"}
                    name={"name"}
                    label={"Name"}
                    show={true}
                    formik={formik}
                    value={formik.values}
                    onChange={formik.handleChange}
                  />
                  <FormFields
                    type={"text"}
                    name={"mobile"}
                    label={"Mobile"}
                    show={true}
                    formik={formik}
                    value={formik.values}
                    onChange={formik.handleChange}
                  />
                  <FormFields
                    type={"text"}
                    name={"address"}
                    label={"Address"}
                    show={true}
                    formik={formik}
                    value={formik.values}
                    onChange={formik.handleChange}
                  />
                  <FormFields
                    type={"text"}
                    name={"landmark"}
                    label={"LandMark"}
                    show={true}
                    formik={formik}
                    value={formik.values}
                    onChange={formik.handleChange}
                  />
                  <FormFields
                    type={"text"}
                    name={"pincode"}
                    label={"PinCode"}
                    show={true}
                    formik={formik}
                    value={formik.values}
                    onChange={formik.handleChange}
                  />
                  <FormFields
                    type={"text"}
                    name={"city"}
                    label={"City"}
                    show={true}
                    formik={formik}
                    value={formik.values}
                    onChange={formik.handleChange}
                  />
                  <FormFields
                    type={"text"}
                    name={"state"}
                    label={"State"}
                    show={true}
                    formik={formik}
                    value={formik.values}
                    onChange={formik.handleChange}
                  />
                  <FormFields
                    type={"text"}
                    name={"country"}
                    label={"Country"}
                    show={true}
                    formik={formik}
                    value={formik.values}
                    onChange={formik.handleChange}
                  />

                </div>

              </form>
            </div>
          </div>
          <div className="form_ft">
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
                onClick={formik.submitForm}
              >
                Save this Address
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default AddressForm;
