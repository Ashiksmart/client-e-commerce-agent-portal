import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import Footer from "../components/Footer";
import {
  AlertBox,
  AppLoader,
  RadioSecBox,
} from "../components/CommonEssentials";
import AddressForm from "../components/forms/AddressForm";
import { useEffect, useState } from "react";
import { SupplierDetails } from "../components/DetailsEssentials";
import { useNavigate, useLocation } from "react-router-dom";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { Snackbar, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import _, { forEach } from "lodash";
import { SET_CART_DETAILS, SET_ORDER } from "../redux/slices/store";
import { handleImages } from "../constants/imagepath";
import AppDrawer from "../components/AppDrawer";
import AppForm from "./AppForm";
import { SET_DATA } from "../redux/slices/store";
import Attributes from "../components/Attributes";

const ProceedBuy = () => {
  const location = useLocation();

  const ActInfo = location?.state;

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [addressInfo, setAddressInfo] = useState({});
  const [billingInfo, setBillingInfo] = useState({});
  const [address, setAddress] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState({});
  const [cartId, setCartId] = useState();
  const [cityList, setCityList] = useState({});
  const [addressCity, setAddressCity] = useState({});
  const [DyanmicValues, setDyanmicValues] = useState({});
  const [Apifield, setApifield] = useState({});
  const [templatefield, settemplatefield] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [billingType, setBillingType] = useState([
    { name: "Same as delivery", isSelect: "Y" },
    { name: "Other", isSelect: "N" },
  ]);

  // let billingType = [{name:"Same as delivery",isSelect: "Y"},{name:"Other",isSelect: "N"}]

  const [constant, setconstant] = useState({
    BTN_ACTION: {
      ADDRESS_ADD: "create_address",
    },
  });
  const account_id =
    serviceProxy.localStorage
      .getItem("account_details")
      ?.account_id.toString() || "";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = serviceProxy.localStorage.getItem("isLoggedIn");

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const user_id = serviceProxy.localStorage.getItem("userId")?.toString();
  useEffect(() => {
    fetchAddress(user_id);
    DropdownDependence();
    fetchtemplate();
  }, []);

  const fetchtemplate = () => {
    const templateCriteria = { name: { $in: ["USR_ADDRESS"] } };
    const templateFields = ["id", "name"];
    serviceProxy.business
      .find(
        Constants.Application,
        Constants.MODULES.Template,
        "view",
        templateCriteria,
        templateFields
      )
      .then((template) => {
        if (template?.records?.length > 0) {
          template?.records?.forEach((res) => {
            fetchtemplateFields(res);
          });
        }
      });
  };

  const fetchtemplateFields = (templateinfo) => {
    const templateFieldsCriteria = {
      account_id,
      template_id: { $eq: templateinfo.id.toString() },
      show_on: "Client",
    };
    serviceProxy.business
      .find(
        Constants.Application,
        Constants.MODULES.TemplatesField,
        "view",
        templateFieldsCriteria,
        undefined,
        null,
        null
      )
      .then((templateFields) => {
        if (templateFields?.records?.length > 0) {
          console.log(templateFields, "templateFields");
          setApifield((set) => {
            set[templateinfo.name] = templateFields.records;
            return set;
          });
        }
      });
  };

  const DropdownDependence = () => {
    const templateCriteria = { is_active: { $eq: "Y" } };
    const templateFields = ["state_name", "state_code"];
    serviceProxy.business
      .find(
        Constants.Application,
        Constants.MODULES.LocationState,
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

  let action = async (data, modetype) => {
    if (modetype == constant.BTN_ACTION.ADDRESS_ADD) {
      data.user_id = user_id;
      serviceProxy.business
        .create(Constants.Application, Constants.MODULES.Address, data)
        .then(async (res) => {
          if (res?.statusCode == 201) {
            setDrawerOpen(false);
            setSnackbarMessage("Record Saved");
            setOpenSnackbar(true);
            await fetchAddress(user_id);
          } else {
            setSnackbarMessage("Failed");
            setOpenSnackbar(true);
          }
        })
        .catch((err) => {
          console.log("ERR : ", err);
          setSnackbarMessage("Failed");
          setOpenSnackbar(true);
        });
    }
  };

  const ApiSelectload = async (model, value) => {
    if (model == "city" && typeof value == "string") {
      var stateObject;
      stateObject = await JSON.parse(value);
      const templateCriteria = {
        is_active: { $eq: "Y" },
        state_code: { $eq: stateObject.state_code },
      };
      const templateFields = ["city_name", "city_code"];
      serviceProxy.business
        .find(
          Constants.Application,
          Constants.MODULES.LocationCity,
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

  let ButtonAction = async (modetype, data) => {
    if (modetype == constant.BTN_ACTION.ADDRESS_ADD) {
      settemplatefield({
        fields: Apifield["USR_ADDRESS"],
        initialValues: {},
        mode: constant.BTN_ACTION.ADDRESS_ADD,
        Header: "Add New Address",
      });
      setDrawerOpen(true);
    }
  };
  const fetchAddress = async (id) => {
    const addressCriteria = { user_id: { $eq: id } };
    const addressFields = [
      "id",
      "name",
      "mobile",
      "address",
      "landmark",
      "pincode",
      "city",
      "state",
      "country",
      "is_default",
    ];
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
      setAddressInfo(address.records);
      setBillingInfo(
        _.cloneDeep(address.records).map((a) => {
          a.billing = a.is_default === "Y" ? "Y" : "N";
          return a;
        })
      );
      await fetchCart(id);
      console.log("address : ", address);
    }
  };

  const fetchCart = async (id) => {
    const criteria = { user_id: { $eq: id } };
    const cart = await serviceProxy.business.find(
      Constants.Application,
      Constants.MODULES.Cart,
      "view",
      criteria,
      undefined,
      1,
      1000000
    );
    if (cart?.records.length > 0) {
      const cartList = [];
      let quantity = 0;
      let total = 0;
      for (const product of JSON.parse(cart.records[0].products).items) {
        const products = await serviceProxy.business.find(
          Constants.Application,
          Constants.MODULES.Product,
          "view",
          { id: { $in: [product.id] }, is_active: "Y" }
        );

        if (products?.records.length > 0) {
          const proRecord = products.records[0];
          const module =
            proRecord?.partner_id && proRecord?.partner_id !== "0"
              ? Constants.MODULES.PartnerAccount
              : Constants.MODULES.ProjectAccount;
          const query =
            proRecord?.partner_id && proRecord?.partner_id !== "0"
              ? { partner_id: { $eq: proRecord?.partner_id } }
              : { account_id: { $eq: proRecord?.account_id } };
          const supplierDetails = await new Promise((resolve) => {
            serviceProxy.business
              .find(
                Constants.Application,
                module,
                "view",
                query,
                ["name", "email", "address", "phone_number"],
                1,
                1,
                []
              )
              .then((supplierDetails) => {
                if (supplierDetails?.records?.length > 0) {
                  resolve(supplierDetails.records[0]);
                }
              });
          });

          quantity += product.quantity;
          const details = JSON.parse(products.records[0].details);
          const priceAggregateAmount = parseInt(
            details.price * (1 - (details.offer_percent ?? 0) / 100)
          );
          total += subTotalCalc(priceAggregateAmount, product.quantity);
          cartList.push({
            ...products.records[0],
            supplierDetails,
            attributes: product.attributes,
            quantity: product.quantity,
          });
        }
      }

      console.log("totalValue222 : ", total);
      setSubTotal({ quantity, total });
      setCartId(cart.records[0].id.toString());
      setCartItems(cartList);
      setLoading(false);
      console.log("cart : ", cart);
    } else {
      navigate("/");
    }
  };

  const subTotalCalc = (amount, quantity) => {
    return amount * quantity;
  };
  const handleOptionChange = async (event) => {
    setLoading(true);
    for (const item of addressInfo) {
      if (item.name === event.target.value) {
        item.is_default = "Y";
      } else {
        item.is_default = "N";
      }
      await serviceProxy.business.update(
        Constants.Application,
        Constants.MODULES.Address,
        item
      );
    }
    setLoading(false);
  };

  const handleBillingTypeChange = (event) => {
    setLoading(true);
    const billingTypeClone = _.cloneDeep(billingType);
    for (const item of billingTypeClone) {
      if (item.name === event.target.value) {
        item.isSelect = "Y";
      } else {
        item.isSelect = "N";
      }
    }
    if (event.target.value !== "Other") {
      const billingInfoClone = _.cloneDeep(billingInfo);
      for (const item of billingInfoClone) {
        if (item.is_default === "Y") {
          item.billing = "Y";
        } else {
          item.billing = "N";
        }
      }
      setBillingInfo(billingInfoClone);
    }
    setBillingType(billingTypeClone);
    setLoading(false);
  };

  const handleBillingChange = (event) => {
    setLoading(true);
    const billingInfoClone = _.cloneDeep(billingInfo);
    for (const item of billingInfoClone) {
      if (item.name === event.target.value) {
        item.billing = "Y";
      } else {
        item.billing = "N";
      }
    }
    setBillingInfo(billingInfoClone);
    setLoading(false);
  };

  const deliveryDate = (date) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + Number(date));
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = currentDate.getDate();
    const monthName = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const formattedDate = `${day} ${monthName} ${year}`;
    return formattedDate;
  };

  const placeOrder = async () => {
    const orderList = [];

    for (const item of cartItems) {
      console.log(item);
      const orderObj = {};

      if (Constants.AUTO_ASSIGN === true) {
        try {
          const teamInfo = await getTeams(account_id, item);
          console.log(teamInfo);
          orderObj.teams = teamInfo.id.toString();
          orderObj.additional_info = { team_name: teamInfo.name };
        } catch (error) {
          console.error("Error::", error);
        }
      }

      orderObj.account_id = account_id;
      orderObj.partner_id = item.partner_id ?? undefined;
      orderObj.category_id = item.category_id;
      orderObj.sub_category_id = item.sub_category_id;
      orderObj.user_id = user_id.toString();
      orderObj.product_id = item.id.toString();
      orderObj.delivery_type = "brand";
      orderObj.address_info = {};
      orderObj.product_details = item;
      orderObj.payment_method = "COD";

      orderObj.address_info.shipping = addressInfo.find(
        (a) => a.is_default === "Y"
      );
      orderObj.address_info.billing = billingInfo.find(
        (a) => a.billing === "Y"
      );

      orderList.push(orderObj);
    }

    createOrders(orderList);
  };

  const createOrders = async (orders) => {
    const orderIds = [];
    for (const order of orders) {
      await serviceProxy.business
        .create(Constants.Application, Constants.MODULES.Orders, order)
        .then(async (result) => {
          const id = result.data[0];
          orderIds.push(id.toString());
        })
        .catch((err) => {
          console.log("ERR : ", err);
          setSnackbarMessage("Failed");
          setOpenSnackbar(true);
          setLoading(false);
        });
    }
    if (orderIds.length > 0) {
      createOrderDetails(orderIds, orders);
    }
  };

  const updateOrders = async (orderDetail, orderIds) => {
    for (const order of orderIds) {
      let invoiceObj = {
        id: order,
        order_id: orderDetail,
      };
      await serviceProxy.business
        .update(Constants.Application, Constants.MODULES.Orders, invoiceObj)
        .then(async (result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log("ERR : ", err);
          setSnackbarMessage("Failed");
          setOpenSnackbar(true);
          setLoading(false);
        });
    }
  };

  const createOrderDetails = (orderIds, orders) => {
    let partnerIds = [];
    orders.forEach((orderItem) => {
      if (orderItem?.partner_id != null) {
        partnerIds.push(orderItem?.partner_id);
      }
    });

    const charges = subTotal.total < 500 ? 100 : 0;

    const orderDetailPayload = {
      account_id: account_id,
      invoice_id: { ids: orderIds },
      partner_id: { partner_id: partnerIds },
      payment_method: "COD",
      delivery_charges: charges.toString(),
      user_id: user_id.toString(),
    };
    serviceProxy.business
      .create(
        Constants.Application,
        Constants.MODULES.OrderDetail,
        orderDetailPayload
      )
      .then((orderDetailResult) => {
        const account_id =
          serviceProxy.localStorage.getItem("account_info")?.account;
        const criteria = {
          account_id: account_id,
          app_id: orders[0].product_details.category_id,
          page_type: Constants.MARKETPLACE,
          link_to: { $eq: "" },
          link_type: { $eq: "" },
        };
        serviceProxy.business
          .find(
            Constants.Application,
            Constants.MODULES.WorkflowStatus,
            "view",
            criteria
          )
          .then((result) => {
            if (result?.records?.length > 0) {
              const workFlowList = result.records;
              const getDefaultWorkflow = workFlowList.find(
                (r) => r.default_status === "Y"
              );
              if (!_.isEmpty(getDefaultWorkflow)) {
                updateOrders(orderDetailResult.data[0], orderIds);
                createOrderTrack(
                  orderDetailResult.data[0],
                  orderIds,
                  getDefaultWorkflow.status_name,
                  workFlowList
                )
                  .then(() => {
                    dispatch(SET_ORDER(orders));
                    deleteCartItem();
                  })
                  .catch((err) => {
                    console.log("ERR : ", err);
                    setSnackbarMessage("Failed");
                    setOpenSnackbar(true);
                    setLoading(false);
                  });
              } else {
                console.log("Didn't find default workflow status");
                setSnackbarMessage("Failed");
                setOpenSnackbar(true);
                setLoading(false);
              }
            }
          })
          .catch((err) => {
            console.log("Fetch System Reference Error : ", err);
            setSnackbarMessage("Failed");
            setOpenSnackbar(true);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log("ERR : ", err);
        setSnackbarMessage("Failed");
        setOpenSnackbar(true);
        setLoading(false);
      });
  };

  const getTeams = (account_id, item) => {
    return new Promise((resolve, reject) => {
      // const criteria = { account_id: account_id, partner_id: item.partner_id, app_id: item.product_details.category_id.toString() };
      const criteria = { account_id: account_id, app_id: "1", is_active: "Y" };
      serviceProxy.business
        .find(
          Constants.Application,
          Constants.MODULES.Teams,
          "view",
          criteria,
          undefined,
          undefined,
          undefined
        )
        .then((result) => {
          if (result?.records?.length > 0) {
            let randomInd = Math.floor(Math.random() * result.records.length);
            console.log(randomInd, "...", result.records[randomInd]?.id);
            let tObj = {
              id: result.records[randomInd]?.id,
              name: result.records[randomInd]?.name,
            };
            resolve(tObj);
          } else {
            resolve(null);
          }
        })
        .catch((err) => {
          reject(err);
          setSnackbarMessage("Failed");
          setOpenSnackbar(true);
          setLoading(false);
        });
    });
  };

  // const createTaskLog = async (detailRes, orderIds, orders) => {
  //   console.log(detailRes);
  //   console.log(orderIds);
  //   console.log(orders);
  //   const criteria = { account_id: account_id, id: { $in: orderIds } };
  //   serviceProxy.business.find(Constants.Application, Constants.MODULES.Orders, "view", criteria, undefined, undefined, undefined)
  //     .then((result) => {
  //       if (result?.records?.length > 0) {
  //         console.log(result.records);
  //         const taskLogs = []
  //         result.records.forEach((item) => {
  //           const taskLogObj = {}
  //           taskLogObj.account_id = account_id;
  //           taskLogObj.partner_id = item?.partner_id;
  //           taskLogObj.user_id = user_id.toString()
  //           taskLogObj.order_detail_id = detailRes.toString()
  //           taskLogObj.costing = JSON.parse(JSON.parse(item.product_details).details).is_costing
  //           if (taskLogObj.costing == "N") {
  //             taskLogObj.product_id = JSON.parse(item.product_details).id
  //           }
  //           else {
  //             taskLogObj.invoice_id = item.id.toString()
  //           }
  //           taskLogs.push(taskLogObj)
  //         })
  //         console.log(taskLogs);
  //         for (const taskLog of taskLogs) {
  //           console.log(taskLog);
  //           serviceProxy.business.create(Constants.Application, Constants.MODULES.AutoAssign, taskLog)
  //             .then(async (result) => {
  //               console.log(result);
  //             })
  //             .catch((err) => {
  //               console.log("ERR : ", err);
  //               setSnackbarMessage("Failed");
  //               setOpenSnackbar(true);
  //               setLoading(false);
  //             });
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       setSnackbarMessage("Failed");
  //       setOpenSnackbar(true);
  //       setLoading(false);
  //     })
  // };

  const createOrderTrack = async (
    orderDetailId,
    orderIds,
    statusName,
    workFlowList
  ) => {
    return new Promise((resolve, reject) => {
      let failedCount = 0;
      for (const orderId of orderIds) {
        const track = {
          order_id: orderDetailId.toString(),
          invoice_id: orderId.toString(),
          status: statusName,
          link_to: "",
        };
        serviceProxy.business
          .create(Constants.Application, Constants.MODULES.OrderTrack, track)
          .then(async () => {
            const criteria = { id: orderId.toString() };
            const invoice = await serviceProxy.business.find(
              Constants.Application,
              Constants.MODULES.Orders,
              "view",
              criteria,
              ["partner_id"]
            );

            for (const workFlow of workFlowList) {
              const taskPayload = {
                app_id: workFlow.app_id,
                account_id: workFlow.account_id,
                partner_id: invoice?.records?.[0]?.partner_id ?? null,
                invoice_id: orderId.toString(),
                order_id: orderDetailId.toString(),
                name: workFlow.display_name,
                description: workFlow.display_name,
                status: workFlow.status_name,
                work_status: "todo",
                link_to: workFlow.link_to,
              };
              serviceProxy.business
                .create(
                  Constants.Application,
                  Constants.MODULES.TaskLog,
                  taskPayload
                )
                // eslint-disable-next-line no-loop-func
                .catch((err) => {
                  failedCount += 1;
                  console.log("ERR : ", err);
                  setSnackbarMessage("Failed");
                  setOpenSnackbar(true);
                  setLoading(false);
                });
            }
          })
          // eslint-disable-next-line no-loop-func
          .catch((err) => {
            failedCount += 1;
            console.log("ERR : ", err);
            setSnackbarMessage("Failed");
            setOpenSnackbar(true);
            setLoading(false);
          });
      }

      if (failedCount > 0) {
        reject(failedCount);
      } else {
        resolve(failedCount);
      }
    });
  };

  const deleteCartItem = () => {
    serviceProxy.business
      .delete(Constants.Application, Constants.MODULES.Cart, cartId)
      .then(() => {
        dispatch(SET_CART_DETAILS([]));
        setSnackbarMessage("Record Saved");
        setOpenSnackbar(true);
        setLoading(false);
        navigate("/order-place");
      })
      .catch((err) => {
        console.log("ERR : ", err);
        setSnackbarMessage("Failed");
        setOpenSnackbar(true);
        setLoading(false);
      });
  };

  let locationCond = true;
  const cityCondition = (cityCode, cityList) => {
    if (!_.isEmpty(cityList) && addressCity !== undefined) {
      const cityCodeAddress = cityList.find(
        (c) => c.city_code === JSON.parse(addressCity).city_code
      );
      const hasCityCode = cityCode.includes(
        cityCodeAddress?.city_code?.toString()
      );
      if (!hasCityCode) {
        locationCond = hasCityCode;
      }
      return hasCityCode;
    }
  };

  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <Header setCityList={setCityList} />

      <div className="gry_bg">
        <div className="cart_container">
          <div className="cart_box_sec">
            <div className="buy_sec">
              <div className="buy_accord">
                <div className="buy_accord_head">
                  <div className="buy_accord_head_sec">
                    <div className="buy_accord_head_point">1</div>
                    <div className="buy_accord_head_txt">Delivery Address</div>
                  </div>
                  {/* <div className="buy_accord_arrb"></div> */}
                </div>
                <div className="buy_accord_body">
                  {addressInfo.map((item, i) => {
                    return (
                      <div>
                        <RadioSecBox
                          key={i}
                          name={"address"}
                          value={item.name}
                          mainText={item.name}
                          subText={
                            item.address +
                            ", " +
                            JSON.parse(item.city).city_name +
                            ", " +
                            JSON.parse(item.state).state_name +
                            ", " +
                            item.country +
                            " " +
                            item.pincode
                          }
                          checked={item.is_default}
                          handleOptionChange={handleOptionChange}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="buy_accord_ft">
                  <div
                    className={
                      addressInfo.length === 4 ? "clnk disabled" : "clnk"
                    }
                    onClick={() => {
                      if (addressInfo.length < 4) {
                        ButtonAction(constant.BTN_ACTION.ADDRESS_ADD);
                      }
                    }}
                  >
                    Add More Address
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cart_box_sec">
            <div className="buy_sec">
              <div className="buy_accord">
                <div className="buy_accord_head">
                  <div className="buy_accord_head_sec">
                    <div className="buy_accord_head_point">2</div>
                    <div className="buy_accord_head_txt">Billing Address</div>
                  </div>
                  {/* <div className="buy_accord_arrb"></div> */}
                </div>
                <div className="buy_accord_body">
                  <div>
                    {billingType.map((b) => {
                      return (
                        <RadioSecBox
                          name="billingType"
                          value={b.name}
                          mainText={b.name}
                          checked={b.isSelect}
                          handleOptionChange={handleBillingTypeChange}
                        />
                      );
                    })}
                  </div>
                  {billingType[1].isSelect === "Y" && (
                    <div className="cart_box_sec">
                      <div className="buy_sec">
                        <div className="buy_accord">
                          <div className="buy_accord_body">
                            {billingInfo.map((item, i) => {
                              return (
                                <div>
                                  <RadioSecBox
                                    key={i}
                                    name={"billing"}
                                    value={item.name}
                                    mainText={item.name}
                                    subText={
                                      item.address +
                                      ", " +
                                      JSON.parse(item.city).city_name +
                                      ", " +
                                      JSON.parse(item.state).state_name +
                                      ", " +
                                      item.country +
                                      " " +
                                      item.pincode
                                    }
                                    checked={item.billing}
                                    handleOptionChange={handleBillingChange}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <div className="buy_accord_ft">
                            <div
                              className={
                                addressInfo.length === 4
                                  ? "clnk disabled"
                                  : "clnk"
                              }
                              onClick={() => {
                                if (addressInfo.length < 4) {
                                  ButtonAction(constant.BTN_ACTION.ADDRESS_ADD);
                                }
                              }}
                            >
                              Add More Address
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="cart_box_sec">
            <div className="buy_sec">
              <div className="buy_accord">
                <div className="buy_accord_head">
                  <div className="buy_accord_head_sec">
                    <div className="buy_accord_head_point">3</div>
                    <div className="buy_accord_head_txt">
                      Add Payment Options
                    </div>
                  </div>
                  {/* <div className="buy_accord_arrb"></div> */}
                </div>
                <div className="buy_accord_body">
                  <div>
                    <RadioSecBox
                      name="delivery"
                      value="delivery"
                      mainText={`Cash on Delivery/Pay on Delivery`}
                      subText={`Cash, UPI and Cards accepted.`}
                      checked={"Y"}
                    />
                  </div>
                </div>
                {/* <div className="buy_accord_ft">
                  <div
                    className={
                      addressInfo.length === 4 ? "clnk disabled" : "clnk"
                    }
                    onClick={() => {
                      if (addressInfo.length < 4) {
                        ButtonAction(constant.BTN_ACTION.ADDRESS_ADD);
                      }
                    }}
                  >
                    Add Payment Mode
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="cart_box_sec">
            <div className="buy_sec">
              <div className="buy_accord">
                <div className="buy_accord_head">
                  <div className="buy_accord_head_sec">
                    <div className="buy_accord_head_point">4</div>
                    <div className="buy_accord_head_txt">
                      Order Summary Details
                    </div>
                  </div>
                  {/* <div className="buy_accord_arrb"></div> */}
                </div>
                <div className="buy_accord_body">
                  <div>
                    <div>
                      {cartItems.map((cart, i) => {
                        const item = JSON.parse(cart.details);
                        const priceAggregateAmount = parseInt(
                          item.price * (1 - (item.offer_percent ?? 0) / 100)
                        );
                        return (
                          <div key={i} className="cart_box">
                            <div className="cart_box_imgb">
                              <img
                                className="cart_box_img"
                                src={
                                  handleImages(
                                    item?.image?.length ? item?.image : [],
                                    1
                                  ).imagepath
                                }
                                alt=""
                              />
                            </div>
                            <div className="cart_box_rgt">
                              <div className="row_sec">
                                <div>
                                  <div className="list_box_money_sec sl_hide">
                                    {`Delivery Date: `}
                                    <span
                                      className="list_box_money"
                                      style={{
                                        color: "green",
                                        fontSize: "1rem",
                                      }}
                                    >
                                      {deliveryDate(item.delivery_date)}
                                    </span>
                                  </div>
                                  <div
                                    className="detail_title sl_hide"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      navigate(`/details`, {
                                        state: { productdetail: cart },
                                      });
                                    }}
                                  >
                                    {item.name}
                                  </div>
                                </div>
                                <div className="detail_separator"></div>
                                {!!item.offer_percent &&
                                !!priceAggregateAmount &&
                                Number(item.offer_percent) <= 100 ? (
                                  <div className="">
                                    {!!priceAggregateAmount && !!item.price && (
                                      <>
                                        <span className="">
                                          {!!item.offer_percent &&
                                            Number(item.offer_percent) !== 0 &&
                                            `- ${item.offer_percent} %`}
                                        </span>
                                        <span className="list_box_money">
                                          {`₹ ${priceAggregateAmount}`}
                                        </span>
                                      </>
                                    )}
                                    <div className="list_box_money_sm">
                                      {!!item.offer_percent &&
                                        Number(item.offer_percent) !== 0 &&
                                        `₹ ${item.price}`}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="">
                                    <span className="list_box_money">FREE</span>
                                  </div>
                                )}
                                <SupplierDetails
                                  supplierDet={cart.supplierDetails}
                                />
                                <Attributes
                                  attributes={item.attributes}
                                  selectedAttributes={cart.attributes}
                                />
                                <div className="cart_box_qty_box">
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: 600,
                                      color: "grey",
                                    }}
                                  >
                                    {`Quantity : ${cart.quantity}`}
                                  </div>

                                  {isLoggedIn
                                    ? !cityCondition(item?.city, cityList) && (
                                        <AlertBox
                                          txt={`Sorry, the selected product is not available in your location, Please Add your Address in Your Profile.`}
                                          type="error"
                                        />
                                      )
                                    : !cityCondition(item?.city, cityList) && (
                                        <AlertBox
                                          txt={`Please Login to add the Product.`}
                                          type="error"
                                        />
                                      )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className="cart_box_sec"
                      style={{
                        boxShadow: "none",
                        position: "sticky",
                        top: "80px",
                      }}
                    >
                      <div className="mdtxt">Your Shopping Cart</div>
                      <div className="cart_box_sub_sec">
                        <div>
                          <div>
                            {`SubTotal (${subTotal.quantity} Items): `}
                            <div className="list_box_money">{`₹${subTotal.total}`}</div>
                          </div>
                        </div>
                        <div className="detail_separator"></div>
                        <div
                          style={{ marginRight: 0 }}
                          className={
                            addressInfo?.length > 0 && locationCond
                              ? "list_box_btn list_box_btn_primary"
                              : "list_box_btn list_box_btn_primary disabled"
                          }
                          onClick={() => {
                            if (addressInfo?.length > 0 && locationCond) {
                              placeOrder();
                            } else {
                              if (addressInfo?.length === 0) {
                                setSnackbarMessage("Please add an address");
                              } else if (!locationCond) {
                                setSnackbarMessage(
                                  "Sorry, the selected product is not available in your location."
                                );
                              }
                              setOpenSnackbar(true);
                            }
                          }}
                        >
                          Place your order
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AppDrawer
        children={
          <AppForm
            formSchema={templatefield}
            action={action}
            DyanmicValues={DyanmicValues}
            ApiSelectload={ApiSelectload}
          />
        }
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <AddressForm
        open={open}
        setOpen={setOpen}
        address={address}
        setAddress={setAddress}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarMessage={setSnackbarMessage}
        profileId={user_id}
        fetchAddress={fetchAddress}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Close Snackbar after 3 seconds
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage === "Record Saved" ? "success" : "error"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProceedBuy;
