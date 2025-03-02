import React, { useMemo, useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import { useSelector } from "react-redux";
import { CheckBox } from "@mui/icons-material";

const FormFields = (props) => {
    let { disabled, name, label, type, show, required, multiLineRows = 4, selectedVal, formik, optionsvalue = [], value, keyName, change, onChange, onBlur, DyanmicValues, link, ApiSelectload, bool } = props;
    let [options, setoptions] = useState(optionsvalue)
    const dropdown = useSelector((state) => state.AccountInfo.dropdown)

    useEffect(() => {
        if (DyanmicValues?.[name] !== undefined) {
            setoptions(DyanmicValues[name]);
        }
    }, [DyanmicValues]);

    useEffect(() => {
        if (dropdown?.[name] !== undefined) {
            if (dropdown[name].length == 0) {
                formik.setFieldValue(name, "");
            }
            setoptions(dropdown[name]);
        }
    }, [dropdown])
    useEffect(() => {
        if ((link?.is_link == "Y" && link?.link_type == "parent" || value[name]) && ApiSelectload) {
            if (ApiSelectload) {
                ApiSelectload(link.linked_to, value[name])
            }
        }
    }, [])

    const handleSelect = async (name, event) => {
        formik.setFieldValue(name, event.target.dataset.value);
        if ((link.is_link && link.link_type == "parent" || value[name]) && ApiSelectload) {
            if (ApiSelectload) {
                await ApiSelectload(link.linked_to, event.target.dataset.value)
            }
        }
    }
    switch (type) {
        case "text":
            return (
                <>
                    <FormControl
                        className="form_fld_control"
                        style={
                            show
                                ? null
                                : {
                                    display: "none",
                                }
                        }
                        fullWidth
                    >
                        <TextField
                            id="outlined-multiline-flexible"
                            label={label}
                            value={value[name]}
                            type={name === "password" ? 'password' : 'text'}
                            name={name}
                            disabled={disabled}
                            onChange={onChange}
                            className="fld_bg"
                        />
                        <FormHelperText className="form_fld_err" id="component-error-text">
                            {formik.touched[name] || formik.errors[name]}
                        </FormHelperText>
                    </FormControl>

                </>
            );
        case "textarea":
            return (
                <>
                    <FormControl
                        className="form_fld_control"
                        style={
                            show
                                ? null
                                : {
                                    display: "none",
                                }
                        }
                        variant="standard"
                        fullWidth
                    >
                        <TextField
                            id={name}
                            label={label}
                            aria-describedby="component-error-text"
                            multiline
                            rows={multiLineRows}
                            value={value[name]}
                            name={keyName}
                            onChange={onChange}
                        />
                        <FormHelperText className="form_fld_err" id="component-error-text">
                            {formik.touched[name] && formik.errors[name]}
                        </FormHelperText>
                    </FormControl>

                </>
            );

        case "select":
            return (
                <>

                    <FormControl
                        className="form_fld_control"
                        style={
                            show
                                ? null
                                : {
                                    display: "none",
                                }
                        }
                        fullWidth
                    >
                        <InputLabel id="demo-simple-select-error-label">{label}</InputLabel>
                        <Select
                            labelId="demo-simple-select-error-label"
                            id="demo-simple-select-error"
                            value={value[name]}
                            label={label}
                            MenuProps={{
                                style: {
                                    maxHeight: 300
                                }
                            }}
                        >
                            {options.map((o, i) => (
                                <MenuItem
                                    onClick={(event) => handleSelect(name, event)}
                                    key={i} value={o.value}>
                                    {o.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText className="form_fld_err" id="component-error-text"> {formik.touched[name] && formik.errors[name]}</FormHelperText>
                    </FormControl>

                </>
            );
        case "radiobox":
            return (
                <>
                    <FormControl
                        className="form_fld_control"
                        style={
                            show
                                ? null
                                : {
                                    display: "none",
                                }
                        }
                    >
                        <FormLabel id="demo-row-radio-buttons-group-label">{label}</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            {options && options.map((item) => {
                                <FormControlLabel
                                    value={item.value}
                                    control={<Radio />}
                                    label={item.label}
                                    disabled={item.disabled}
                                />
                            })}

                        </RadioGroup>
                        <FormHelperText>{formik.touched[name] && formik.errors[name]}</FormHelperText>

                    </FormControl>

                </>
            );

        case "checkbox":
            return (
                <>
                    <FormControl
                        style={
                            show
                                ? null
                                : {
                                    display: "none",
                                }
                        }
                        required={required}
                        error={formik.errors[name]}
                        component="fieldset"
                        variant="standard"
                    >
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <CheckBox checked={formik.values[name]} onChange={formik.handleChange} name={name} />
                                }
                                label={label}
                            />
                        </FormGroup>
                        <FormHelperText>{formik.touched[name] && formik.errors[name]}</FormHelperText>

                    </FormControl>

                </>
            );

        // case "checkbox":
        //   return (
        //     <>
        //       <InputLabel id={name}>{label}</InputLabel>
        //       {options &&
        //         options.map((option) => {
        //           return (
        //             <FormControlLabel
        //               key={option.value}
        //               control={
        //                 <Checkbox
        //                   disabled={disable}
        //                   checked={formik.values[name].includes(option.value)}
        //                   onChange={formik.handleChange}
        //                   name={name}
        //                   value={option.value}
        //                 />
        //               }
        //               label={option.label}
        //             />
        //           );
        //         })}
        //       <div>{formik.touched[name] && formik.errors[name]}</div>
        //     </>
        //   );

        // case "toggle":
        //   return (
        //     <>
        //       <InputLabel id={name}>{label}</InputLabel>
        //       {options &&
        //         options.map((opt) => (
        //           <FormControlLabel
        //             key={opt.value}
        //             label={formik.values[name]}
        //             disabled={disable}
        //             checked={formik.values[name]}
        //             onChange={(e) => handleToggle(name, formik.values[name])}
        //             control={<Switch color="primary" />}
        //             labelPlacement="end"
        //           />
        //         ))}
        //       <div>{formik.touched[name] && formik.errors[name]}</div>
        //     </>
        //   );

        // case "image":
        //   return (
        //     <>
        //       <InputLabel id={name}>{label}</InputLabel>
        //       <Input
        //         disabled={disable}
        //         type="file"
        //         id="image-input"
        //         name="image" // Change "image" to the actual field name
        //         onChange={(event: any) => {
        //           formik.setFieldValue("file", event.target.files[0]);
        //         }}
        //         inputProps={{ "aria-label": "Select Image" }}
        //       />

        //       <div>{formik.touched[name] && formik.errors[name]}</div>
        //     </>
        //   );

        // case "imageview":
        //   return (
        //     <>
        //       <InputLabel id={name}>{label}</InputLabel>
        //       {formik.values[name] === "" && (
        //         <div>
        //           <InputLabel id={name}>{"Image not uploaded"}</InputLabel>{" "}
        //         </div>
        //       )}
        //       {formik.values[name] !== "" && (
        //         <>
        //           <div
        //             style={{
        //               display: "flex",
        //               flexDirection: "row",
        //               columnGap: "30px",
        //               alignItems: "center",
        //             }}
        //           >
        //             <img
        //               style={{
        //                 display: "block",
        //                 width: "120px",
        //                 height: "120px",
        //                 borderRadius: "20px",
        //                 borderWidth: "2px",
        //                 borderColor: "#14ADFF",
        //                 borderStyle: "solid",
        //                 padding: "5px",
        //               }}
        //               id={name}
        //               src={`data:image/png;base64, ${formik.values[name]}`}
        //               alt={label}
        //             />
        //             <Button
        //               variant="contained"
        //               onClick={() =>
        //                 setImgSource({
        //                   img: formik.values[name],
        //                   label: label,
        //                   show: true,
        //                 })
        //               }
        //             >
        //               Preview
        //             </Button>
        //           </div>
        //         </>
        //       )}
        //     </>
        //   );

        default:
            return null;
    }
};

export default FormFields;
