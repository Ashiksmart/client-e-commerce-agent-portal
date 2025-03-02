import { useNavigate, useLocation } from 'react-router-dom'
import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import { useFormik } from "formik";
import FormFields from '../components/FormFields'
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import serviceProxy from '../services/serviceProxy';
import constants from '../constants';
import { AppLoader } from "../components/CommonEssentials";
import { Alert, Snackbar, Link, Stack,Box } from '@mui/material';
import { SET_DATA } from '../redux/slices/store';
import { useDispatch, useSelector } from "react-redux";
import JoinCondition from './JoinCondition';
import { jwtDecode } from 'jwt-decode';
import Constants from '../constants';

const JoinAgentForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const location = useLocation();
    const ActInfo = location?.state
    const account_id = serviceProxy.localStorage.getItem('account_details')?.account_id.toString() || ''
    const inputFields = constants.INPUT
    const [loading, setLoading] = useState(true);
    const [templateFields, setTemplateFields] = useState([])
    const [fieldValidation, setFieldValidation] = useState({})
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [fieldValues, setFieldValues] = useState({})
    const [DyanmicValues, setDyanmicValues] = useState({})
    const [bool, setbool] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [agreed, setAgreed] = useState(false)
    const [flowData, setFlowData] = useState({})

    const onAgree = () => {
        if (agreed) {
            setAgreed(false)
        }
        else {
            setAgreed(true)
        }
    }
    const accountId = () => {
        const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')
        return isLoggedIn ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id : serviceProxy.localStorage.getItem('account_info').account
    }

    useEffect(() => {
        const fetchFlow = () => {
            const account_id = accountId()
            const detailsQuery = {
                account_id: { $eq: account_id },
                "app_id": {
                    "$eq": ActInfo?.type == "employee" ? "-4" : "-3"
                },
                "page_type": {
                    "$eq": "client"
                }
            }

            serviceProxy.business.find(Constants.Application, "workflow_status", "view", detailsQuery, [], 1, 10, [])
                .then((response) => {
                    if (response.records.length > 0) {
                        setFlowData((set) => {
                            response.records.forEach(element => {
                                console.log(JSON.parse(element.content));
                                element.content = JSON.parse(element.content)
                            });
                            return response.records
                        })
                        // setFlowData(response.records)
                    }

                }).catch((error) => {
                    console.log(error)
                })
        }
        fetchFlow()
    }, [])

    useEffect(() => {
        account_id ? fetchtemplate() : navigate('/login')
        account_id ? DropdownDependence() : navigate('/login')

        console.log(ActInfo, "ActInfo")
        if (ActInfo == null || ActInfo == undefined) {
            navigate('/')
        }
    }, [])

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const DropdownDependence = () => {

        const templateCriteria = { is_active: { $eq: 'Y' } };
        const templateFields = ["state_name", "state_code"];
        serviceProxy.business.find(
            constants.Application,
            constants.MODULES.LocationState,
            "view",
            templateCriteria,
            templateFields, null, null
        ).then((template) => {
            if (template?.records?.length > 0) {
                setDyanmicValues((set) => {
                    set["state"] = template.records.map((e) => {
                        return { name: e.state_name, value: e.state_code }
                    })
                    return set
                })
            }
        })

    };

    const ApiSelectload = (model, value) => {
        if (model == "city") {
            const templateCriteria = { is_active: { $eq: 'Y' }, state_code: { $eq: value } };
            const templateFields = ["city_name", "city_code"];
            serviceProxy.business.find(
                constants.Application,
                constants.MODULES.LocationCity,
                "view",
                templateCriteria,
                templateFields, null, null
            ).then((template) => {
                let dropdata = {
                    city: []
                }
                if (template?.records?.length > 0) {
                    dropdata.city = template.records.map((e) => {
                        return { name: e.city_name, value: e.city_code }
                    })
                    dispatch((SET_DATA(dropdata)))
                } else {
                    dispatch((SET_DATA(dropdata)))
                }
            })
        }
    }
    const fetchtemplate = () => {
        const templateCriteria = { name: { $eq: ActInfo?.type == "employee" ? 'USR_CU' : 'PART_CU' } };
        const templateFields = ["id"];
        serviceProxy.business.find(
            constants.Application,
            constants.MODULES.Template,
            "view",
            templateCriteria,
            templateFields
        ).then((template) => {
            if (template?.records?.length > 0) {
                fetchtemplateFields(template.records[0].id.toString())

            }
        })

    };

    const fetchtemplateFields = (templateId) => {
        const templateFieldsCriteria = { account_id, template_id: { $eq: templateId }, show_on: "Client" };
        serviceProxy.business.find(
            constants.Application,
            constants.MODULES.TemplatesField,
            "view",
            templateFieldsCriteria, undefined, 1, 50
        ).then((templateFields) => {
            if (templateFields?.records?.length > 0) {
                console.log("ssssssssssss")
                validationCreation(templateFields.records)
                setTemplateFields(templateFields.records)
                setLoading(false)
            }
        })
    };

    const validationCreation = (templateFields) => {
        let fieldObj = {}
        let fieldValues = {}
        for (const field of templateFields) {

            if (field.required === 'Y') {

                if (field.model === "email") {
                    fieldObj[field.model] = Yup.string().email("Invalid email").required(`${field.label} is required`)
                } else if (field.model === "phone_number") {
                    fieldObj[field.model] = Yup.string().matches(/^[0-9]+$/, "Mobile must be numeric").required(`${field.label} is required`)
                } else {
                    fieldObj[field.model] = Yup.string().required(`${field.label} is required`)
                }
            } else {
                if (field.model === "email") {
                    fieldObj[field.model] = Yup.string().email("Invalid email")
                } else if (field.model === "phone_number") {
                    fieldObj[field.model] = Yup.string().matches(/^[0-9]+$/, "Mobile must be numeric")
                } else {
                    fieldObj[field.model] = Yup.string()
                }
            }
            fieldValues[field.model] = ''
        }
        setFieldValidation(fieldObj)
        setFieldValues(fieldValues)
    }
    const validationSchema = Yup.object().shape(fieldValidation)
    const formik = useFormik({
        initialValues: fieldValues,
        validationSchema: validationSchema,
        onSubmit: (value, { resetForm }) => {
            let { partner_id } = ActInfo
            if (ActInfo?.type == "account") {
                serviceProxy.partner
                    .create(value)
                    .then((r) => {
                        console.log("r : ", r);


                        if (r?.name !== "AxiosError" && r.status == 201) {
                            setSnackbarMessage("Request Sent");
                            handleResetForm();
                            resetForm();
                            setOpenSnackbar(true);
                            setbool(false)
                        } else {
                            console.log("ERR : ", r);
                            const error = r?.response?.data?.message ?? "Failed"
                            setSnackbarMessage(error);
                            setOpenSnackbar(true);
                        }
                    })
                    .catch((err) => {
                        console.log("ERR : ", err);
                        setSnackbarMessage("Failed");
                        setOpenSnackbar(true);
                    });
            } else if (ActInfo?.type == "employee") {
                let payload = {
                    ...value,
                    partner_id,
                    auth: "N",
                    password: "Employeee@1234",
                    additional_info: {
                        auth_req: "N"
                    }
                }
                serviceProxy.user.create("Employee", payload).then((r) => {
                    if (r?.name !== "AxiosError" && r.status == 201) {
                        setSnackbarMessage("Request Sent");
                        handleResetForm();
                        resetForm();
                        setOpenSnackbar(true);
                        setbool(false)
                    } else {
                        console.log("ERR : ", r);
                        const error = r?.response?.data?.message ?? "Failed"
                        setSnackbarMessage(error);
                        setOpenSnackbar(true);
                    }
                })
                    .catch((err) => {
                        console.log("ERR : ", err);
                        setSnackbarMessage("Failed");
                        setOpenSnackbar(true);
                    });

            }

        }
    })
    const formikRef = useRef(formik);

    const handleResetForm = () => {
        formikRef.current.resetForm();
    };
    if (loading) {
        return (
            <AppLoader />
        );
    }


    return (
        <div>
            <Header />

            <div className='cbody'>
                <div className="container modal_cont">

                    <div>

                        {!showForm ?
                            <JoinCondition
                                agreed={agreed}
                                onAgree={onAgree}
                                flowData={flowData}
                            />
                            : null}

                        {bool && showForm &&
                            <>
                                <div className='modal_box'>
                                    <div className="modal_head">
                                        Join As a {ActInfo?.type == "employee"?" Employee":" Agent"}
                                    </div>
                                    <div className='modal_body'>
                                        <div className="form_container">
                                            <form onSubmit={formik.handleSubmit}>
                                                <div>
                                                    {templateFields.map((t) => {
                                                        return <>
                                                            <FormFields
                                                                type={inputFields[t.type]}
                                                                name={t.model}
                                                                label={t.label}
                                                                show={true}
                                                                formik={formik}
                                                                value={formik.values}
                                                                onChange={formik.handleChange}
                                                                optionsvalue={JSON.parse(t.values)?.values}
                                                                DyanmicValues={DyanmicValues}
                                                                link={JSON.parse(t.link)}
                                                                ApiSelectload={ApiSelectload}
                                                                bool={bool}
                                                            />
                                                        </>
                                                    })}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="form_ft">
                                        <div className='form_ft_sec'>
                                            <div className="btn btn_danger" onClick={() => { handleResetForm(); navigate(-1) }}>
                                                Cancel
                                            </div>
                                            <div className="btn btn_primary" onClick={formik.submitForm}>
                                                Send
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>}
                        {!showForm ?
                            <div className="form_ft">
                                <div className='form_ft_sec'>
                                    <div className={agreed ? '' : 'disabled'}>
                                        <div
                                            className={`btn btn_primary`}
                                            onClick={() => agreed && !showForm ? setShowForm(true) : setShowForm(false)}>
                                            Next
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}
                    </div>

                    {!bool && <>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            sx={{ my: 2 }}
                        >
                           
                            <Box sx={{ display: 'block' }}>
                                <Link variant="subtitle2" underline="hover" component="button" onClick={() => { handleResetForm(); navigate(-1) }}>
                                    {"Your request Send Successfully Go Back"}
                                </Link>
                            </Box>
                        </Stack>
                    </>}
                </div>
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000} // Close Snackbar after 3 seconds
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarMessage === "Request Sent" ? "success" : "error"}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default JoinAgentForm