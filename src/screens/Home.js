/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import Header from "../components/Header";
import CategoryListing from "../components/CategoryListing";
import "../styles/Common.scss";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { AppLoader } from "../components/CommonEssentials";
import serviceProxy, { serviceProxyUpdate } from "../services/serviceProxy";
import Constants from "../constants";
import { jwtDecode } from 'jwt-decode';
import DynamicPage from "../components/DynamicPage/DynamicPage";
import _ from "lodash";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [displayData, setDisplayData] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [flow, setFlow] = useState([]);
  const [trigger, setTrigger] = useState(false);
  
  serviceProxy.localStorage.setPrefixKey("b4b");
  // Check for login status and set default values
  useEffect(() => {
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      serviceProxy.localStorage.setItem("cityCode", "");
      serviceProxy.localStorage.setItem("cityName", "All City");
    }

    // Set account info if not already present
    if (serviceProxy.localStorage.getItem("account_info") === "") {
      serviceProxy.account.domain(Constants.DOMAIN).then((res) => {
        if (res.status === 200) {
          setAccountInfo(res.data.data);
           fetchFlow();
        }
      });
    } else {
       fetchFlow();
    }

    if (!serviceProxy.auth.getJWTToken()) {
      serviceProxy.localStorage.setItem('isLoggedIn', false);
    }
  }, []);

  // Set account information in local storage
  const setAccountInfo = (data) => {
    serviceProxy.localStorage.setItem("account_details", data);
    const account = {
      account: data.account_id,
      image_domain: data.api_domain.wop,
      api: data.api_domain.api,
      auth: data.api_domain.auth,
    };
    serviceProxy.localStorage.setItem("account_info", account);
    serviceProxy.localStorage.setItem("token", data.temp_token);
    serviceProxyUpdate();
  };

  // Fetch category data
  const fetchCategory = () => {
    const query = {
      is_active: { $eq: "Y" },
      account_id: { $eq: accountId() }
    };
    
    serviceProxy.business.find( Constants.Application, "category_new", "view", query, [], null, null, [], [ { model: "market_place", bindAs: { name: "app_id", value: "label", }, key: { foreign: "app_id", primary: "app_id", rules: { account_id: accountId() }, }, fields: ["label", "app_icon"] }, ] )
    .then((response) => {
      if (response.records.length > 0) {
        restructureCategory(response);
        setDisplayData(selectRandomCategories(response.records));
      } else {
        setCategoryDetails([]);
        setDisplayData([]);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching category:", error);
      setLoading(false);
    });
  };

  // Restructure category data into groups
  const restructureCategory = (data) => {
    const groupedData = data.records.reduce((acc, item, i) => {
      item = { ...item, ...data.associate_to[i][0] };

      if (!acc[item.label]) {
        acc[item.label] = [];
      }

      acc[item.label].push(item);

      return acc;
    }, {});

    const formattedData = Object.entries(groupedData).map(([groupName, groupValue]) => ({
      name: groupName,
      value: groupValue,
      icon: groupValue[0].app_icon,
      app_id: groupValue[0].app_id,
    }));

    setCategoryDetails(formattedData);
  };

  // Randomly select 20 unique categories from the available products
  const selectRandomCategories = (products) => {
    let remainingIndices = Array.from(products.keys());
    const selectedProducts = [];

    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * remainingIndices.length);
      const selectedIndex = remainingIndices[randomIndex];

      if (products[selectedIndex]) {
        products[selectedIndex].details = JSON.parse(products[selectedIndex].details);
        const insertProduct = { ...products[selectedIndex], ...products[selectedIndex] };
        selectedProducts.push(insertProduct);
      }

      remainingIndices.splice(randomIndex, 1);
    }

    return selectedProducts;
  };

  // Fetch flow data
  const fetchFlow = () => {
    const query = {
      account_id: { $eq: accountId() },
      "app_id": { $eq: "0" },
      "page_type": { $eq: "client" },
    };

    serviceProxy.business.find(
      Constants.Application,
      "workflow_status",
      "view",
      query,
      [],
      1,
      10,
      []
    )
    .then((response) => {
      if (response.records.length > 0) {
        setFlow(response.records);
      }
      fetchCategory()
    })
    .catch((error) => {
      console.error("Error fetching flow:", error);
      setLoading(false);
    });
    document.documentElement.style.setProperty('--primary', serviceProxy.localStorage.getItem("account_details").primay_color)
    document.documentElement.style.setProperty('--secondary', serviceProxy.localStorage.getItem("account_details").secondary_color)
  };

  const navigation = useNavigate();

  // Get the account ID
  const accountId = () => {
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      return jwtDecode(serviceProxy.auth.getJWTToken()).account_id;
    } else {
      return serviceProxy.localStorage.getItem('account_info').account;
    }
  };

  // Display loader while data is being fetched
  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <Header setTrigger={setTrigger} services={categoryDetails} />
      <div className="cbody" style={{ paddingTop: 50 }}>
        <div className="gry_bg">
          <div className="container container_center">
            <CategoryListing alldata={categoryDetails} services={displayData} navigation={navigation} />
            {flow.length > 0 && <DynamicPage Flow={flow} />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;