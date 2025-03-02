import { Formik } from "formik";
import FormFields from "../components/FormFields";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import constants from '../constants';
import Button from '@mui/material/Button';
import Iconify from '../components/iconify'
export function createYupSchema(schema, config) {
  const { model, validationType, validations = [], label } = config;

  if (!Yup[validationType]) {
    return schema;
  }
  let validator = Yup[validationType]();
  validations.forEach((validation) => {
    const { params, type } = validation;
    if (!validator[type]) {
      return;
    }
    validator = validator[type](...params);
  });

  schema[model] = validator;
  return schema;
}

const AppForm = (props) => {
  const {
    formSchema,
    action,
    DyanmicValues = {},
    ApiSelectload
  } = props
  let yupSchema = {}
  const inputFields = constants.INPUT

  let initialValues = {};

  formSchema?.fields.forEach((fld) => {
    fld.validationType = JSON.parse(fld.validations).validations
    console.log(fld.validationType, createYupSchema({}, fld), "fld.validationType")
    yupSchema = { ...yupSchema, ...createYupSchema({}, fld) }
    // initialValues[fld.model] = ""
  })
  initialValues = formSchema.initialValues
  const validationSchema = Yup.object().shape(yupSchema);
  console.log(yupSchema, "yupSchema")

  return (
    <>
      <div className="container modal_cont">
        <div className="modal_head">
          {formSchema.Header}
        </div>
        <div className="modal_body">
          <div className="form_container">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={async (values) => {
              console.log(values, "values")
              action(values, formSchema.mode)
            }}>

              {(props) => (
                <>
                  <form onSubmit={props.handleSubmit}>
                    <div>
                      {formSchema?.fields.map((t) => {
                        return (
                          <>
                            <FormFields
                              type={inputFields[t.type]}
                              name={t.model}
                              label={t.label}
                              show={true}
                              formik={props}
                              value={props.values}
                              onChange={props.handleChange}
                              optionsvalue={JSON.parse(t.values)?.values}
                              DyanmicValues={DyanmicValues}
                              link={JSON.parse(t.link)}
                              ApiSelectload={ApiSelectload}
                            />
                          </>
                        );
                      })}
                    </div>
                    <div className="form_ft">
                      <div>
                        <div
                          className="btn btn_primary"
                          onClick={props.submitForm} variant="contained"
                          startIcon={<Iconify icon="fluent:save-28-filled" />}>
                          Save
                        </div>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppForm;
