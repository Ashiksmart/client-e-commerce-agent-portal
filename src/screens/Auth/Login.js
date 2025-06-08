
import * as Yup from "yup";
import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import '../../styles/Common.scss'
import '../../styles/Auth.scss'
import { useNavigate } from 'react-router-dom'
import FormFields from "../../components/FormFields";
import serviceProxy from "../../services/serviceProxy";
import { Snackbar, Alert } from "@mui/material";
import { AuthLogo } from "../../components/CommonEssentials";
import { jwtDecode } from 'jwt-decode'
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
        username: Yup.string()
            .required('Email is required')
            .email('Invalid email address'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters long')

    });
    useEffect(() => {
        document.documentElement.style.setProperty('--primary', serviceProxy.localStorage.getItem("account_details").primay_color)
        document.documentElement.style.setProperty('--secondary', serviceProxy.localStorage.getItem("account_details").secondary_color)
    }, [])
    const formik = useFormik({
        initialValues: initial_value,
        validationSchema: validationSchema,
        onSubmit: async (value, { resetForm }) => {
            console.log(value);
            serviceProxy.auth.login(value.username, value.password, "Client").then((res) => {
                console.log(res);
                if (res.status === 200) {
                    resetForm();
                    serviceProxy.localStorage.setItem('token', res.data.token)
                    serviceProxy.localStorage.setItem('isLoggedIn', true)
                    const user_id = jwtDecode(res.data.token)?.id
                    serviceProxy.localStorage.setItem("userId", user_id)
                    navigate('/')
                } else {
                    setSnackbarError(true)
                    setSnackbarMessage("Invalid User Input Data");
                    setOpenSnackbar(true);
                }
            }).catch((err) => {
                console.log(err);
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
                        Login
                    </div>
                </div>
                <>
                    <form onSubmit={formik.handleSubmit}>

                        <FormFields
                            type={"text"}
                            name={"username"}
                            label={"Enter Your Email"}
                            show={true}
                            formik={formik}
                            value={formik.values}
                            onChange={formik.handleChange}
                        />
                        <FormFields
                            type={"text"}
                            name={"password"}
                            label={"Enter Your Password"}
                            show={true}
                            formik={formik}
                            value={formik.values}
                            onChange={formik.handleChange}
                        />

                    </form>
                </>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                    </div>
                    <div className='fld_box_lnk' onClick={() => navigate('/forgot-password')}>
                        Forgot Password?
                    </div>
                </div>
                <div onClick={formik.submitForm} className='fld_box_btn'>
                    Login
                </div>
            </div>
            <div className='auth_ft'>
                <div className='auth_ft_lbl'>
                    Create an New account now ?
                </div>
                <div>
                    <div className='auth_ft_lnk' onClick={() => navigate('/signup')}>
                        Sign Up
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

export default ForgotPassword