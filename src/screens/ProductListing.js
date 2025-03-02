import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Listing from "../components/Listing";
import Banner from "../components/Banner";
import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import { SubCategoryList } from "../components/CategoryListing";
import Filter from "../components/Filter";
import "../styles/Common.scss";
import Footer from "../components/Footer";
import { FilterFilled } from "@ant-design/icons";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { useLocation } from "react-router-dom";
import debounce from "lodash/debounce";
import _ from "lodash";
import { NoData, AppLoader, CBack } from "../components/CommonEssentials";
import { checkFilterObj } from "../utils/utilities";
import { useSelector } from "react-redux";
import RecommendedProducts from "../components/RecommendedProducts";
const ProductListing = () => {
  const location = useLocation();
  const filterParam = location?.state?.query;
  const [openFilter, setOpenFilter] = useState(false);
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [trigger, setTrigger] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [productList, setProductList] = useState([]);
  const [filter, setFilter] = useState({});
  const [filterTitle, setfilterTitle] = useState({});
  const [forceRender, setForceRender] = useState(false);
  const account_id = serviceProxy.localStorage.getItem("account_info")?.account;
  let decoderData = filterParam;
  let query = {
    account_id: { $eq: account_id },
    is_active: { $eq: "Y" },
    ...decoderData,
  };
  console.log(decoderData, "222222222");
  const checkResize = () => {
    const mediaQuery = window.matchMedia("(min-width: 1400px)");
    if (mediaQuery?.matches) {
      setOpenFilter(true);
    } else {
      setOpenFilter(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", checkResize);
    // checkResize()
  });
 

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      setProductLoading((prevProductLoading) => {
        if (!prevProductLoading) {
          setPage((prev) => prev + 1);
        }
        return prevProductLoading;
      });
    }
  };

  const debouncedHandleScroll = debounce(handleScroll, 200); // Adjust the delay as needed

  useEffect(() => {
    const cityCode =
      serviceProxy.localStorage.getItem("cityCode")?.toString() || "";
    const searchQuery =
      serviceProxy.localStorage.getItem("searchQuery")?.toString() || "";
    setOpenFilter(false);
    let queryObj = {};
    if (cityCode) {
      if (cityCode === "") {
        queryObj.cityCode = "";
      } else {
        queryObj.cityCode = cityCode;
      }
    }
    queryObj.searchQuery = searchQuery;
    if (!_.isEmpty(queryObj)) {
      setFilter(queryObj);
    } else {
      triggeringProducts();
    }
  }, [trigger]);

  useEffect(() => {
    setPage(1);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, []);

  useEffect(() => {
    if (!_.isEmpty(filter)) {
      triggeringProducts();
    }
  }, [filter]);

  const triggeringProducts = () => {
    setProductList([]);
    setPage(1);
    setTotalRecords(1);
    setForceRender((prev) => !prev);
  };

  useEffect(() => {
    setTotalRecords((prev) => prev);
  }, [totalRecords]);

  useEffect(() => {
    if (totalRecords > productList?.length) {
      fetchProductApplications(query);
    }
  }, [page, forceRender]);

  const fetchProductApplications = (query) => {
    setProductLoading(true);
    let details = {};
    if (!_.isEmpty(filter.cityCode)) {
      details["$.city"] = filter.cityCode === "" ? "" : filter.cityCode;
    }

    if (!_.isEmpty(filter.searchQuery)) {
      details["$.tags"] = filter.searchQuery;
    }
    details["$.is_attributed"] = "Y";

    if (!_.isEmpty(filter.filterItem)) {
      details = { ...details, ...filter.filterItem };
    }

    if (!_.isEmpty(details)) {
      query.details = { ...query.details, ...details };
    }
    console.log(
      filter,
      "filterfilterfilter",
      details,
      "eeeeeeeeeeeeeeeeeee0",
      query.details
    );
    if (!_.isEmpty(filter.appid)) {
      query.category_id = filter.appid;
      delete query.sub_category_id;
    }
    if (!_.isEmpty(filter.subcat_id)) {
      query.sub_category_id = filter.subcat_id;
    }
    setfilterTitle(simplifyObject(query, ["account_id", "is_active"]));
    // (query)
    query["account_id"] = { $eq: account_id };
    query["is_active"]= { $eq: "Y" }
    console.log(query);
    query = checkFilterObj(query);
    serviceProxy.business
      .find(Constants.Application, "product", "view", query, [], page, 5, [])
      .then((response) => {
        setTotalRecords(response?.cursor?.totalRecords);
        const productData = (response?.records ?? []).map((list) => {
          const { details, additional_info, ...rest } = list;
          if (details || additional_info) {
            try {
              const detailData = JSON.parse(details);
              const additional_info_Data = JSON.parse(additional_info);
              return {
                ...rest,
                details: detailData,
                additional_info_Data: additional_info_Data,
              };
            } catch (error) {
              console.error("Error parsing sub_category:", error);
            }
          }
        });

        if (page === 1) {
          setProductList([]);
        }

        setProductList((previous) => [...previous, ...productData]);
        setProductLoading(false);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setProductLoading(false);
        setLoading(false);
      });
  };
  const simplifyObject = (inputObj, keysToRemove) => {
    keysToRemove.forEach((key) => delete inputObj[key]);
    return inputObj;
  };
  const handleClickCategory = () => {
    let queryObj = {};
    const cityCode =
      serviceProxy.localStorage.getItem("cityCode")?.toString() || "";
    const searchQuery =
      serviceProxy.localStorage.getItem("searchQuery")?.toString() || "";

    if (cityCode) {
      if (cityCode === "") {
        queryObj.cityCode = "";
      } else {
        queryObj.cityCode = cityCode;
      }
    }

    if (searchQuery) {
      queryObj.searchQuery = searchQuery;
    }

    if (!_.isEmpty(queryObj)) {
      setFilter(queryObj);
    }

    query = {
      account_id: { $eq: account_id },
      is_active: { $eq: "Y" },
      ...decoderData,
    };
    setProductList(() => []);
    setTotalRecords(1);
    setPage(1);
  };

  // const handleClickSubCategory = (item) => {
  //   setSelectedCategory({ id: item?.id, name: item?.name, costing: item?.costing })
  //   query.sub_category_id = { $eq: item?.id }
  //   setProductList(() => [])
  //   setTotalRecords(1)
  //   setForceRender(prev => !prev);
  //   setPage(1)
  // }
 


  const handleFilter = (item) => {
    let queryObj = {};
    let filterClone = filter;
    setProductList(() => []);
    setPage(1);
    if (!_.isEmpty(item?.appid)) {
      queryObj.appid = item.appid;
      // if (filterClone?.filterItem?.["$.brand"]) {
      //   let removeBrand = filterClone.filterItem
      //   delete removeBrand["$.brand"]
      //   filterClone.filterItem = removeBrand
      // }
      console.log("queryObj : ", queryObj);
      filterClone.filterItem = {};
      delete filterClone["subcat_id"];
      // if (filterClone?.subcat_id) {
      //   delete filterClone["subcat_id"]

      // }
    } else if (!_.isEmpty(item?.subcat_id)) {
      queryObj.subcat_id = item.subcat_id;
      // if (filterClone?.filterItem?.["$.brand"]) {
      //   let removeBrand = filterClone.filterItem
      //   delete removeBrand["$.brand"]
      //   filterClone.filterItem = removeBrand
      // }
      filterClone.filterItem = {};
    } else if (!_.isEmpty(filterClone.filterItem) && !_.isEmpty(item)) {
      queryObj.filterItem = { ...filterClone.filterItem, ...item };
    } else if (!_.isEmpty(item)) {
      queryObj.filterItem = item;
    }
    if (!_.isEmpty(filterClone) && !_.isEmpty(queryObj)) {
      setFilter({ ...filterClone, ...queryObj });
    } else if (!_.isEmpty(queryObj)) {
      setFilter(queryObj);
    }
    setLoading(false);
  };

  

  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <Header setTrigger={setTrigger} />
      <div className="cbody">
        <div className="layout_listing">
          <div className="container">
            <div className="sec">
              <div className="list_box_head">
                <div className="list_box_head_txt">
                <div className="list_box_head_subs">
                  <CBack
                    navigate={navigate}
                  />
                  <div className="list_box_head_txt">
                    {filterTitle &&
                      filterTitle?.details?.hasOwnProperty("$.tags")
                      && filterTitle?.details?.["$.tags"] !== "" ?
                      <>
                        <span style={{
                          color: "grey",
                          fontWeight: "100",
                          paddingRight: "5px"
                        }}>
                          Search Results for:
                        </span>
                        {filterTitle?.details?.["$.tags"]}
                      </>
                      :
                      null
                      /* <>
                        {JSON.stringify(filterTitle)}
                        {JSON.stringify(categoryDetails)}
                        <span style={{
                          color: "grey",
                          fontWeight: "100",
                          paddingRight: "5px"
                        }}>
                          Search Results for:
                        </span>
                        {filterTitle &&
                          filterTitle?.details &&
                          filterTitle?.details?.hasOwnProperty("sub_category_id") &&
                          categoryDetails.filter((item) => item.id === filterTitle?.sub_category_id["$eq"])}
                      </> */
                    }
                  </div>
                </div>
                </div>
                {!openFilter ? (
                  <div
                    className="list_box_head_filt"
                    onClick={() => {
                      setOpenFilter((s) => !s);
                    }}
                  >
                    <FilterFilled
                      style={{
                        color: "#535353",
                      }}
                    />
                  </div>
                ) : null}
              </div>
              <div className="list_container">
                {productList.length > 0 &&
                  (productList ?? []).map((list) => {
                    return (
                      <Listing
                        key={list.id}
                        details={list?.details ?? JSON.parse(list?.details)}
                        listOfProducts={list}
                        loading={productLoading}
                      />
                    );
                  })}
                  
                {productList.length === 0 && !productLoading && (
                  <NoData
                    txt={`No Data Found`}
                  />
                )}
               { !productLoading &&<RecommendedProducts/>}
                {productList.length === 0 && productLoading && <AppLoader />}
              </div>
            </div>
          </div>
          {openFilter && (
            <Filter
              setLoading={setLoading}
              handleFilter={handleFilter}
              category_id={query.category_id?.$eq}
              sub_category_id={query.sub_category_id?.$eq}
              setOpenFilter={setOpenFilter}
              query={filter}
              handleClickCategory={handleClickCategory}
            ></Filter>
          )}

          {/* <div className={openFilter ? "filter_nav filt_open" : "filter_nav"}>
          <div className="empty_box_rgt"></div>
      
        </div> */}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductListing;
