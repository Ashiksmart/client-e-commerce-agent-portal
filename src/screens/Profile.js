/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import serviceProxy from "../services/serviceProxy";
import constants from "../constants";
import { Snackbar, Alert, Dialog } from "@mui/material";
import ProfileImageUpload from "../components/ProfileImageField";
import { useNavigate } from "react-router-dom";
import { AppLoader } from "../components/CommonEssentials";
import AppDrawer from '../components/AppDrawer';
import AppForm from "./AppForm";
import { useDispatch, useSelector } from "react-redux";
import { SET_DATA } from '../redux/slices/store';
import { ConsoleSqlOutlined } from "@ant-design/icons";
import { forEach } from "lodash";
import RecommendedProducts from "../components/RecommendedProducts";

const Profile = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [profOpen, setProfOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [addressInfo, setAddressInfo] = useState({});
  const [address, setAddress] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [templatefield, settemplatefield] = useState({})
  const [Apifield, setApifield] = useState({})
  const [constant, setconstant] = useState({
    BTN_ACTION: {
      EDIT_PROFILE: "edit_profile",
      ADDRESS_ADD: "create_address",
      ADDRESS_EDIT: "update_address",
      ADDRESS_DELETE: "Delete_address",
    }
  })

  const account_id = serviceProxy.localStorage.getItem('account_details')?.account_id.toString() || ''
  const account_info = serviceProxy.localStorage.getItem('account_info')
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [DyanmicValues, setDyanmicValues] = useState({})
  const [Profileurl, setProfileurl] = useState("")
  const user_id = serviceProxy.localStorage.getItem('userId').toString()

  const navigate = useNavigate()
  useEffect(() => {
    fetchProfile();
    console.log("useEffect End");
    DropdownDependence()
    fetchtemplate()
    // setDrawerOpen(true)
    // navigate("/join-as-agent",  { state: { partner_id:undefined , type:"employee" } })
  }, []);


  const fetchtemplate = () => {
    const templateCriteria = { name: { $in: ['USR_CU', 'USR_ADDRESS'] } };
    const templateFields = ["id", "name"];
    serviceProxy.business.find(
      constants.Application,
      constants.MODULES.Template,
      "view",
      templateCriteria,
      templateFields
    ).then((template) => {
      if (template?.records?.length > 0) {
        template?.records?.forEach((res) => {
          fetchtemplateFields(res)
        })
      }
    })

  };

  const fetchtemplateFields = (templateinfo) => {
    const templateFieldsCriteria = { account_id, template_id: { $eq: templateinfo.id.toString() }, show_on: "Client" };
    serviceProxy.business.find(
      constants.Application,
      constants.MODULES.TemplatesField,
      "view",
      templateFieldsCriteria, undefined, null, null
    ).then((templateFields) => {
      if (templateFields?.records?.length > 0) {
        console.log(templateFields, "templateFields")
        setApifield((set) => {
          set[templateinfo.name] = templateFields.records
          return set
        })
        // console.log("ssssssssssss")
        // validationCreation(templateFields.records)
        // setTemplateFields(templateFields.records)
        // setLoading(false)
      }
    })
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
            return { name: e.state_name, value: JSON.stringify(e) }
          })
          return set
        })
      }
    })

  };

  const ApiSelectload = async (model, value) => {
    if (model == "city" && typeof value == "string") {
      console.log(value)
      console.log(value)
      var stateObject

      stateObject = await JSON.parse(value);
      const templateCriteria = { is_active: { $eq: 'Y' }, state_code: { $eq: stateObject.state_code } };
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
            return { name: e.city_name, value: JSON.stringify(e) }
          })
          dispatch((SET_DATA(dropdata)))
        } else {
          dispatch((SET_DATA(dropdata)))
        }
      })
    }
  }
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };


  const fetchProfile = async () => {
    const userCriteria = { id: user_id };
    const userFields = [
      "id",
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "avatar_url"
    ];
    const user = await serviceProxy.business.find(
      constants.Application,
      constants.MODULES.Profile,
      "view",
      userCriteria,
      userFields
    );

    console.log("user : ", user);

    if (user?.records) {
      setProfile(user.records[0]);
      if (user.records[0]?.avatar_url) {
        setProfileurl(account_info.image_domain + JSON.parse(user.records[0].avatar_url).file_path.replace('/var/www/html', ""))
      }
      await fetchAddress();
    }
  };

  const loadAddress = ((item, type) => {
    setOpen(true);
    setAddress(item);
  })
  const setProfiledata = (() => {
    setProfile({})
    fetchProfile()
  })
  const setAddressdata = (() => {
    fetchProfile()
  })
  const handleLogout = (() => {
    serviceProxy.localStorage.clear()
    navigate('/')
  })

  const fetchAddress = async () => {
    const addressCriteria = { user_id };
    const addressFields = [
      "id",
      "name",
      "mobile",
      "address",
      "landmark",
      "pincode",
      "city",
      "state",
      "country",
      "is_default"
    ];
    const address = await serviceProxy.business.find(
      constants.Application,
      constants.MODULES.Address,
      "view",
      addressCriteria,
      addressFields,
      null,
      null
    );
    if (address?.records) {
      setAddressInfo(address.records);
      setLoading(false);
      console.log("address : ", address);
    }
  };

  const deleteAddress = async (id) => {
    const result = await serviceProxy.business.delete(
      constants.Application,
      constants.MODULES.Address,
      id
    );
    console.log("result : ", result);
    if (result?.statusCode) {
      await fetchAddress(profile.id);
    }
  };

  let fileUpload = async (data, modetype) => {
    let fileUpload
    if (modetype == constants.CREATE_MODE) {
      fileUpload = await serviceProxy.fileUpload
        .upload(
          constants.Application,
          constants.MODULES.Profile,
          data)
    } else if (modetype == constants.DELETE_MODE) {
      fileUpload = await serviceProxy.fileUpload.delete(
        constants.Application,
        constants.MODULES.Profile,
        [data.file_path],
        [data.docId])
    }
    return fileUpload
  }

  let ProfileUpdate = async (data) => {
    return serviceProxy.business
      .update(constants.Application, constants.MODULES.Profile, data)
      .then((res) => {
        console.log(res, "resresresres")
        return res
      })
      .catch((err) => {

      });
  }

  let ButtonAction = async (modetype, data) => {
    if (modetype == constant.BTN_ACTION.EDIT_PROFILE) {
      settemplatefield({ fields: Apifield['USR_CU'], initialValues: profile, mode: constants.UPDATE_MODE, Header: "Edit Your Profile" })
      setDrawerOpen(true)
    } else if (modetype == constant.BTN_ACTION.ADDRESS_ADD) {
      settemplatefield({ fields: Apifield['USR_ADDRESS'], initialValues: {}, mode: constant.BTN_ACTION.ADDRESS_ADD, Header: "Add New Address" })
      setDrawerOpen(true)
    } else if (modetype == constant.BTN_ACTION.ADDRESS_EDIT) {
      settemplatefield({ fields: Apifield['USR_ADDRESS'], initialValues: data, mode: constant.BTN_ACTION.ADDRESS_EDIT, Header: "Edit Address" })
      setDrawerOpen(true)
    }
  }
  let action = async (data, modetype) => {
    if (modetype == constants.UPLOAD_MODE) {

      if (profile.avatar_url != "") {
        await fileUpload(JSON.parse(profile.avatar_url), constants.DELETE_MODE)
      }

      let upload_res = await fileUpload([data[0]], constants.CREATE_MODE)
      console.log(upload_res, "datadatadatadatadata")
      if (upload_res?.data && upload_res?.status == 200) {
        let user_profile = {
          docId: upload_res?.data[0]?.docId,
          file_path: upload_res?.data[0]?.file_path
        }
        await ProfileUpdate({ avatar_url: JSON.stringify(user_profile), id: profile.id })
        setSnackbarMessage("Upload Successfully");
        setOpenSnackbar(true);
        fetchProfile();
      }

    } else if (modetype == constants.UPDATE_MODE) {
      let update_response = await ProfileUpdate(data)
      if (update_response) {
        fetchProfile();
        setDrawerOpen(false)
        setSnackbarMessage("Update Successfully");
        setOpenSnackbar(true);
      }
    } else if (modetype == constant.BTN_ACTION.ADDRESS_ADD) {
      data.user_id = profile.id.toString()
      serviceProxy.business
        .create(constants.Application, constants.MODULES.Address, data)
        .then(async (res) => {
          console.log(res, "resresresres")
          if (res?.statusCode == 201) {
            setDrawerOpen(false)
            setSnackbarMessage("Record Saved");
            setOpenSnackbar(true);
            fetchProfile()
          } else {
            setSnackbarMessage("Failed");
            setOpenSnackbar(true);
          }

        })
        .catch((err) => {
          console.log("ERR : ", err);
          setSnackbarMessage("Failed");
          setOpenSnackbar(true);
        });
    } else if (modetype == constant.BTN_ACTION.ADDRESS_EDIT) {
      data.id = data.id.toString()
      serviceProxy.business
        .update(constants.Application, constants.MODULES.Address, data)
        .then(async (res) => {
          if (res?.statusCode == 200) {
            setDrawerOpen(false)
            setSnackbarMessage("Record Updated");
            setOpenSnackbar(true);
            fetchProfile()
          } else {
            setSnackbarMessage("Failed");
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
  if (loading) {
    return (
      <AppLoader />
    );
  }
  function Json2str(data, value) {
    if (typeof (data) == "string") {
      return JSON.parse(data)[value]
    } else {
      return data
    }
  }

  function Updatedefault(i) {
    let count = 0
    addressInfo.forEach((elm, index) => {
      if (index == i) {
        elm.is_default = 'Y'
      } else {
        elm.is_default = 'N'
      }
      elm.id = elm.id.toString()
      serviceProxy.business.update(constants.Application, constants.MODULES.Address, elm)
        .then(async (res) => {
          if (res?.statusCode == 200) {
            count++
          }

        })
        .catch((err) => {
          console.log("ERR : ", err);
          setSnackbarMessage("Failed");
          setOpenSnackbar(true);
        });
    })

    if (count > 0) {
      setDrawerOpen(false)
      setSnackbarMessage("Address Updated");
      setOpenSnackbar(true);
      fetchProfile()
    } else {
      setSnackbarMessage("Failed");
      setOpenSnackbar(true);
    }

  }

  return (
    <>
      <Header />
      
      <div className="cbody">
        <div className="container container_center">
          <div
            className="cart_box"
            style={{
              flexDirection: "column",
            }}
          >
            <div className="head_row">
              <div className="mdtxt">Your Profile</div>
              <div>
                <div
                  className="btn btn_danger"
                  onClick={handleLogout}>
                  Logout
                </div>
              </div>
            </div>
            <div>
              <div className="col_sec">
                <div className="prof_sec">
                  <div className="prof_sec_sub"
                  >
                    <ProfileImageUpload
                      fetchProfile={fetchProfile}
                      profile={Profileurl}
                      action={action}
                    />
                    <div className="row_sec">
                      <div className="mdtxt">
                        {profile.first_name + " " + profile.last_name}
                      </div>
                      <div className="smtxt">Email: {profile.email}</div>
                      <div className="smtxt">Phone: {profile.phone_number}</div>
                    </div>
                  </div>

                  <div
                    className="prof_sec_btn">
                    {/* <div
                      className="btn btn_primary"
                      onClick={() => navigate('/my-orders', { state: { isBack: false } })}
                    >
                      My Orders
                    </div> */}
                    <div
                      className="btn btn_primary"
                      onClick={() => ButtonAction(constant.BTN_ACTION.EDIT_PROFILE)}
                    >
                      Edit Profile
                    </div>
                    {/* <div
                      className="btn btn_primary"
                      onClick={() => navigate('/join-as-agent-form', { state: { partner_id: undefined, type: "account" } })}

                    >
                      Join
                    </div> */}

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="cart_box"
            style={{
              flexDirection: "column",
            }}
          >
            <div className="col_head">
              <div className="mdtxt">Your Addresses</div>
              <div>
                <div className="list_box_btn list_box_btn_primary" onClick={() => {
                  ButtonAction(constant.BTN_ACTION.ADDRESS_ADD)
                }}>
                  Add New Address
                </div>
              </div>
            </div>
            <div className="col_sec">
              <div className="prof_sec">
                {addressInfo.map((item, i) => {
                  return (
                    <div key={i} className="row_sec addr_sec_box">
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="mdtxt">{item.name}</div>
                        {item.is_default === 'Y' && <div className="detail_badge" style={{ marginRight: "0px" }}>
                          <div className='list_box_badge_txt sl_hide'>
                            {'Default'}
                          </div>
                        </div>}
                      </div>
                      <div className="smtxt">
                        {item.address +
                          ", " +
                          Json2str(item.city, 'city_name') +
                          ", " +
                          Json2str(item.state, 'state_name') +
                          ", " +
                          // item.country +
                          // " " +
                          item.pincode}
                      </div>
                      <div className="smtxt">{item.mobile}</div>
                      <div className="buy_accord_ft">
                        {item.is_default == "N" && <div
                          className="clnk"
                          onClick={() => {
                            Updatedefault(i);
                            setSnackbarMessage("Update Successfully");
                            setOpenSnackbar(true);
                          }}
                        >
                          Set as Default
                        </div>}
                        <div
                          className="clnk"
                          onClick={() => { ButtonAction(constant.BTN_ACTION.ADDRESS_EDIT, item) }}
                        >
                          Edit
                        </div>
                        <div
                          className="clnk cred"
                          onClick={() => {
                            deleteAddress(item.id);
                            setSnackbarMessage("Deleted Successfully");
                            setOpenSnackbar(true);
                          }}
                        >
                          Remove
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <RecommendedProducts></RecommendedProducts>
      </div>
      <Footer />

      <AppDrawer
        children={
          <AppForm formSchema={templatefield} action={action} DyanmicValues={DyanmicValues}
            ApiSelectload={ApiSelectload} />}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Close Snackbar after 3 seconds
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={"success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
