import { useEffect, useState } from "react";
import Listing from "../components/Listing";
import Banner from "../components/Banner";
import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import DynamicPage from "../components/DynamicPage/DynamicPage";
import { SubCategoryList } from "../components/CategoryListing";
import Filter from "../components/Filter";
import "../styles/Common.scss";
import Footer from "../components/Footer";
import { FilterFilled } from "@ant-design/icons";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from 'lodash/debounce';
import _ from "lodash";
import { jwtDecode } from 'jwt-decode';
import { handleImages } from "../constants/imagepath";
import RecommendedProducts from "../components/RecommendedProducts";

const AllCategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract category data from location state
  const categoryData = location?.state?.query || [];
  
  // Get Account ID based on logged-in status
  const accountId = () => {
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      return jwtDecode(serviceProxy.auth.getJWTToken()).account_id;
    }
    return serviceProxy.localStorage.getItem('account_info')?.account;
  };

  // Handle click on subcategory item
  const handleClickSubCategory = (data) => {
    const item = {
      sub_category_id: { "$eq": data.id },
      is_active: { "$eq": "Y" },
      account_id: { "$eq": accountId() },
      details: {
        "$.is_attributed": "Y",
        "$.city": serviceProxy.localStorage.getItem("cityCode"),
        "$.tags": serviceProxy.localStorage.getItem("searchQuery")
      }
    };
    navigate(`/products`, { state: { query: item } });
  };

  // Handle click on category item
  const handleClick = (item) => {
    navigate(`/category`, { state: { categoryquery: { app_id: item } } });
  };

  // Utility function to get the image URL
  const getImagePath = (image) => {
    if (!image || image === "null" || image === undefined) {
      return handleImages().imagepath;
    }
    return handleImages(image, 1).imagepath;
  };

  return (
    <>
      <Header />
      <div className="cbody">
        {categoryData.map((category, index) => (
          <div key={index} className="catg_cont">
            <div className="catg_title">
              <div className="list_lg_sub_icob">
                <img
                  src={serviceProxy.localStorage.getItem('account_info').image_domain + category.icon.replace('/domains/plum-wasp-686705.hostingersite.com/public_html', "")}
                  alt={category.name}
                  className="list_lg_sub_ico"
                />
              </div>
              <h3
                className="chead_title"
                onClick={() => handleClick(category.app_id)}
              >
                {category.name}
              </h3>
            </div>
            <div className="list_lg_box catg_box">
              {category.value.map((item, i) => (
                <div
                  key={item?.id}
                  className="list_lg_sub_box"
                  onClick={() => handleClickSubCategory(item)}
                >
                  <div className="list_lg_sub_icob">
                    <img
                      className="list_lg_sub_ico"
                      src={serviceProxy.localStorage.getItem('account_info').image_domain + JSON.parse(item.details).icon[0].file_path.replace('/domains/plum-wasp-686705.hostingersite.com/public_html', "")}
                      alt={item?.name}
                    />
                    <img
                      className="list_lg_sub_icobg"
                      src={serviceProxy.localStorage.getItem('account_info').image_domain + JSON.parse(item.details).icon[0].file_path.replace('/domains/plum-wasp-686705.hostingersite.com/public_html', "")}
                      alt={item?.name}
                    />
                  </div>
                  <div className="list_lg_lbl">{item?.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <RecommendedProducts />
      </div>
      <Footer />
    </>
  );
};

export default AllCategoryPage;