import { useEffect, useState } from "react";
import Slider from "react-slick";
import Banner from "../components/Banner";
import Header from "../components/Header";
import { PrevArrow, NextArrow } from "../components/SliderEssentials";
import UnderConstruction from "../components/UnderConstruction";
import CategoryListing from "../components/CategoryListing";
import "../styles/Common.scss";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { OfferCovers, AppLoader } from "../components/CommonEssentials";
import { useDispatch } from "react-redux";
import serviceProxy, { serviceProxyUpdate } from "../services/serviceProxy";
import Constants from "../constants";
import { jwtDecode } from 'jwt-decode'
import DynamicPage from "../components/DynamicPage/DynamicPage";
import { SET_CATEGORY_DETAILS } from "../redux/slices/store";
import _ from "lodash";
const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [displaydata, setdisplaydata] = useState([])
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [Flow, setFlow] = useState([]);
  const [trigger, setTrigger] = useState(false);

  serviceProxy.localStorage.setPrefixKey("b4b")

  useEffect(() => {

    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      serviceProxy.localStorage.setItem("cityCode", "")
      serviceProxy.localStorage.setItem("cityName", "All City")
    }
    // serviceProxy.localStorage.setItem("searchQuery", "")
    if (serviceProxy.localStorage.getItem("account_info") === "") {
      serviceProxy.account.domain(Constants.DOMAIN).then((res) => {
        if (res.status === 200) {
          serviceProxy.localStorage.setItem("account_details", res.data.data)
          let account = {
            account: res.data.data.account_id,
            image_domain: res.data.data.api_domain.wop,
            api: res.data.data.api_domain.api,
            auth: res.data.data.api_domain.auth
          }
          serviceProxy.localStorage.setItem("account_info", account)
          serviceProxy.localStorage.setItem("token", res.data.data.temp_token)
          serviceProxyUpdate()
          fetchCategory()
        }
      })
    } else {
      fetchCategory()
    }

    if (!serviceProxy.auth.getJWTToken()) {
      serviceProxy.localStorage.setItem('isLoggedIn', false)
    }
  }, [])

  const fetchCategory = () => {
    fetchFlow()
    serviceProxy.business
      .find(Constants.Application, "category_new", "view", { is_active: { $eq: "Y" }, account_id: { $eq: accountId() } }, [], null, null, [], [{
        "model": "market_place",
        "bindAs": {
          "name": "app_id",
          "value": "label"
        },
        "key": {
          "foreign": "app_id",
          "primary": "app_id",
          "rules": { account_id: accountId() }
        },
        "fields": [
          "label", "app_icon"
        ]
      },])
      .then((response) => {
        if (response.records.length > 0) {

          restructureCategory(response)
          let products = []
          products = response.records
          let output = [];
          let remainingIndices = Array.from(products.keys());

          // Randomly select 5 unique elements from the products array
          for (let i = 0; i < 20; i++) {
            let randomIndex = Math.floor(Math.random() * remainingIndices.length);
            let selectedIndex = remainingIndices[randomIndex];
            if (products[selectedIndex] !== undefined) {
              products[selectedIndex].details = JSON.parse(products[selectedIndex].details)
              let insertproduct = { ...products[selectedIndex], ...response.associate_to[selectedIndex][0] }
              output.push(insertproduct);

            }
            remainingIndices.splice(randomIndex, 1);

          }

          setdisplaydata(output)



        } else {
          setCategoryDetails([])
          setdisplaydata([])
        }
        setLoading(false)
      }).catch((error) => {
        console.log("error : ", error);
        setLoading(false)
      })
  }
  const restructureCategory = (data) => {
    let groupedData = data.records.reduce((acc, item, i) => {
      item = { ...item, ...data.associate_to[i][0] };

      if (!acc[item.label]) {
        acc[item.label] = [];
      }


      acc[item.label].push(item);


      return acc;
    }, {});
    console.log(groupedData, "groupedDatagroupedDatagroupedData")
    let formattedData = Object.entries(groupedData).map(([groupName, groupValue]) => {
      return { name: groupName, value: groupValue, icon: groupValue[0].app_icon, app_id: groupValue[0].app_id };
    });

    setCategoryDetails(formattedData);
  };

  const fetchFlow = () => {
    const account_id = accountId()
    const detailsQuery = {
      account_id: { $eq: account_id },
      "app_id": {
        "$eq": "0"
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
        setLoading(false)
      }).catch((error) => {
        setLoading(false)
      })
  }

  // dispatch(SET_CATEGORY_DETAILS(categoryDetails))
  const navigation = useNavigate();

  const accountId = () => {
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')
    return isLoggedIn ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id : serviceProxy.localStorage.getItem('account_info').account
  }

  if (loading) {
    return (
      <AppLoader />
    );
  }

  return (
    <>
      <Header setTrigger={setTrigger} services={categoryDetails} />
      <div className="cbody" style={{
        paddingTop: 50
      }}>

        <div className="gry_bg">
          <div className="container container_center">
            {<CategoryListing alldata={categoryDetails} services={displaydata} navigation={navigation} />}
            {Flow.length > 0 && <DynamicPage Flow={Flow}></DynamicPage>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
