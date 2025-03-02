
import * as Yup from "yup";
import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import '../../styles/Common.scss'
import '../../styles/Auth.scss'
import FormField from '../../components/FormElements'
import { useNavigate } from 'react-router-dom'
import FormFields from "../../components/FormFields";
import serviceProxy from "../../services/serviceProxy";
import { Snackbar, Alert } from "@mui/material";
import Constants from "../../constants";
import { AuthLogo } from "../../components/CommonEssentials";
const ForgotPassword = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [SnackbarError, setSnackbarError] = useState(false);
    const [initial_value, setinitial_value] = useState({
        "email": "",
        "password": ""


    })
    const navigate = useNavigate()
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email address'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters long')

    });

    const formik = useFormik({
        initialValues: initial_value,
        validationSchema: validationSchema,
        onSubmit: async (value, { resetForm }) => {

            serviceProxy.auth.resetpassword({ email: value.email, roles: 'Client' }).then((res) => {
                if (res.status === 200) {
                    res.data.data['email'] = value.email
                    res.data.data['password'] = value.password
                    delete res.data.data.account_id
                    serviceProxy.localStorage.setItem("userinfo", res.data.data)
                    serviceProxy.otp.send("email", {
                        "email": value.email,
                        "type": 2,
                    }).then((res) => {

                        if (res.status === 201) {
                            serviceProxy.notification.send(serviceProxy.localStorage.getPrefixKey(), Constants.MODULES.OneTimePassword, { id: res.data.data.id.toString(), email: res.data.data.email, operation: Constants.CREATE_MODE }).then((res) => {

                                if (res.status === 200) {
                                    resetForm();
                                    setTimeout(() => {
                                        navigate('/verify-forgot-otp')
                                    }, 3000);
                                    setSnackbarMessage("Please Check Your Mail for Otp");
                                    setOpenSnackbar(true);
                                } else {

                                    setSnackbarError(true)
                                    setSnackbarMessage("Failed");
                                    setOpenSnackbar(true);
                                }

                            }).catch((err) => {
                                console.log("ERR : ", err);
                                setSnackbarError(true)
                                setSnackbarMessage("Failed");
                                setOpenSnackbar(true);
                            });
                        }
                    }).catch((err) => {
                        setSnackbarError(true)
                        setSnackbarMessage("Invalid User Input Data");
                        setOpenSnackbar(true);

                    })
                }


            }).catch((err) => {
                setSnackbarError(true)
                setSnackbarMessage("Invalid User Input Data");
                setOpenSnackbar(true);

            })


        },
    });

    
    const handleSnackbarClose = () => {
        setSnackbarError(false)
        setOpenSnackbar(false);
    };
    return (
        <div className='auth_container'>
             <AuthLogo logopath={serviceProxy.localStorage.getItem("account_details").primay_logo} />
            <div className='auth_box'>
                <div className='auth_head'>
                    <div className="btxt">
                        Forgot Password
                    </div>
                </div>
                <>
                    <form onSubmit={formik.handleSubmit}>

                        <FormFields
                            type={"text"}
                            name={"email"}
                            label={"Enter Your Email"}
                            show={true}
                            formik={formik}
                            value={formik.values}
                            onChange={formik.handleChange}
                        />
                        <FormFields
                            type={"text"}
                            name={"password"}
                            label={"Enter Your New Password"}
                            show={true}
                            formik={formik}
                            value={formik.values}
                            onChange={formik.handleChange}
                        />


                    </form>
                </>
                <div onClick={formik.submitForm} className='fld_box_btn'>
                    Reset Password
                </div>
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000} // Close Snackbar after 3 seconds
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={SnackbarError ? "error" : "success"}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ForgotPassword