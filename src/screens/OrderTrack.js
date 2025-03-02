import { useEffect, useState } from "react";
import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import Footer from "../components/Footer";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLoader } from "../components/CommonEssentials";
import RecommendedProducts from "../components/RecommendedProducts";
const OrderTrack = () => {
  const [orderTimeline, setOrderTimeline] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [prodDetail, setProdDetail] = useState();
  const img = location?.state?.trackorder?.img;
  const invoiceId = location?.state?.trackorder?.invoiceId;
  const status = location?.state?.trackorder?.status;
  const navigate = useNavigate();

  const account_id = serviceProxy.localStorage.getItem("account_info")?.account;

  useEffect(() => {
    if (account_id && location?.state?.order) {
      workflowStatus();
      fetchProdDetails();
    } else {
      navigate("/");
    }
  }, []);

  const fetchProdDetails = async () => {
    const criteria = { id: { $eq: invoiceId } };
    const fields = ["id", "address_info", "product_details", "created_at"];
    await serviceProxy.business
      .find(
        Constants.Application,
        Constants.MODULES.Orders,
        "view",
        criteria,
        fields,
        1,
        undefined,
        undefined
      )
      .then(async (result) => {
        if (result?.records?.length > 0) {
          console.log(result.records);
          let prodDet = JSON.parse(
            JSON.parse(result.records[0].product_details).details
          );
          console.log(prodDet);
          setProdDetail([prodDet]);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const workflowStatus = () => {
    const criteria = {
      account_id: account_id,
      app_id: location.state.categoryId,
      page_type: Constants.MARKETPLACE,
    };
    if (status) {
      criteria.link_to = status;
    } else {
      criteria.link_to = { $eq: "" };
      criteria.link_type = { $eq: "" };
    }
    const sort = [{ column: "priority", order: "asc" }];
    serviceProxy.business
      .find(
        Constants.Application,
        Constants.MODULES.WorkflowStatus,
        "view",
        criteria,
        undefined,
        undefined,
        undefined,
        sort
      )
      .then((result) => {
        if (result?.records?.length > 0) {
          fetchOrderTrack(result.records);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("Fetch System Reference Error : ", err);
      });
  };
  const convertToHumanReadable=(timestamp)=> {
    const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  };
  const formattedTime = date.toLocaleString("en-US", options);

  return formattedTime;
  }
  
 
  
  const fetchOrderTrack = (orderTrack) => {
    const criteria = { invoice_id: invoiceId };
    const sort = [{ column: "created_at", order: "asc" }];
    serviceProxy.business
      .find(
        Constants.Application,
        Constants.MODULES.OrderTrack,
        "view",
        criteria,
        undefined,
        undefined,
        undefined,
        sort
      )
      .then((result) => {
        if (result?.records?.length > 0) {
          const orderStatus = result.records;
          orderTrack.forEach((track) => {
            orderStatus.forEach((o) => {
              if (track.status_name === o.status) {
                track.isActive = true;
                track.date=convertToHumanReadable(o.created_at)
              }
             
            });
          });
          setOrderTimeline(orderTrack);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("Fetch Order Track Error : ", err);
      });
  };

  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <Header />
      <div className="cbody">
        <div className="container container_center">
          <div class="detail_title sl_hide">My Orders </div>
          <div className="cart_box_sec">
            <div>
              <div className="row_sec">
                <div className="mdtxt"> Shipping Address </div>
                <div className="btxt smtxt cgrey">
                  {" "}
                  {location.state.order.addressName.shipping}{" "}
                </div>
                <div className="smtxt">
                  {" "}
                  {location.state.order.address.shipping}{" "}
                </div>
                <div className="smtxt">
                  {" "}
                  {location.state.order.mobile.shipping}{" "}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                justifyContent: "flex-start",
                alignItems: "flex-end",
              }}
            >
              <div>
                <div className="cart_box_imgb" style={{ marginRight: "0px" }}>
                  <img className="cart_box_img" src={img} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="cart_box_row">
            <div
              className="cart_box cart_box_50"
              style={{ flexDirection: "column" }}
            >
              <div className="order_track_cont">
                {prodDetail &&
                  prodDetail.map((item) => {
                    return (
                      <>
                        <div className="crow">
                          <div className="col_20">
                            <div className="btxt sub_txt">Product Name</div>
                          </div>
                          <div className="col_80">
                            <div className="sub_txt">{item?.name}</div>
                          </div>
                        </div>
                        <div className="crow">
                          <div className="col_20">
                            <div className="btxt sub_txt">Brand</div>
                          </div>
                          <div className="col_80">
                            <div className="sub_txt">{item?.brand}</div>
                          </div>
                        </div>
                        {item.offer_percent !== 0 &&
                          item.offer_percent !== "0" && (
                            <div className="crow">
                              <div className="col_20">
                                <div className="btxt sub_txt">Discount</div>
                              </div>
                              <div className="col_80">
                                <div className="sub_txt">
                                  {`${item.offer_percent}%`}
                                </div>
                              </div>
                            </div>
                          )}
                        <div className="crow">
                          <div className="col_20">
                            <div className="btxt sub_txt">Description</div>
                          </div>
                          <div className="col_80">
                            <div className="sub_txt">{item.description}</div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
            <div
              className="cart_box cart_box_50"
              style={{ flexDirection: "column" }}
            >
              <div className="order_track_cont">
                {orderTimeline.map((t, i) => {
                  const trackClass = t.isActive
                    ? "order_track_activebox"
                    : "order_track_box";
                  return (
                    <div key={i} className="order_track">
                      
                      <div className={trackClass}>
                        <div className={trackClass + "_line"}></div>
                      </div>
                      <div className="order_track_txt">{t.display_name}</div>
                      {t.date}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <RecommendedProducts></RecommendedProducts>
      </div>
      <Footer />
    </>
  );
};

export default OrderTrack;
