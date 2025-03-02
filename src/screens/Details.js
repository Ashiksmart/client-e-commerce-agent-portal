import Banner from "../components/Banner";
import Header from "../components/Header";
import Slider from "react-slick";
import "../styles/Details.scss";
import "../styles/Listing.scss";
import Listing from "../components/Listing";
import UnderConstruction from "../components/UnderConstruction";
import { jwtDecode } from "jwt-decode";
import { AlertBox, CBadge, NoData } from "../components/CommonEssentials";
import { SupplierDetails } from "../components/DetailsEssentials";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { SET_CART_DETAILS } from "../redux/slices/store";
import RecommendedProducts from "../components/RecommendedProducts";
import { Alert, Chip, Snackbar, Stack, Avatar, Button } from "@mui/material";
import { AppLoader } from "../components/CommonEssentials";
import { handleImages } from "../constants/imagepath";
import { BgColorsOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import AppDialog from "../components/AppDialog";
import constants from "../constants";
import { SET_DATA } from "../redux/slices/store";
import { jsx } from "@emotion/react";
import { checkFilterObj } from "../utils/utilities";
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Details = () => {
  const location = useLocation();
  const [templatefield, settemplatefield] = useState({});
  const id = location?.state?.productdetail?.id;
  const [open, setopen] = useState(false);
  const [currentProductDetail, setCurrentProductDetail] = useState({});
  const [trigger, setTrigger] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const checkExistingCart = useSelector((state) => state.pageData.cartDetails);
  const [cityList, setCityList] = useState({});
  const [hasCity, setHasCity] = useState(false);
  const [addressCity, setAddressCity] = useState({});
  const [Apifield, setApifield] = useState({});
  let citycode = serviceProxy.localStorage.getItem("cityCode");
  const [DyanmicValues, setDyanmicValues] = useState({});
  const account_id = serviceProxy.localStorage.getItem("account_info")?.account;
  
  const [pageDataDetails, setPageDataDetails] = useState({
    CategoryDetail: "",
    productAggregateAmount: "",
    productOfferPercentage: "",
    productOriginalAmount: "",
    productStockStatus: "",
    subCategoryDetails: {},
    supplierDetails: {},
  });
  const [loading, setLoading] = useState(true);
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const [stock, setStock] = useState(false);

  const isLoggedIn = serviceProxy.localStorage.getItem("isLoggedIn");
  const cityCode =
    serviceProxy.localStorage.getItem("cityCode")?.toString() || "";
  const productImage = handleImages(currentProductDetail?.details?.image);

  useEffect(() => {
    const user_id = serviceProxy.localStorage.getItem("userId")?.toString();
    fetchAddress(user_id);
  }, []);

  const fetchtemplate = (type) => {
    const templateCriteria = { name: { $in: ["CRM_LEADS_CU"] } };
    const templateFields = ["id", "name"];
    serviceProxy.business
      .find(
        constants.Application,
        constants.MODULES.Template,
        "view",
        templateCriteria,
        templateFields
      )
      .then((template) => {
        if (template?.records?.length > 0) {
          template?.records?.forEach((res) => {
            fetchtemplateFields(res, type);
          });
        }
      });
  };

  const fetchtemplateFields = (templateinfo, type) => {
    const templateFieldsCriteria = {
      account_id,
      template_id: { $eq: templateinfo.id.toString() },
      show_on: "Client",
    };
    serviceProxy.business
      .find(
        constants.Application,
        constants.MODULES.TemplatesField,
        "view",
        templateFieldsCriteria,
        undefined,
        null,
        null
      )
      .then((templateFields) => {
        if (templateFields?.records?.length > 0) {
          console.log(templateFields, "templateFields");

          settemplatefield({
            fields: templateFields.records,
            initialValues: {},
            type: type,
            mode: constants.CREATE_MODE,
            Header: templateFields.records[0].catagory,
          });
          setopen(true);
        }
      });
  };
  const accountdetail = () => {
    return jwtDecode(serviceProxy.auth.getJWTToken());
  };
  const DropdownDependence = () => {
    const templateCriteria = { is_active: { $eq: "Y" } };
    const templateFields = ["state_name", "state_code"];
    serviceProxy.business
      .find(
        constants.Application,
        constants.MODULES.LocationState,
        "view",
        templateCriteria,
        templateFields,
        null,
        null
      )
      .then((template) => {
        if (template?.records?.length > 0) {
          setDyanmicValues((set) => {
            set["state"] = template.records.map((e) => {
              return { name: e.state_name, value: JSON.stringify(e) };
            });
            return set;
          });
        }
      });
  };

  const ApiSelectload = async (model, value) => {
    if (model == "city" && typeof value == "string") {
      console.log(value);
      console.log(value);
      var stateObject;

      stateObject = await JSON.parse(value);
      const templateCriteria = {
        is_active: { $eq: "Y" },
        state_code: { $eq: stateObject.state_code },
      };
      const templateFields = ["city_name", "city"];
      serviceProxy.business
        .find(
          constants.Application,
          constants.MODULES.LocationCity,
          "view",
          templateCriteria,
          templateFields,
          null,
          null
        )
        .then((template) => {
          let dropdata = {
            city: [],
          };
          if (template?.records?.length > 0) {
            dropdata.city = template.records.map((e) => {
              return { name: e.city_name, value: JSON.stringify(e) };
            });
            dispatch(SET_DATA(dropdata));
          } else {
            dispatch(SET_DATA(dropdata));
          }
        });
    }
  };
  const fetchProduct = async () => {
    let response = await serviceProxy.business
      .find(
        Constants.Application,
        "product",
        "view",
        { id },
        undefined,
        1,
        1,undefined,
        [
        
            {
            "model": "brand",
            "bindAs": {
              "name": "brand",
              "value": "brand_name"
            },
            "key": {
              "foreign": "details.brand",
              "primary": "id"
            },
            "fields": [
              "brand_name"
            ]
          }]
      )

    const productData = response?.records?.length
      ? response?.records[0]
      : {};
    if (productData) {
      productData.details = JSON.parse(
        response?.records[0]?.details ?? "{}"
      );
      productData.details.is_costing =
        productData.details.is_costing === "Y";
      productData.additional_info = JSON.parse(
        response?.records[0]?.additional_info ?? "{}"
      );
      let bind=response?.bind_to
      for (let x = 0; x < bind.length; x++) {
        const bind_elm = bind[x];
        for (let y = 0; y < bind_elm.length; y++) {
          const innerbind = bind_elm[y];
          if(innerbind.brand){
            productData.details.brand=innerbind.brand
          }
          
        }
      }

    }

    const stockStatus =
      productData?.details?.in_stock === "Y" ? "Available" : "Out Of Stock";
    setStock(productData?.details?.in_stock === "Y");
    setCurrentProductDetail(productData);

    const priceAmount = productData?.details?.price;
    const priceAggregateAmount = parseInt(
      priceAmount * (1 - (productData?.details?.offer_percent ?? 0) / 100)
    );
    setPageDataDetails({
      ...pageDataDetails,
      productStockStatus: stockStatus,
      productOfferPercentage: productData?.details?.offer_percent ?? 0,
      productOriginalAmount: priceAmount,
      productAggregateAmount: priceAggregateAmount,
    });
    setLoading(false);

  };

  useEffect(() => {
    if (currentProductDetail?.account_id) {
      if (isLoggedIn) {
        const query = {
          partner_id: {
            $eq:
              currentProductDetail?.partner_id === "0"
                ? null
                : currentProductDetail?.partner_id,
          },
          account_id: { $eq: currentProductDetail.account_id },
          roles: { $in: ["Superadmin", "SubSuperadmin"] },
        };
        serviceProxy.business
          .find(
            Constants.Application,
            "user",
            "view",
            query,
            ["avatar_url", "first_name", "phone_number", "email", "id"],
            1,
            1,
            []
          )
          .then((res) => {
            if (res?.records?.length > 0) {
              setPageDataDetails({
                ...pageDataDetails,
                supplierDetails: res.records[0],
              });
            }
          });
      }
    }
    setLoading(false);
  }, [currentProductDetail?.account_id]);

  const createCartProduct = (currentProductDetail) => {
    const { account_id, additional_info, id, details } = currentProductDetail;
    const attributesObj = {};
    if (details?.attributes) {
      details?.attributes.forEach((a) => {
        attributesObj[a.name] = a.value;
      });
    }

    const user_id = serviceProxy.localStorage.getItem("userId")?.toString();
    const payload = {
      account_id,
      user_id,
      products: { items: [{ id, attributes: attributesObj, quantity: 1 }] },
      additional_info,
    };
    serviceProxy.business
      .create(Constants.Application, Constants.MODULES.Cart, payload)
      .then((res) => {
        if (res?.data) {
          payload.id = res?.data[0];
          dispatch(SET_CART_DETAILS(payload));
          setSnackbarMessage("Product Added to Shopping Cart");
          setOpenSnackbar(true);
          setTrigger((t) => !t);
        }
      })
      .catch((error) => {
        console.log(error);
        setSnackbarMessage("Failed");
        setOpenSnackbar(true);
      });
  };

  const updateCartProduct = (checkExistingCart, cartItems) => {
    let payload = { ...checkExistingCart };
    payload = _.omit(payload, [
      "updated_by",
      "updated_at",
      "created_at",
      "created_by",
    ]);
    payload.products = {
      items: cartItems,
    };
    serviceProxy.business
      .update(Constants.Application, Constants.MODULES.Cart, payload)
      .then(() => {
        dispatch(SET_CART_DETAILS(payload));
        setSnackbarMessage("Product Added to Shopping Cart");
        setOpenSnackbar(true);
        setTrigger((t) => !t);
      })
      .catch((error) => {
        console.log(error);
        setSnackbarMessage("Failed");
        setOpenSnackbar(true);
      });
  };

  const fetchAddress = async (id) => {
    const addressCriteria = { user_id: { $eq: id } };
    const addressFields = ["city", "is_default"];
    const address = await serviceProxy.business.find(
      Constants.Application,
      Constants.MODULES.Address,
      "view",
      addressCriteria,
      addressFields
    );
    if (address?.records) {
      if (address.records.length === 1) {
        address.records[0].is_default = "Y";
      }
      const addressInfo = address.records.find((a) => a.is_default === "Y");
      setAddressCity(addressInfo?.city);
      fetchProduct(addressInfo?.city);
    }
  };

  const handleAddToCart = async (currentProductDetail, checkExistingCart) => {
    if (checkExistingCart?.products?.items?.length) {
      let cartItems = [];
      const attributesObj = {};
      if (currentProductDetail.details.attributes) {
        currentProductDetail.details.attributes.forEach((a) => {
          console.log(a, "0000000000000000000000000000000000");
          attributesObj[a.name] = a.value;
        });
      }

      const findCart = checkExistingCart.products.items.find(
        (c) =>
          c.id === currentProductDetail.id &&
          _.isEqual(c.attributes, attributesObj)
      );
      if (!_.isEmpty(findCart)) {
        checkExistingCart.products.items.forEach((item) => {
          if (
            item.id === findCart.id &&
            _.isEqual(item.attributes, findCart.attributes)
          ) {
            cartItems.push({
              id: findCart.id,
              attributes: findCart.attributes,
              quantity: findCart.quantity + 1,
            });
          } else {
            cartItems.push({
              id: item.id,
              attributes: item.attributes,
              quantity: item.quantity,
            });
          }
        });
      } else {
        cartItems = [
          ...checkExistingCart.products.items,
          {
            id: currentProductDetail?.id,
            attributes: attributesObj,
            quantity: 1,
          },
        ];
      }

      updateCartProduct(checkExistingCart, cartItems);
    } else {
      createCartProduct(currentProductDetail);
    }
  };

  const cityCondition = (cityCode) => {
    console.log(
      "cityCondition : ",
      cityCode,
      "cityList : ",
      cityList,
      "addressCityooooooooooooooo : ",
      addressCity
    );
    if (!_.isEmpty(cityList) && addressCity !== undefined) {
      console.log(addressCity);
      const cityCodeAddress = cityList.find(
        (c) => c.city_code === JSON.parse(addressCity)?.city_code
      );
      console.log(cityCodeAddress);
      console.log(cityCode);
      console.log(cityCode?.includes(cityCodeAddress?.city_code?.toString()));
      setHasCity(cityCode?.includes(cityCodeAddress?.city_code?.toString()));
    }
  };
  const Close = () => {
    setopen(false);
  };

  const settings = {
    customPaging: function (i) {
      return (
        <div className="detail_images">
          <img
            className="detail_img_thumb"
            alt=""
            src={productImage.imagepath[i]}
          />
        </div>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  let action = async (data, modetype, type) => {
    if (modetype == constants.CREATE_MODE) {
      let products = currentProductDetail;

      let data__ = {
        phone_number: data.phone_number,
        email: data.email,
        partner_id: products.partner_id,
        details: {
          app_id: products.category_id,
          category_id: products.sub_category_id,
          phone_number: data.phone_number,
          email: data.email,
          ...products.details,
        },
        account_id: products.account_id,
      };
      lead_push(data__, templatefield.type);
    } else {
      const filter = { account_id, id: { $eq: data.id } };
      serviceProxy.business
        .find(
          constants.Application,
          constants.MODULES.Profile,
          "view",
          filter,
          undefined,
          null,
          null
        )
        .then((userdata) => {
          if (userdata?.records?.length > 0) {
            let products = currentProductDetail;
            let users = userdata.records[0];

            let data = {
              phone_number: users.phone_number,
              email: users.email,
              partner_id: products.partner_id,
              details: {
                app_id: products.category_id,
                category_id: products.sub_category_id,
                phone_number: users.phone_number,
                email: users.email,
                ...products.details,
              },
              account_id: users.account_id,
            };
            lead_push(data, type);
          }
        });
    }
  };

  let lead_push = (payload, type) => {
    serviceProxy.business
      .create(Constants.Application, Constants.MODULES.Leads, payload)
      .then((res) => {
        if (res?.data) {
          setSnackbarMessage("Your Intrest Has Been Submitted");
          setOpenSnackbar(true);
          setopen(false);
          let phoneNumber
          if (type === "call") {
            if (!payload.details.call_button.startsWith("+91")) {
              phoneNumber = "+91" + payload.details.call_button; // Add +91 if it's not already present
            }else if (!payload.details.call_button.startsWith("91")) {
              phoneNumber = "+91" + payload.details.call_button; // Add +91 if it's not already present
            } else {
              phoneNumber = payload.details.call_button
            }
            
            window.open("tel:" + phoneNumber, "_blank");
          } else if (type === "whatsapp") {
            if (!payload.details.whatsapp_button.startsWith("+91")) {
              phoneNumber = "+91" + payload.details.call_button; // Add +91 if it's not already present
            } else if (!payload.details.call_button.startsWith("91")) {
              phoneNumber = "+91" + payload.details.call_button; // Add +91 if it's not already present
            } else {
              phoneNumber = payload.details.call_button
            }
            window.open("https://wa.me/" + phoneNumber, "_blank");
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setSnackbarMessage("Failed");
        setOpenSnackbar(true);
      });
  };
  useEffect(() => {
    if (!loading) cityCondition(currentProductDetail?.details?.city);
  }, [cityCondition, cityList, currentProductDetail?.details?.city, loading]);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <Header trigger={trigger} setCityList={setCityList} />

      <Banner details={"[]"} />
      {isLoggedIn
        ? !hasCity &&
        (currentProductDetail?.details?.is_costing ||
          currentProductDetail?.details?.is_costing === "Y") && (
          <AlertBox
            txt={`Sorry, the selected product is not available in your location, Please Add your Address in Your Profile.`}
            type="error"
          />
        )
        : !hasCity &&
        (currentProductDetail?.details?.is_costing ||
          currentProductDetail?.details?.is_costing === "Y") && (
          <AlertBox txt={`Please Login to add the Product.`} type="error" />
        )}
      {!_.isEmpty(cityList) && (
        <div className="gry_bg">
          {currentProductDetail?.id && (
            <>
              <div className="container container_center">
                <div className="details_container">
                  <div className="detail_lft">
                    <Slider {...settings} className="detail_img_cont">
                      {productImage.imagepath.map((thumbItem, index) => {
                        return (
                          <div key={index} className="detail_lg_imgb">
                            <img
                              className="detail_lg_img"
                              alt=""
                              src={thumbItem}
                            />
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                  <div>
                    <div className="detail_rcont">
                      <div className="brand_badge">
                        <div>{currentProductDetail?.details?.brand}</div>
                        <span></span>
                      </div>

                      <div>
                        <div className="detail_title sl_hide">
                          {currentProductDetail?.details?.name}
                        </div>
                      </div>
                      {currentProductDetail?.details?.is_costing ||
                        currentProductDetail?.details?.is_costing === "Y" ? (
                        <CBadge status={pageDataDetails.productStockStatus} />
                      ) : null}

                      <div className="detail_separator"></div>
                      {/* {JSON.stringify(currentProductDetail)} */}
                      {currentProductDetail?.details?.is_costing ||
                        currentProductDetail?.details?.is_costing === "Y" ? (
                        <div>
                          {!!pageDataDetails?.productOfferPercentage &&
                            !!pageDataDetails?.productAggregateAmount &&
                            Number(pageDataDetails?.productOfferPercentage) <=
                            100 ? (
                            <div className="">
                              {!!pageDataDetails?.productAggregateAmount &&
                                !!pageDataDetails?.productOriginalAmount && (
                                  <div>
                                    <span className="list_box_money">
                                      {`₹ ${pageDataDetails?.productAggregateAmount}`}
                                    </span>
                                  </div>
                                )}
                              <div>
                                <span className="list_box_money_sm">
                                  {!!pageDataDetails?.productOfferPercentage &&
                                    Number(
                                      pageDataDetails?.productOfferPercentage
                                    ) !== 0 &&
                                    `₹ ${pageDataDetails?.productOriginalAmount}`}
                                </span>
                                <span className="list_box_money_perc">
                                  {!!pageDataDetails?.productOfferPercentage &&
                                    Number(
                                      pageDataDetails?.productOfferPercentage
                                    ) !== 0 &&
                                    `-${pageDataDetails?.productOfferPercentage} %`}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="">
                              <span className="list_box_money">FREE</span>
                            </div>
                          )}
                        </div>
                      ) : null}

                      {!currentProductDetail.details.is_costing && (
                        <>
                          <div
                            className={
                              stock && hasCity
                                ? "list_box_btn list_box_btn_primary"
                                : "list_box_btn list_box_btn_primary"
                            }
                            onClick={() => {
                              if (!isLoggedIn) {
                                fetchtemplate("form");
                              } else {
                                action(accountdetail(), "_", "form");
                              }
                            }}
                          >
                            {currentProductDetail.details.lead_button_text}
                          </div>
                          <div className="btn_sec">

                            {(currentProductDetail?.details?.call_button && currentProductDetail?.details?.call_button !== "" && currentProductDetail?.details?.call_button !== null) && <div
                              className={
                                stock && hasCity
                                  ? "btn btn_lgt_primary"
                                  : "btn btn_lgt_primary"
                              }
                              onClick={() => {
                                if (!isLoggedIn) {
                                  fetchtemplate("call");
                                } else {
                                  action(accountdetail(), "_", "call");
                                }
                              }}
                            >
                              <CallRoundedIcon
                                style={{
                                  width: "20px",
                                  height: "20px"
                                }}
                              />
                              <div className="btn_txt">
                                Call us
                              </div>
                            </div>}
                            {(currentProductDetail?.details?.whatsapp_button && currentProductDetail?.details?.whatsapp_button !== "" && currentProductDetail?.details?.whatsapp_button !== null) && <div
                              className={
                                stock && hasCity
                                  ? "btn btn_success"
                                  : "btn btn_success"
                              }
                              onClick={() => {
                                if (!isLoggedIn) {
                                  fetchtemplate("whatsapp");
                                } else {
                                  action(accountdetail(), "_", "whatsapp");
                                }
                              }}
                            >
                              <WhatsAppIcon
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  color: "#ffffff"
                                }}
                              />
                              <div className="btn_txt">
                                Send message on WhatsApp
                              </div>
                            </div>}
                          </div>
                          {/* {!hasCity &&
                          <p style={{ color: 'red' }}>Sorry, the selected product is not available in your location Please Add your Address i not added.</p>
                        } */}
                        </>
                      )}

                      {(!!pageDataDetails?.productOriginalAmount ||
                        !!pageDataDetails?.productAggregateAmount) &&
                        (currentProductDetail?.details?.is_costing ||
                          currentProductDetail?.details?.is_costing ===
                          "Y") && (
                          <>
                            <div
                              className={
                                stock && hasCity
                                  ? "list_box_btn list_box_btn_primary"
                                  : "list_box_btn list_box_btn_primary disabled"
                              }
                              onClick={() => {
                                if (isLoggedIn && hasCity) {
                                  if (stock) {
                                    handleAddToCart(
                                      currentProductDetail,
                                      checkExistingCart
                                    );
                                  }
                                } else {
                                  if (!isLoggedIn) {
                                    navigate("/login");
                                  }
                                }
                              }}
                            >
                              Add to Cart
                            </div>
                          </>
                        )}
                      <SupplierDetails
                        supplierDet={pageDataDetails?.supplierDetails ?? {}}
                        currentProductDetail={currentProductDetail}
                      />
                      <Stack direction="column" spacing={1}>
                        {currentProductDetail?.details?.attributes &&
                          currentProductDetail.details.attributes.map((t) => {
                            return (
                              <>
                                <div className="detail_separator"></div>
                                <div className="btxt sub_txt">
                                  {t.displayName}
                                </div>
                                <Stack direction="row" spacing={1}>
                                  {t.isColor === false &&
                                    t.isImage === false &&
                                    t.values.map((v) => {
                                      return (
                                        <div
                                          className={`detail_attr_box ${t.value === v.value
                                            ? "detail_attr_act"
                                            : null
                                            }`}
                                          // style={t.value === v.value ? { backgroundColor: "#64b5f6" } : {}}
                                          onClick={() => {
                                            const obj =
                                              _.cloneDeep(currentProductDetail);

                                            obj.details.attributes.forEach(
                                              (a) => {
                                                if (a.name === t.name) {
                                                  a.value = v.value;
                                                }
                                              }
                                            );
                                            setCurrentProductDetail(obj);
                                          }}
                                        >
                                          {v.label}
                                        </div>
                                      );
                                    })}
                                  <Stack direction="row" spacing={1}>
                                    {t.isImage === true &&
                                      t.isColor === false &&
                                      t.values.map((v) => {
                                        return (
                                          <div
                                            alt={_.capitalize(v.value)}
                                            src={v.src}
                                            sx={t.size}
                                            variant={t.variant}
                                            className={`productDetailColorCode dtl_col_box ${t.value === v.value
                                              ? "dtl_col_act"
                                              : ""
                                              }`}
                                            // style={t.value === v.value ? { width: t.size.width + 10, height: t.size.height + 10 } : {}}
                                            onClick={() => {
                                              const obj =
                                                _.cloneDeep(
                                                  currentProductDetail
                                                );
                                              obj.details.attributes.forEach(
                                                (a) => {
                                                  if (
                                                    a.isImage === t.isImage &&
                                                    a.isColor === t.isColor &&
                                                    a.name === t.name
                                                  ) {
                                                    a.value = v.value;
                                                  }
                                                }
                                              );
                                              setCurrentProductDetail(obj);
                                            }}
                                          >
                                            <img
                                              className="dtl_col_ico"
                                              src={v.src}
                                              alt={""}
                                            />
                                          </div>
                                        );
                                      })}
                                  </Stack>

                                  <Stack direction="row" spacing={1}>
                                    {t.isImage === false &&
                                      t.isColor === true &&
                                      t.values.map((v) => {
                                        return (
                                          <>
                                            <div
                                              className={`productDetailColorCode dtl_col_box ${t.value === v.value
                                                ? "dtl_col_act"
                                                : ""
                                                }`}
                                              sx={t.size}
                                              variant={t.variant}
                                              style={
                                                t.value === v.value
                                                  ? { backgroundColor: v.value }
                                                  : { backgroundColor: v.value }
                                              }
                                              onClick={() => {
                                                const obj =
                                                  _.cloneDeep(
                                                    currentProductDetail
                                                  );

                                                obj.details.attributes.forEach(
                                                  (a) => {
                                                    if (
                                                      a.isImage === t.isImage &&
                                                      a.isColor === t.isColor &&
                                                      a.name === t.name
                                                    ) {
                                                      a.value = v.value;
                                                    } else {
                                                      // console.log(a.value,"5555555555555555","fffffffffffff",v.value)
                                                    }
                                                  }
                                                );
                                                setCurrentProductDetail(obj);
                                              }}
                                            ></div>
                                            {/* <Avatar className="productDetailColorCode dtl_col_box" sx={t.size} variant={t.variant}
                                        style={t.value === v.value ? { width: t.size.width + 10, height: t.size.height + 10, backgroundColor: v.value } : { backgroundColor: v.value }}
                                        onClick={() => {
                                          const obj = _.cloneDeep(currentProductDetail)

                                          obj.details.attributes.forEach(a => {
                                            if (a.isImage === t.isImage && a.isColor === t.isColor && a.name === t.name) {
                                              a.value = v.value
                                            } else {
                                              // console.log(a.value,"5555555555555555","fffffffffffff",v.value)
                                            }
                                          })
                                          setCurrentProductDetail(obj)
                                        }} /> */}
                                          </>
                                        );
                                      })}
                                  </Stack>
                                </Stack>
                              </>
                            );
                          })}
                      </Stack>

                      {currentProductDetail?.details?.tags &&
                        currentProductDetail.details.tags.map((t) => {
                          <>
                            <div className="detail_separator"></div>
                            <Stack direction="row" spacing={1}>
                              return
                              <>
                                <Chip label={t} />
                              </>
                            </Stack>
                          </>;
                        })}

                      <div>
                        {Object.keys(
                          currentProductDetail?.additional_info ?? {}
                        )?.map((data) => {
                          return (
                            <>
                              <div className="detail_sm_head">{`${data}`}</div>
                              <div className="detail_des">
                                {Object.keys(
                                  currentProductDetail?.additional_info[data] ??
                                  {}
                                )?.map((sub) => {
                                  return (
                                    <>
                                      <div className="detail_des">
                                        {`${sub}: ${currentProductDetail?.additional_info[data][sub]}`}
                                      </div>
                                    </>
                                  );
                                })}
                                <div className="detail_separator"></div>
                              </div>
                            </>
                          );
                        })}
                      </div>

                      {!!currentProductDetail?.details?.description && (
                        <>
                          <div className="detail_separator"></div>
                          <div>
                            <div className="detail_sm_head">Description</div>
                            <div className="detail_des">
                              {currentProductDetail?.details?.description}
                            </div>
                          </div>{" "}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
              </div>
            </>
          )}
          {!currentProductDetail?.id && (
            <>
              <NoData txt={`No Data Found`} />
            </>
          )}
          <RecommendedProducts />
        </div>
      )}
      <AppDialog
        title={"Submit Your Intrest"}
        formSchema={templatefield}
        action={action}
        DyanmicValues={DyanmicValues}
        ApiSelectload={ApiSelectload}
        open={open}
        Close={Close}
      ></AppDialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Close Snackbar after 3 seconds
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbarMessage === "Product Added to Shopping Cart" ||
              snackbarMessage === "Your Intrest Has Been Submitted"
              ? "success"
              : "error"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
};

export default Details;
