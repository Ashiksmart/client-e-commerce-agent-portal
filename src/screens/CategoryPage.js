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

const CategoryPage = () => {
  const location = useLocation();
  const categorydata = location?.state?.categoryquery

  const [Flow, setFlow] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const navigation = useNavigate();
  const accountId = () => {
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')
    return isLoggedIn ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id : serviceProxy.localStorage.getItem('account_info').account
  }
  useEffect(() => {
    fetchCategory()
    fetchFlow()
  }, [])
  const fetchCategory = async () => {
    // let category_id = JSON.parse(Decode(categorydata).catagory_id)
    console.log(categorydata, "categorydatacategorydatacategorydata")
    let appiids = categorydata.app_id
    const account_id = accountId()
    serviceProxy.business
      .find(Constants.Application, Constants.MODULES.Category, "view", {is_active:{$eq:"Y"}, account_id: { $eq: account_id }, app_id: { $eq: appiids } }, [], null, null, [])
      .then((response) => {
        if (response.records.length > 0) {
          setCategoryDetails(
            response.records
          )
        } else {
          setCategoryDetails([])
        }


      }).catch((error) => {
        console.log("error : ", error);

      })
  }

  const handleClickSubCategory = (data) => {

    let item = {
      sub_category_id: { "$eq": data.id },
      is_active:{"$eq":"Y"},
      account_id:{"$eq":accountId()},
      details: {
        "$.is_attributed": "Y",
        "$.city": serviceProxy.localStorage.getItem("cityCode"),
        "$.tags": serviceProxy.localStorage.getItem("searchQuery")
      }
    }
    console.log(item);
    navigation(`/products`, { state: { query: item } })

  }
  const fetchFlow = () => {
    let urldata = categorydata.app_id
    const account_id = accountId()
    const detailsQuery = {
      account_id: { $eq: account_id },
      "app_id": {
        "$eq": urldata
      },
      "page_type": {
        "$eq": "client"
      }
    }

    serviceProxy.business.find(Constants.Application, "workflow_status", "view", detailsQuery, [], 1, 10, [])
      .then((response) => {
        if (response.records.length > 0) {
          setFlow(response.records)
        }

      }).catch((error) => {
        console.log(error)
      })
  }

  return (
    <>
      <Header />

      <div className="cbody">
        <div className="container container_center">
          <div className="gry_bg">
            {categoryDetails.length > 0 && (
              <SubCategoryList
                services={categoryDetails}
                onEmitData={handleClickSubCategory}
              />
            )}
          </div>
          {Flow.length > 0 && <DynamicPage Flow={Flow}></DynamicPage>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
