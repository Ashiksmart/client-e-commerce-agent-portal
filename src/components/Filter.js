import "../styles/Filter.scss";
import { useEffect, useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import _ from "lodash";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { jwtDecode } from 'jwt-decode'
import { red } from "@mui/material/colors";
const Filter = (props) => {
  const [categoryDetail, setCategoryDetail] = useState([]);
  const [subcategoryDetail, setSubCategoryDetail] = useState([]);
  const [brand, setBrand] = useState([])
  const [partner, setpartner] = useState([])
  const [filter_param, setfilter_param] = useState({
    brand: "",
    price: "",
    offer_percent: "",
    app_id: "",
    subcategory_id: "", partner_id: ""
  })
  const { category_id, sub_category_id, categoryDetails, setOpenFilter, selectedCategory, brandList, handleFilter, onEmitData, handleClickCategory, query } = props;
 
  const accountId = () => {
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')
    return isLoggedIn ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id : serviceProxy.localStorage.getItem('account_info').account
  }

  useEffect(() => {
    let filterdatas = {
      brand: query?.filterItem?.["$.brand"]?.['$eq'],
      price: query?.filterItem?.["$.price"],
      offer_percent: query?.filterItem?.["$.offer_percent"]?.['$gt'],
      app_id: query?.appid?.['$eq'],
      subcategory_id: query?.subcat_id?.['$eq'],
      partner_id: query?.filterItem?.["$.partner_id"]?.['$eq'],
    }
    console.log(filterdatas, query, "sub_category_idsub_category_id")
    setfilter_param(filterdatas)

    fetchPartner()
    if (query?.appid?.['$eq']) {
      fetchSubCategory(query.appid['$eq'])
    }

    if (query?.subcat_id?.['$eq']) {
      brandApi(query.subcat_id['$eq'], query.appid['$eq'])
    }

    if (category_id === undefined) {
      fetchCategory()
    } else {
      fetchCategory(category_id)
      setfilter_param((set) => {
        set.app_id = category_id
        return set
      })
    }



    if (category_id !== undefined && sub_category_id === undefined) {
      fetchSubCategory(category_id)
    }
    else if (category_id !== undefined && sub_category_id !== undefined) {
      fetchSubCategory(category_id, sub_category_id)
      setfilter_param((set) => {
        set.subcategory_id = sub_category_id
        return set
      })
      brandApi(sub_category_id, category_id)
    }
  }, [])

  const fetchSubCategory = async (app_id, id) => {

    const account_id = accountId()
    let filterobj = { account_id: { $eq: account_id }, is_active: { $eq: "Y" }, app_id: { $eq: app_id } }
    if (id !== undefined) {
      filterobj["id"] = { $eq: id }
    }
    serviceProxy.business
      .find(Constants.Application, Constants.MODULES.Category, "view", filterobj, [], null, null, [])
      .then((response) => {
        if (response.records.length > 0) {
          setSubCategoryDetail(response.records)
        } else {
          setSubCategoryDetail([])
        }
      }).catch((error) => {
        console.log("error : ", error);
      })
  }
  const brandApi = async (id, appid_) => {
    const account_id = accountId()
    serviceProxy.business
      .find(Constants.Application, "brand", "view", { account_id: { $eq: account_id }, app_id: { $eq: appid_ }, is_active: { $eq: "Y" }, category_id: { $eq: id } }, [], null, null, [])
      .then((response) => {
        if (response.records.length > 0) {
          setBrand(response.records)
        } else {
          setBrand([])
        }


      }).catch((error) => {
        console.log("error : ", error);
      })
  }
  const fetchCategory = async (id) => {

    const account_id = accountId()
    let filterobj =
      { is_client_show: { $eq: "Y" }, account_id: { $eq: account_id }, is_default: { $eq: "N" }, is_active: { $eq: "Y" }, show_on_market: { $eq: "Y" } }
    if (id !== undefined) {
      filterobj["id"] = { $eq: id }
    }
    serviceProxy.business
      .find(Constants.Application, "market_place", "view", filterobj, [], null, null, [])
      .then((response) => {
        if (response.records.length > 0) {
          setCategoryDetail(response.records)
        } else {
          setCategoryDetail([])
        }


      }).catch((error) => {
        console.log("error : ", error);

      })
  }

  const fetchPartner = async () => {

    const account_id = accountId()
    let filterobj = {
      account_id: { $eq: account_id }, auth: { $eq: "Y" }, active: { $eq: "Y" }, roles: { $in: ["Superadmin", "SubSuperadmin"] }
    }
    serviceProxy.business
      .find(Constants.Application, "user", "view", filterobj, [], null, null, [])
      .then((response) => {
        if (response.records.length > 0) {
          setpartner(response.records)
        } else {
          setpartner([])
        }
      }).catch((error) => {
        console.log("error : ", error);
      })
  }

  const priceSort = {
    name: 'Price',
    values: [{
      displayName: "Under ₹1,000",
      value: { "$lt": "1001" }
    }, {
      displayName: "₹1,000 - ₹5,000",
      value: { "$gt": "999", "$lt": "5001" }
    }, {
      displayName: "₹5,000 - ₹10,000",
      value: { "$gt": "4999", "$lt": "10001" }
    }, {
      displayName: "₹10,000 - ₹20,000",
      value: { "$gt": "9999", "$lt": "20001" }
    }, {
      displayName: "Above ₹20,000",
      value: { "$gt": "19999" }
    }]
  }

  const discount = {
    name: 'Discount',
    values: [{
      displayName: "Any Discount",
      value: "0"
    }, {
      displayName: "10% Off or more",
      value: "9"
    }, {
      displayName: "25% Off or more",
      value: "24"
    }, {
      displayName: "35% Off or more",
      value: "34"
    }, {
      displayName: "50% Off or more",
      value: "49"
    }, , {
      displayName: "60% Off or more",
      value: "59"
    }, , {
      displayName: "70% Off or more",
      value: "69"
    }]
  }
  const reset = () => {
    setCategoryDetail([]);
    setSubCategoryDetail([]);
    setfilter_param((set) => {
      set.app_id = ""
      set.subcategory_id = ""
      set.brand = ""
      set.offer_percent = ""
      set.partner_id = ""
      set.price = ""
      return set
    })

    setBrand([])
  }
  const handleClickAppid = (data) => {
      if(filter_param.app_id !== data) {
          // { "category_id": { "$eq": item.id } }
          console.log("handleClickAppid : ", filter_param, "data : ",data);
          setfilter_param((set) => {
            set.app_id = data
            return set
          })
      
          fetchSubCategory(data)
          setfilter_param((set) => {
            set.subcategory_id = ""
            set.brand = ""
            set.partner_id = ""
            set.offer_percent = ""
            set.price = ""
            return set
          })
          setBrand([])
          handleFilter({ appid: { "$eq": data } })
      
      }
  }
  const handleClickSubCategoryid = (data) => {
    if(filter_param.subcategory_id !== data) {
    setfilter_param((set) => {
      set.subcategory_id = data
      set.brand = ""
      set.partner_id = ""
      set.offer_percent = ""
      set.price = ""
      return set
    })
    brandApi(data, filter_param.app_id)
    handleFilter({ subcat_id: { "$eq": data } })
  }
  }

  const passFilter = (filter, param, value, isPrice = false) => {
    if (isPrice) {
      const key = Object?.keys?.(value)?.[0];
      if (filter_param[param]?.[key] !== value?.[key]) {
        setfilter_param((set) => {
          set[`${param}`] = value;
          return set;
        });
        handleFilter(filter);
      } 
      // else {
      //   setfilter_param((set) => {
      //     set[`${param}`] = "";
      //     return set;
      //   });
      //   handleFilter(filter);
      // }
    } else {
      if (filter_param[param] !== value) {
        setfilter_param((set) => {
          set[`${param}`] = value;
          return set;
        });
        handleFilter(filter);
      } 
      // else {
      //   setfilter_param((set) => {
      //     set[`${param}`] = "";
      //     return set;
      //   });
      //   handleFilter(filter);
      // }
    }
  }

  return (

    <div className="filter_box">
      {/* {JSON.stringify(sub_category_id ? true : false)} */}
      <div className="filter_head">
        <div className="filter_head_lbl">Filter</div>
      </div>
      <div className="filter_box_body">

        {categoryDetail.length > 0 &&
          <div className="filter_sub_box">
            <div className="filter_sub_head">
              <div className="filter_sub_head_txt">{"Category"}</div>
              {/* <div>
              <CaretDownFilled />
            </div> */}
            </div>
            <div className="filter_sub_body">
              <div className="filter_sec_container">
                {(categoryDetail).map((item, i) => {
                  return (
                    <div
                      className={`filter_sec_box ${filter_param.app_id == item.id ? "filter_active" : ""}`}
                      key={i} onClick={() => { handleClickAppid(item.id) }}>
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>}
        {subcategoryDetail.length > 0 &&
          <div className="filter_sub_box">
            <div className="filter_sub_head">
              <div className="filter_sub_head_txt">{"Sub Category"}</div>
              {/* <div>
              <CaretDownFilled />
            </div> */}
            </div>
            <div className="filter_sub_body">
              <div className="filter_sec_container">

                {(subcategoryDetail).map((item, i) => {
                  return (
                    <div
                      className={`filter_sec_box ${filter_param.subcategory_id == item.id ? "filter_active" : ""}`}
                      key={i} onClick={() => { handleClickSubCategoryid(item.id) }}>
                      {item.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>}
        {subcategoryDetail.length > 0 && categoryDetail.length > 0 &&
          <div>
            {brand.length > 0 && <div className="filter_sub_box">
              <div className="filter_sub_head">
                <div className="filter_sub_head_txt">{"Brand"}</div>
                {/* <div>
                <CaretDownFilled />
              </div> */}
              </div>
              <div className="filter_sub_body">
                <div className="filter_sec_container">
                  {(brand).map((item, i) => {
                    return (
                      <div
                        className={`filter_sec_box ${filter_param.brand == item.id ? "filter_active" : ""}`}
                        key={i} onClick={() => { passFilter({ "$.brand": { "$eq": item.id } }, "brand", item.id) }}>
                        {item.brand_name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>}
            <div className="filter_sub_box">
              <div className="filter_sub_head">
                <div className="filter_sub_head_txt">{priceSort.name}</div>
                {/* <div>
                <CaretDownFilled />
              </div> */}
              </div>
              <div className="filter_sub_body">
                <div className="filter_sec_container">
                  {(priceSort.values ?? []).map((item, index) => {
                    return (
                      <div
                        className={`filter_sec_box ${JSON.stringify(filter_param.price) === JSON.stringify(item.value) ?
                          "filter_active" : ""}`}
                        key={index} onClick={() => {
                          passFilter({ "$.price": item.value }, "price", item.value, true)
                        }}>
                        {item.displayName}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="filter_sub_box">
              <div className="filter_sub_head">
                <div className="filter_sub_head_txt">{discount.name}</div>
                {/* <div>
                <CaretDownFilled />
              </div> */}
              </div>

              <div className="filter_sub_body">
                <div className="filter_sec_container">

                  {(discount.values ?? []).map((item, index) => {
                    return (
                      <div
                        className={`filter_sec_box ${filter_param.offer_percent === item.value ?
                          "filter_active" : ""}`}
                        key={index} onClick={() => {
                          passFilter({ "$.offer_percent": { "$gt": item.value } }, "offer_percent", item.value)
                        }}>
                        {item.displayName}{JSON.stringify(item.value)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="filter_sub_box">
              <div className="filter_sub_head">
                <div className="filter_sub_head_txt">{"Seller"}</div>
                {/* <div>
                <CaretDownFilled />ஃ
              </div> */}
              </div>

              <div className="filter_sub_body">
                <div className="filter_sec_container">
                  {(partner ?? []).map((item, index) => {
                    return (
                      <div
                        className={`filter_sec_box ${filter_param.partner_id === item.partner_id ?
                          "filter_active" : ""}`}
                        key={index} onClick={() => {
                          passFilter({ "$.partner_id": { "$eq": item.partner_id } }, "partner_id", item.partner_id)
                        }}>
                        {item.roles === "Superadmin" ? "Own Product" : item.first_name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>}

      </div>
      {/* 
      <div className="filter_box_body">
        <div className="filter_sub_body">
        </div>
        <div>
        </div>
        {(!_.isEmpty(selectedCategory.id)) ? <div>
          <div className="filter_sub_head">
            <div>{selectedCategory.name}</div>
            <div>
              <CaretDownFilled />
            </div>
          </div>

          <div className="filter_sub_body">
            <div>Brand</div>
            {(brandList).map((item, i) => {
              return (
                <div className="list_lg_sub_box" key={i} onClick={() => { handleFilter({ "$.brand": { "$eq": item.brand } }) }}>
                  {item.brand}
                </div>
              );
            })}
          </div>
        </div> : <div>
          <div className="filter_sub_head">
            <div>{categoryDetails.category_name}</div>
            <div>
              <CaretDownFilled />
            </div>
          </div>

          <div className="filter_sub_body">
            {(categoryDetails.subCategory ?? []).map((i) => {
              return (
                <div className="list_lg_sub_box" key={i.id} onClick={() => { onEmitData(i) }}>
                  {i.name}
                </div>
              );
            })}
          </div>
        </div>}
      </div> */}
      {/* {JSON.stringify(query)} */}
      <div className="filter_foot">
        <div className="filter_btn btn_grey" onClick={() => {
          // reset()
          setOpenFilter(false)
        }}>
          Cancel
        </div>
        <div className="filter_btn btn_lgt_primary" onClick={() => {
          reset()
          setOpenFilter(false)
          handleClickCategory()
        }}>Reset</div>
      </div>

    </div>
  );
};

export default Filter;
