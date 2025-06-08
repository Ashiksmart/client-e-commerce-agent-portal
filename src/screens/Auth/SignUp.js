
import * as Yup from "yup";
import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import '../../styles/Common.scss'
import '../../styles/Auth.scss'
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom'
import FormFields from "../../components/FormFields";
import serviceProxy from "../../services/serviceProxy";
import Constants from "../../constants";
import { AuthLogo } from "../../components/CommonEssentials";
const SignUp = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [SnackbarError, setSnackbarError] = useState(false);
    const [initial_value, setinitial_value] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "phone_number": "",
        "auth": "Y",
        "password": "",
        "user_group": Constants.USER_GROUP

    })
    const navigate = useNavigate()
    const validationSchema = Yup.object().shape({
        first_name: Yup.string().required("Name is required"),
        last_name: Yup.string().optional(),
        phone_number: Yup.string().matches(/^[0-9]+$/, "Mobile must be numeric").max(10).required("Mobile is required"),
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email address'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters long')

    });

    const formik = useFormik({
        initialValues: serviceProxy.localStorage.getItem("userinfo") === "" ? initial_value : serviceProxy.localStorage.getItem("userinfo"),
        validationSchema: validationSchema,
        onSubmit: async (value, { resetForm }) => {
            serviceProxy.localStorage.setItem("userinfo", value)
            console.log(value)
             serviceProxy.user.create('Client', value).then((res) => {
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
                            }
                        }).catch((err) => {
                            setSnackbarError(true)
                            setSnackbarMessage("Invalid User Input Data");
                            setOpenSnackbar(true);
                            serviceProxy.localStorage.removeItem('userinfo')
                        })
            // serviceProxy.otp.send("email", {
            //     "email": value.email,
            //     "type": 1,
            // }).then((res) => {
            //     if (res.status === 201) {

            //         serviceProxy.notification.send(serviceProxy.localStorage.getPrefixKey(), Constants.MODULES.OneTimePassword, { id: res.data.data.id.toString(), email: res.data.data.email, operation: Constants.CREATE_MODE , additional_info:value }).then((res) => {
            //             if (res.status === 200) {
            //                 resetForm();
            //                 setTimeout(() => {
            //                     navigate('/verify-otp')
            //                 }, 3000);
            //                 setSnackbarMessage("Please Check Your Mail for Otp");
            //                 setOpenSnackbar(true);
            //             } else {

            //                 setSnackbarError(true)
            //                 setSnackbarMessage("Failed");
            //                 setOpenSnackbar(true);
            //             }

            //         }).catch((err) => {
            //             console.log("ERR : ", err);
            //             setSnackbarError(true)
            //             setSnackbarMessage("Failed");
            //             setOpenSnackbar(true);
            //         });

            //     } else {

            //         setSnackbarError(true)
            //         setSnackbarMessage("Failed");
            //         setOpenSnackbar(true);
            //     }

            // }).catch((err) => {
            //     console.log("ERR : ", err);
            //     setSnackbarError(true)
            //     setSnackbarMessage("Failed");
            //     setOpenSnackbar(true);
            // });

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
                        Sign Up
                    </div>
                </div>
                <>
                    <form onSubmit={formik.handleSubmit}>

                        <FormFields
                            type={"text"}
                            name={"first_name"}
                            label={"First Name"}
                            show={true}
                            formik={formik}
                            value={formik.values}
                            onChange={formik.handleChange}
                        />
                        <FormFields
                            type={"text"}
                            name={"last_name"}
                            label={"Last Name"}
                            show={true}
                            formik={formik}
                            value={formik.values}
                            onChange={formik.handleChange}
                        />
                        <FormFields
                            type={"text"}
                            name={"phone_number"}
                            label={"Mobile Number"}
                            show={true}
                            formik={formik}
                            value={formik.values}
                            onChange={formik.handleChange}
                        />
                        <FormFields
                            type={"text"}
                            name={"email"}
                            label={"Email"}
                            show={true}
                            formik={formik}
                            value={formik.values}
                            onChange={formik.handleChange}
                        />
                        <FormFields
                            type={"text"}
                            name={"password"}
                            label={"Password"}
                            show={true}
                            formik={formik}
                            value={formik.values}
                            onChange={formik.handleChange}
                        />

                    </form>
                </>
                <div onClick={formik.submitForm} className='fld_box_btn'>
                    Sign Up
                </div>
            </div>
            <div className='auth_ft'>
                <div className='auth_ft_lbl'>
                    Already have an account ?
                </div>
                <div>
                    <div className='auth_ft_lnk' onClick={() => navigate('/login')}>
                        Sign In
                    </div>
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