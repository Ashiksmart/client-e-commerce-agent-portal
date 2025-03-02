
import * as Yup from "yup";
import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import '../../styles/Common.scss'
import '../../styles/Auth.scss'
import FormField from '../../components/FormElements'
import { useNavigate, useLocation } from 'react-router-dom'
import FormFields from "../../components/FormFields";
import serviceProxy from "../../services/serviceProxy";
import { Snackbar, Alert } from "@mui/material";
import { AuthLogo } from "../../components/CommonEssentials";
import { jwtDecode } from "jwt-decode";
const SignUp = () => {
    const location = useLocation();
    console.log(location.pathname)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [Logo, setLogo] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [SnackbarError, setSnackbarError] = useState(false);
    const [initial_value, setinitial_value] = useState({
        "otp": "",


    })
    const navigate = useNavigate()
    const validationSchema = Yup.object().shape({
        otp: Yup.string()
            
            .required('OTP is required'),

    });

    const formik = useFormik({
        initialValues: initial_value,
        validationSchema: validationSchema,
        onSubmit: async (value, { resetForm }) => {
            serviceProxy.otp.verify('email', { email: serviceProxy.localStorage.getItem("account_details").email }, value.otp).then((res) => {
                if (res.data.statusCode === 200) {
                    if (location.pathname === "/verify-otp") {
                        serviceProxy.user.create('Client', serviceProxy.localStorage.getItem('userinfo')).then((res) => {
                            
                            if (res.status === 201) {
                                resetForm();
                                serviceProxy.localStorage.setItem('token', res.data.data.token)
                                serviceProxy.localStorage.setItem('isLoggedIn', true)
                                const user_id = jwtDecode(res.data.data.token)?.id
                                serviceProxy.localStorage.setItem("userId", user_id)
                                serviceProxy.localStorage.removeItem('userinfo')
                                navigate('/')
                            } else if(res.response.status===400 && res.response.data.message==="Client Role User Limit Reached"){
                                setSnackbarError(true)
                                setSnackbarMessage("User limit reached");
                                setOpenSnackbar(true);
                                serviceProxy.localStorage.removeItem('userinfo')
                                setTimeout(() => {
                                    navigate('/')
                                }, 3000);
                            }else {

                                setSnackbarError(true)
                                setSnackbarMessage("Invalid User Input Data");
                                setOpenSnackbar(true);
                                serviceProxy.localStorage.removeItem('userinfo')
                                setTimeout(() => {
                                    navigate('/')
                                }, 3000);
                            }
                        }).catch((err) => {
                            setSnackbarError(true)
                            setSnackbarMessage("Invalid User Input Data");
                            setOpenSnackbar(true);

                        })
                    } else {
                        serviceProxy.auth.resetpassword(serviceProxy.localStorage.getItem('userinfo')).then((res) => {
                            if (res.status === 200) {
                                resetForm();
                                serviceProxy.localStorage.setItem('token', res.data.data.token)
                                const user_id = jwtDecode(res.data.data.token)?.id
                                serviceProxy.localStorage.setItem("userId", user_id)
                                serviceProxy.localStorage.removeItem('userinfo')
                                navigate('/')
                            } else {
                                setSnackbarError(true)
                                setSnackbarMessage("Invalid User Input Data");
                                setOpenSnackbar(true);
                            }
                        }).catch((err) => {
                            setSnackbarError(true)
                            setSnackbarMessage("Invalid User Input Data");
                            setOpenSnackbar(true);

                        })
                    }

                } else {
                    setSnackbarError(true)
                    setSnackbarMessage("Otp Not found try again");
                    setOpenSnackbar(true);
                }
            }).catch((err) => {

                setSnackbarError(true)
                setSnackbarMessage("Failed");
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
                        Veriy Your OTP
                    </div>
                </div>
                <>
                    <form onSubmit={formik.handleSubmit}>

                        <FormFields
                            type={"text"}
                            name={"otp"}
                            label={"Enter Your Otp"}
                            show={true}
                            formik={formik}
                            value={formik.values}
                            onChange={formik.handleChange}
                        />


                    </form>
                </>
                <div onClick={formik.submitForm} className='fld_box_btn'>
                    Verify
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

export default SignUp