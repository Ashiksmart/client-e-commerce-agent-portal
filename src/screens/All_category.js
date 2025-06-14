import { useEffect, useState } from "react";
import Listing from "../components/Listing";
import Banner from "../components/Banner";
import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import DynamicPage from "../components/DynamicPage/DynamicPage";
import {
  SubCategoryList
} from "../components/CategoryListing";
import Filter from "../components/Filter";
import "../styles/Common.scss";
import Footer from "../components/Footer";
import { FilterFilled } from "@ant-design/icons";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { useLocation } from "react-router-dom";
import debounce from 'lodash/debounce';
import _ from "lodash"
import { jwtDecode } from 'jwt-decode'
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleImages } from "../constants/imagepath";
import RecommendedProducts from "../components/RecommendedProducts";
const AllCategoryPage = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const categorydata = location?.state?.query
  const accountId = () => {
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')
    return isLoggedIn ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id : serviceProxy.localStorage.getItem('account_info').account
  }
  const handleClickSubCategory = (data) => {

    let item = {
      sub_category_id: { "$eq": data.id },
      is_active: { "$eq": "Y" },
      account_id: { "$eq": accountId() },
      details: {
        "$.is_attributed": "Y",
        "$.city": serviceProxy.localStorage.getItem("cityCode"),
        "$.tags": serviceProxy.localStorage.getItem("searchQuery")
      }
    }
    console.log(item);
    navigation(`/products`, { state: { query: item } })

  }
  const handleClick = (item) => {


    navigation(`/category`, { state: { categoryquery: { app_id: item } } })

  }
  const Images = (image) => {
    if (image === "null" || image === "" || image === undefined || image === null) {
      return handleImages().imagepath
    } else {
      console.log(image, "imageimageimageimage")
      let imagepath = image
      return handleImages(imagepath.icon, 1).imagepath
    }

  }
  return (
    <>
      <Header />
      <div className="cbody">
        {categorydata.map((category, index) => (
          <div key={index} className="catg_cont">

            <div className="catg_title">
              <div className="list_lg_sub_icob">
                <img
                  src={serviceProxy.localStorage.getItem('account_info').image_domain + category.icon.replace('/var/www/html', "")}
                  alt={category.name}
                  className="list_lg_sub_ico"
                />
              </div>
              <h3
                className="chead_title"
                onClick={() => {
                  handleClick(category.app_id)
                }}>
                {category.name}
              </h3>
            </div>
            <div className="list_lg_box catg_box">
              {category.value.map((item, i) => (
                <div className="list_lg_sub_box" key={item?.id}
                  onClick={() => {
                    handleClickSubCategory(item)
                  }}>
                  {/* {JSON.stringify(item)} */}
                  <div className="list_lg_sub_icob">
                    <img
                      className="list_lg_sub_ico"
                      src={serviceProxy.localStorage.getItem('account_info').image_domain + JSON.parse(item.details).icon[0].file_path.replace('/var/www/html', "")}
                      alt=""
                    />
                    <img
                      className="list_lg_sub_icobg"
                      src={serviceProxy.localStorage.getItem('account_info').image_domain + JSON.parse(item.details).icon[0].file_path.replace('/var/www/html', "")}
                      alt=""
                    />
                  </div>
                  <div className="list_lg_lbl">{item?.name}</div>
                </div>

              ))}
            </div>
          </div>
        ))}
        <RecommendedProducts></RecommendedProducts>
      </div>
      <Footer />
    </>

  );
};

export default AllCategoryPage;
