import React, { useState, useEffect } from 'react';
import serviceProxy from '../services/serviceProxy';
import Constants from '../constants';
import { Snackbar, Alert } from "@mui/material";
import { IMAGES } from '../assets';
import NO_IMG from "../assets/png/Noimage2.png"

function ProfileImageUpload(props) {
  const { profile, fetchProfile, action } = props
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [SnackbarError, setSnackbarError] = useState(false);
  const [avatar, setavatar] = useState();
  const [APIURL, setAPIURL] = useState(false);
  const [documentData, setdocumentData] = useState({});

  useEffect(() => {

    if (profile != "") {
      setavatar(profile)

    } else {
      setavatar(NO_IMG)

    }
  }, [])

  const uploadFile = (e) => {
    if (e.target.id == "file_profile") {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setavatar(reader.result);
        };
        reader.readAsDataURL(file);
      }
      action(e.target.files, Constants.UPLOAD_MODE);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarError(false)
    setOpenSnackbar(false);
  };


  return (
    <div style={{
      width: 100
    }}>
      <div className='prof_imgb'>
        <img
          className='auth_himg'
          src={avatar}
          alt="profile"
        />
        {/* {avatar !== null &&
          <div className='prof_del'>
            <div className='list_box_btn btn_lgt'
              onClick={() => deleteFile()}>
              <img style={{width: 20, height: 20, opacity: 0.8}} 
              alt="trash" src={require("../assets/png/trash-bin.png")} />
            </div>
          </div>
        } */}
      </div>
      <label
        className='list_box_btn list_box_btn_primary'
        htmlFor='file_profile' style={{
          minWidth: 100,
          marginTop: 10,
          display: 'inline-block'
        }} >
        Upload
        <input id="file_profile"
          style={{ display: 'none' }}
          type="file" onChange={uploadFile}
          accept="image/*" />
      </label>
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
  );
}

export default ProfileImageUpload;
