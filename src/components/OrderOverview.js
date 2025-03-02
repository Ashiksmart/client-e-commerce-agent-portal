/* eslint-disable no-loop-func */
import _ from "lodash";
import { AllOrderBox, GenTab } from "./DetailsEssentials";
import { useEffect, useState } from "react";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { Alert, Snackbar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { AppLoader, AppModal } from "./CommonEssentials";

const OrderOverview = () => {
  const [loading, setLoading] = useState(true);
  const [tabActive, setTabActive] = useState("orders");
  const [trigger, setTrigger] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [popup, setPopup] = useState(false);
  const [cancelObj, setCancelObj] = useState({});
  const [contentMsg, setContentMsg] = useState(
    "Are you sure you want to cancel your orders?"
  );

  const navigate = useNavigate();
  const location = useLocation();
  const [isBack, setIsBack] = useState(location.state?.isBack);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const tabOptions = [
    {
      name: "orders",
      title: "Orders",
    },
    {
      name: "cancelled",
      title: "Cancelled Orders",
    },
  ];

  useEffect(() => {
    window.onpopstate = (e) => {
      if (isBack) {
        console.log(" back button clicked order overview ", e);
        navigate("/");
      }
    };
  }, [isBack]);

  const user_id = serviceProxy.localStorage.getItem("userId");
  useEffect(() => {
    setLoading(true);
    fetchOrderId(user_id.toString());
  }, [tabActive, trigger]);

  const fetchOrderId = async (id) => {
    const criteria = { user_id: id };
    const fields = ["id", "invoice_id", "delivery_charges", "created_at"];
    serviceProxy.business
      .find(
        Constants.Application,
        Constants.MODULES.OrderDetail,
        "view",
        criteria,
        fields,
        1,
        1000000
      )
      .then(async (result) => {
        if (result?.records.length > 0) {
          await fetchOrderDetails(result.records);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("FetchOrder Error : ", err);
        setLoading(false);
      });
  };

  const transformData = (inputData, key) => {
    const transformedData = [];

    inputData.forEach((item) => {
      const existingItem = transformedData.find((i) => i[key] === item[key]);

      if (existingItem) {
        existingItem.details.push(item);
      } else {
        let obj = {};
        obj[key] = item[key];
        obj.details = [item];
        transformedData.push(obj);
      }
    });

    return transformedData;
  };

  const fetchOrderDetails = async (orderDetails) => {
    let orderList = [];
    let isOrderPush = false;
    const invoiceIds = [];
    orderDetails.forEach((o) => {
      invoiceIds.push(...JSON.parse(o.invoice_id).ids);
    });

    if (invoiceIds.length > 0) {
      const criteria = { id: { $in: invoiceIds } };
      const fields = ["id", "address_info", "product_details", "created_at"];
      await serviceProxy.business
        .find(
          Constants.Application,
          Constants.MODULES.Orders,
          "view",
          criteria,
          fields,
          1,
          invoiceIds.length,
          undefined
        )
        .then(async (result) => {
          if (result?.records?.length > 0) {
            const overAllOrders = result.records;
            const orderRecord = [];

            for (const order of orderDetails) {
              if (order.invoice_id) {
                const invoiceIds = JSON.parse(order.invoice_id).ids;
                for (const invoiceId of invoiceIds) {
                  const getOrder = overAllOrders.find(
                    (o) => o.id.toString() === invoiceId
                  );
                  if (orderRecord.length === 0) {
                    const orderObj = {
                      order_id: order.id.toString(),
                      details: [getOrder],
                    };
                    orderRecord.push(orderObj);
                  } else {
                    const transformedDataIndex = orderRecord.findIndex(
                      (t) => t.order_id === order.id.toString()
                    );
                    if (transformedDataIndex !== -1) {
                      orderRecord[transformedDataIndex].details.push(getOrder);
                    } else {
                      const orderObj = {
                        order_id: order.id.toString(),
                        details: [getOrder],
                      };
                      orderRecord.push(orderObj);
                    }
                  }
                }
              }
            }
            if (orderRecord.length > 0) {
              const orderIds = [];
              for (const orderObj of orderRecord) {
                const orderQuery = orderObj.details.map((d) => d.id.toString());
                orderIds.push(...orderQuery);
              }
              const orderCriteria = { invoice_id: { $in: orderIds } };
              const fields = [
                "order_id",
                "invoice_id",
                "status",
                "link_to",
                "created_at",
              ];
              const trackResult = await serviceProxy.business.find(
                Constants.Application,
                Constants.MODULES.OrderTrack,
                "view",
                orderCriteria,
                fields,
                1,
                orderIds.length * 15,
                undefined
              );
              const trackRecord = transformData(
                trackResult.records,
                "invoice_id"
              );
              for (let index = 0; index < orderRecord.length; index++) {
                const orderData = orderRecord[index];
                let amount = 0;
                const orders = [];
                for (const order of orderData.details) {
                  if (trackResult?.records?.length > 0) {
                    const track = trackRecord.find(
                      (t) => t.invoice_id === order.id.toString()
                    );
                    track.details.sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    );
                    const records = track.details;
                    const recordLength = records.length;
                    order.isMoved = recordLength > 1;
                    const orderStatus = records[0].status;
                    const linkTo = records[0].link_to;
                    const tabActiveCondition =
                      tabActive === "cancelled"
                        ? linkTo === "cancel"
                        : linkTo !== "cancel";
                    if (tabActiveCondition) {
                      order.order_status = orderStatus;
                      order.orderCreatedAt = records[0].created_at;
                      order.linkTo = linkTo;
                      if (!_.isEmpty(order)) {
                        const productDetails = JSON.parse(
                          JSON.parse(order.product_details).details
                        );
                        const priceAggregateAmount = parseInt(
                          productDetails.price *
                            (1 - (productDetails.offer_percent ?? 0) / 100)
                        );
                        amount += subTotalCalc(
                          priceAggregateAmount,
                          JSON.parse(order.product_details).quantity
                        );
                        orders.push(order);
                      }
                    }
                  }
                }

                const orderValue = orderDetails.find(
                  (o) => o.id.toString() === orderData.order_id
                );
                if (!_.isEmpty(orders)) {
                  orderList.push({
                    id: orderData.order_id,
                    orders,
                    totalAmount: amount,
                    created_at: orderValue.created_at,
                    delivery_charges: orderValue.delivery_charges,
                  });
                }
                if (orderDetails.length === index + 1) {
                  isOrderPush = true;
                  console.log("isOrderPush Start : ", isOrderPush);
                }
              }
            }
          }
        })
        .catch((err) => {
          console.log("FetchOrderDetails Error : ", err);
        });
    }
    if (isOrderPush) {
      const sortedArray = orderList.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setOrderDetails(sortedArray);
      orderList = [];
      setLoading(false);
    }
  };

  const subTotalCalc = (amount, quantity) => {
    return quantity > 1 ? amount * quantity : amount;
  };

  const handleTabActive = (e) => {
    if (e.target.id) {
      setTabActive(e.target.id);
    }
  };

  if (loading) {
    return <AppLoader />;
  }

  const noFunc = () => {
    setPopup(false);
  };

  const cancelOrder = async () => {
    const { orderId, invoiceId, productStatus, categoryId } = cancelObj;
    setIsBack(false);

    const account_id =
      serviceProxy.localStorage.getItem("account_info")?.account;
    const criteria = {
      account_id: account_id,
      app_id: categoryId,
      page_type: Constants.MARKETPLACE,
      link_to: productStatus,
    };
    await serviceProxy.business
      .find(
        Constants.Application,
        Constants.MODULES.WorkflowStatus,
        "view",
        criteria
      )
      .then(async (result) => {
        if (result?.records?.length > 0) {
          const workFlowList = result.records;
          const getDefaultWorkflow = workFlowList.find(
            (r) => r.default_status === "Y"
          );
          if (!_.isEmpty(getDefaultWorkflow)) {
            await serviceProxy.business
              .create(Constants.Application, Constants.MODULES.OrderTrack, {
                order_id: orderId,
                invoice_id: invoiceId,
                status: getDefaultWorkflow.status_name,
                link_to: productStatus,
              })
              .then(async () => {
                const criteria = { id: invoiceId.toString() };
                const invoice = await serviceProxy.business.find(
                  Constants.Application,
                  Constants.MODULES.Orders,
                  "view",
                  criteria,
                  ["partner_id"]
                );

                const workflowStatusCriteria = {
                  account_id: account_id,
                  order_id: orderId.toString(),
                  invoice_id: invoiceId.toString(),
                  work_status: { $ne: "completed" },
                  link_to: { $ne: productStatus },
                };
                const getTask = await serviceProxy.business.find(
                  Constants.Application,
                  Constants.MODULES.TaskLog,
                  "view",
                  workflowStatusCriteria
                );

                if (!_.isEmpty(getTask?.records)) {
                  for (const taskObj of getTask.records) {
                    let updateTaskLog = {
                      id: taskObj.id,
                      work_status: "closed",
                    };
                    await serviceProxy.business
                      .update(
                        Constants.Application,
                        Constants.MODULES.TaskLog,
                        updateTaskLog
                      )
                      .then(async (result) => {
                        console.log(result);
                      })
                      .catch((err) => {
                        console.log("ERR : ", err);
                        setSnackbarMessage("Order Cancellation Failed");
                        setOpenSnackbar(true);
                        setPopup(false);
                        setIsBack(false);
                        setTrigger((t) => !t);
                      });
                  }

                  for (const workFlow of workFlowList) {
                    const taskPayload = {
                      app_id: workFlow.app_id,
                      account_id: workFlow.account_id,
                      partner_id: invoice?.records?.[0]?.partner_id ?? null,
                      invoice_id: invoiceId,
                      order_id: orderId.toString(),
                      name: workFlow.display_name,
                      description: workFlow.display_name,
                      status: workFlow.status_name,
                      work_status: "todo",
                      link_to: workFlow.link_to,
                    };
                    await serviceProxy.business
                      .create(
                        Constants.Application,
                        Constants.MODULES.TaskLog,
                        taskPayload
                      )
                      // eslint-disable-next-line no-loop-func
                      .catch((err) => {
                        console.log("ERR : ", err);
                        setSnackbarMessage("Order Cancellation Failed");
                        setOpenSnackbar(true);
                        setPopup(false);
                        setIsBack(false);
                        setTrigger((t) => !t);
                      });
                  }

                  setSnackbarMessage("Order Cancelled Successfully");
                  setOpenSnackbar(true);
                  setPopup(false);
                  setIsBack(false);
                  setTrigger((t) => !t);
                }
              })
              .catch((err) => {
                console.log("ERR : ", err);
                setSnackbarMessage("Order Cancellation Failed");
                setOpenSnackbar(true);
                setPopup(false);
                setIsBack(false);
                setTrigger((t) => !t);
              });
          } else {
            console.log("Didn't find default workflow status");
            setSnackbarMessage("Order Cancellation Failed");
            setOpenSnackbar(true);
            setPopup(false);
            setIsBack(false);
            setTrigger((t) => !t);
          }
        }
      })
      .catch((err) => {
        console.log("ERR : ", err);
        setSnackbarMessage("Order Cancellation Failed");
        setOpenSnackbar(true);
        setPopup(false);
        setIsBack(false);
        setTrigger((t) => !t);
      });
  };

  return (
    <>
      <div>
        <div style={{ marginBottom: 20 }}>
          <div class="detail_title sl_hide"> My Orders </div>
        </div>

        <div className="gen_box">
          <div className="gen_tab_head">
            <GenTab
              tabOptions={tabOptions}
              handleTabActive={handleTabActive}
              tabActive={tabActive}
            />
          </div>
          <AllOrderBox
            tabActive={tabActive}
            orderDetails={orderDetails}
            setPopup={setPopup}
            setContentMsg={setContentMsg}
            setCancelObj={setCancelObj}
          />
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            snackbarMessage === "Order Cancelled Successfully"
              ? "success"
              : "error"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <AppModal
        content={contentMsg}
        yesFunc={cancelOrder}
        noFunc={noFunc}
        confirmOpen={popup}
      ></AppModal>
    </>
  );
};

export default OrderOverview;
