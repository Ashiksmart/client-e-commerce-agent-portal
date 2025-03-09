import React from 'react';
import "../styles/Listing.scss";
import { handleImages } from "../constants/imagepath";
import serviceProxy from "../services/serviceProxy";
import { jwtDecode } from 'jwt-decode';

// Helper function for handling image paths
const getImagePath = (image, isParse=false) => {
  if (!image || image === "null" || image === "") {
    return handleImages().imagepath; // Default image if no image is provided
  }
  const parsedImage = isParse ? JSON.parse(image) : image;
  return handleImages(parsedImage.icon, 1).imagepath; // Assuming icon exists in parsed data
};

export const SubCategoryList = ({ services, selectedCategory, onTriggerCategory, onEmitData }) => {
  return (
    <div className="sec">
      <div className="list_box_head">
        <div className="list_box_head_txt">
          <span className="detail_btxt sl_hide">Category</span>
          {selectedCategory?.name && (
            <>
              <span className="list_lg_rgtarr"></span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={onTriggerCategory}
              >
                {services.category_name}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="list_lg_sub_cont">
        {services.map((item) => (
          <div
            key={item?.id}
            className="list_lg_sub_box"
            onClick={() => onEmitData(item)}
          >
            <div className="list_lg_sub_icob">
              <img
                className="list_lg_sub_ico"
                src={getImagePath(item.details)}
                alt={item.name}
              />
              <img
                className="list_lg_sub_icobg"
                src={getImagePath(item.details)}
                alt={item.name}
              />
            </div>
            <div className="list_lg_lbl">{item?.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryListing = ({ services, navigation, alldata }) => {
  const accountId = () => {
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn');
    return isLoggedIn
      ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id
      : serviceProxy.localStorage.getItem('account_info').account;
  };

  const handleClick = (data) => {
    const item = {
      sub_category_id: { "$eq": data.id },
      is_active: { "$eq": "Y" },
      account_id: { "$eq": accountId() },
      details: {
        "$.is_attributed": "Y",
        "$.city": serviceProxy.localStorage.getItem("cityCode"),
        "$.tags": serviceProxy.localStorage.getItem("searchQuery"),
      },
    };
    console.log(item);
    navigation(`/products`, { state: { query: item } });
  };

  const handleViewAllClick = () => {
    navigation(`/allcategory`, { state: { query: alldata } });
  };

  return (
    <div className="list_lg_box">
      {services.map((item) => (
        <div
          key={item.id}
          className="bar_head_box"
          onClick={() => handleClick(item)}
        >
          <div className="list_lg">
            <div className="list_lg_imgb">
              <img
                src={getImagePath(item.details, false)}
                alt={item.name}
                className="list_lg_img"
              />
            </div>
            <div className="list_lg_lbl">{item.name.toUpperCase()}</div>
          </div>
        </div>
      ))}
      <div className="btn btn_primary" onClick={handleViewAllClick}>
        View more
      </div>
    </div>
  );
};

export default CategoryListing;