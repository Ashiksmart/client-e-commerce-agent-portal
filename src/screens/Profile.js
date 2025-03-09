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
import RecommendedProducts from "../components/RecommendedProducts";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State variables
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [addressInfo, setAddressInfo] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [templateFields, setTemplateFields] = useState({});
  const [profileUrl, setProfileUrl] = useState("");
  const [dynamicValues, setDynamicValues] = useState({});

  const account_id = serviceProxy.localStorage.getItem('account_details')?.account_id?.toString() || '';
  const user_id = serviceProxy.localStorage.getItem('userId')?.toString();

  useEffect(() => {
    fetchProfile();
    fetchDropdownValues();
    fetchTemplateFields();
  }, []);

  // Fetch profile details
  const fetchProfile = async () => {
    const userCriteria = { id: user_id };
    const userFields = ["id", "first_name", "last_name", "email", "phone_number", "avatar_url"];
    const user = await serviceProxy.business.find(
      constants.Application,
      constants.MODULES.Profile,
      "view",
      userCriteria,
      userFields
    );
    
    if (user?.records) {
      setProfile(user.records[0]);
      if (user.records[0]?.avatar_url) {
        setProfileUrl(account_info.image_domain + JSON.parse(user.records[0].avatar_url).file_path.replace('/domains/plum-wasp-686705.hostingersite.com/public_html', ""));
      }
      fetchAddress();
    }
  };

  // Fetch address data
  const fetchAddress = async () => {
    const addressCriteria = { user_id };
    const addressFields = ["id", "name", "mobile", "address", "landmark", "pincode", "city", "state", "country", "is_default"];
    const address = await serviceProxy.business.find(
      constants.Application,
      constants.MODULES.Address,
      "view",
      addressCriteria,
      addressFields
    );
    if (address?.records) {
      setAddressInfo(address.records);
      setLoading(false);
    }
  };

  // Fetch template fields (e.g., User Profile, Address)
  const fetchTemplateFields = () => {
    const templateCriteria = { name: { $in: ['USR_CU', 'USR_ADDRESS'] } };
    serviceProxy.business.find(
      constants.Application,
      constants.MODULES.Template,
      "view",
      templateCriteria,
      ["id", "name"]
    ).then((template) => {
      if (template?.records?.length) {
        template.records.forEach(fetchTemplateFieldsData);
      }
    });
  };

  const fetchTemplateFieldsData = (templateInfo) => {
    const templateFieldsCriteria = { account_id, template_id: { $eq: templateInfo.id.toString() }, show_on: "Client" };
    serviceProxy.business.find(
      constants.Application,
      constants.MODULES.TemplatesField,
      "view",
      templateFieldsCriteria
    ).then((templateFields) => {
      if (templateFields?.records?.length) {
        setTemplateFields((prev) => ({ ...prev, [templateInfo.name]: templateFields.records }));
      }
    });
  };

  const fetchDropdownValues = () => {
    const templateCriteria = { is_active: { $eq: 'Y' } };
    serviceProxy.business.find(
      constants.Application,
      constants.MODULES.LocationState,
      "view",
      templateCriteria,
      ["state_name", "state_code"]
    ).then((template) => {
      if (template?.records?.length) {
        setDynamicValues((prev) => ({
          ...prev,
          state: template.records.map((e) => ({ name: e.state_name, value: JSON.stringify(e) }))
        }));
      }
    });
  };

  const handleSnackbarClose = () => setSnackbarMessage("");

  const handleProfileUpdate = async (data) => {
    const response = await serviceProxy.business.update(constants.Application, constants.MODULES.Profile, data);
    return response;
  };

  const handleFileUpload = async (data, mode) => {
    const response = mode === constants.CREATE_MODE
      ? await serviceProxy.fileUpload.upload(constants.Application, constants.MODULES.Profile, data)
      : await serviceProxy.fileUpload.delete(constants.Application, constants.MODULES.Profile, [data.file_path], [data.docId]);
    return response;
  };

  const handleAction = async (data, mode) => {
    if (mode === constants.UPLOAD_MODE) {
      await handleFileUpload([data[0]], constants.CREATE_MODE);
      const userProfile = { docId: data[0].docId, file_path: data[0].file_path };
      await handleProfileUpdate({ avatar_url: JSON.stringify(userProfile), id: profile.id });
      setSnackbarMessage("Upload Successfully");
      fetchProfile();
    } else if (mode === constants.UPDATE_MODE) {
      await handleProfileUpdate(data);
      setSnackbarMessage("Update Successfully");
      fetchProfile();
    } else {
      // Handle Address Add/Edit/Delete actions here
    }
  };

  if (loading) return <AppLoader />;

  return (
    <>
      <Header />
      <div className="cbody">
        <div className="container container_center">
          {/* Profile Section */}
          <div className="cart_box">
            <div className="head_row">
              <div className="mdtxt">Your Profile</div>
              <div>
                <div className="btn btn_danger" onClick={() => serviceProxy.localStorage.clear() && navigate('/')}>Logout</div>
              </div>
            </div>
            <div className="col_sec">
              <div className="prof_sec">
                <div className="prof_sec_sub">
                  <ProfileImageUpload profile={profileUrl} action={handleAction} fetchProfile={fetchProfile} />
                  <div className="row_sec">
                    <div className="mdtxt">{profile.first_name} {profile.last_name}</div>
                    <div className="smtxt">Email: {profile.email}</div>
                    <div className="smtxt">Phone: {profile.phone_number}</div>
                  </div>
                </div>
                <div className="prof_sec_btn">
                  <div className="btn btn_primary" onClick={() => handleAction(null, constants.UPDATE_MODE)}>Edit Profile</div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="cart_box">
            <div className="col_head">
              <div className="mdtxt">Your Addresses</div>
              <div>
                <div className="list_box_btn list_box_btn_primary" onClick={() => handleAction({}, constant.BTN_ACTION.ADDRESS_ADD)}>Add New Address</div>
              </div>
            </div>
            <div className="col_sec">
              {addressInfo.map((item, i) => (
                <div key={i} className="prof_sec">
                  <div className="mdtxt">{item.name}</div>
                  <div className="smtxt">{item.address}, {item.city}, {item.state}, {item.pincode}</div>
                  <div className="buy_accord_ft">
                    <div className="clnk" onClick={() => handleAction(item, constant.BTN_ACTION.ADDRESS_EDIT)}>Edit</div>
                    <div className="clnk cred" onClick={() => handleAction(item, constant.BTN_ACTION.ADDRESS_DELETE)}>Remove</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <RecommendedProducts />

      </div>
      <Footer />

      {/* Drawer for editing Profile or Address */}
      <AppDrawer
        children={<AppForm formSchema={templateFields} action={handleAction} />}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      {/* Snackbar */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" onClose={handleSnackbarClose}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;