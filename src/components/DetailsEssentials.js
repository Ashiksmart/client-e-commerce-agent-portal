import { useNavigate } from "react-router-dom";
import "../styles/Details.scss";
import { useEffect, useState } from "react";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { handleImages } from "../constants/imagepath";
import Attributes from "./Attributes";
import { AlertBox, NoData } from "./CommonEssentials";
export const SupplierDetails = (props) => {
  const { supplierDet: supplierInfo, currentProductDetail } = props;

  const navigate = useNavigate()

  return (
    <>
      {supplierInfo?.email && (
        <>
          <div className="detail_separator"></div>
          <div className="detail_sub_sec">
            <>
              <div className="detail_lbl">Sold By:</div>
              <div className="detail_sub_lbl">
                <div className="detail_sub_lnk" style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { navigate('/supplier-profile', { state: { supplierInfo, currentProductDetail } }) }}>
                  {supplierInfo.email}
                </div>
              </div>
            </>
          </div>
        </>
      )}
    </>
  );
};

export const GenTab = (props) => {
  const { tabOptions, handleTabActive, tabActive } = props;
  return (
    <>
      {tabOptions &&
        tabOptions.map((item) => {
          return (
            <div
              key={item.name}
              className={
                item.name == tabActive
                  ? "gen_tab_box gen_tab_active"
                  : "gen_tab_box"
              }
              onClick={(e) => handleTabActive(e)}
            >
              <div id={item.name} className="gen_tab_txt">
                {item.title}
              </div>
            </div>
          );
        })}
    </>
  );
};

export const AllOrderBox = (props) => {
  const {
    tabActive,
    orderDetails,
    setPopup,
    setContentMsg,
    setCancelObj
  } = props;
  const navigate = useNavigate()
  const getDate = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getUTCFullYear();
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getUTCDate()).padStart(2, "0");
    const formattedDateString = `${year}-${month}-${day}`;
    return formattedDateString;
  };

  const cancelletionPopup = (orderId, invoiceId, categoryId, productStatus) => {
    setPopup(true)
    setContentMsg(`Are you sure you want to ${productStatus} your orders?`)
    setCancelObj({ orderId, invoiceId, productStatus, categoryId })
  };

  const returnTrack = (order, o, exchangeDate, categoryId) => {
    if (o.order_status === 'refunded') {
      return <div className="detail_btxt cred">
        Delivered
      </div>
    } else {
      return <>
        <div className="detail_btxt cred">
          Delivered
        </div>
        {
          hasExchange(exchangeDate, o.orderCreatedAt) && <div className="detail_sub_lnk cred" style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => cancelletionPopup(order.id.toString(), o.id.toString(), categoryId, 'return')}>
            Return
          </div>
        }
      </>
    }
  }

  const hasExchange = (exchangeDate, createdDate) => {
    const customDate = new Date(createdDate);
    const currentDate = new Date();
    customDate.setDate(customDate.getDate() + Number(exchangeDate));
    return currentDate <= customDate;
  };

  return (
    <>
      <div className="sts_container">
        {orderDetails.length > 0 ? orderDetails.map((order) => {
          const address = JSON.parse(order.orders[0].address_info);
          order.addressName = {}
          order.address = {}
          order.mobile = {}
          const shipping = address.shipping.address + ", " + JSON.parse(address.shipping.city).city_name + ", " + JSON.parse(address.shipping.state).state_name + ", " + address.shipping.country + " " + address.shipping.pincode
          const billing = address.billing.address + ", " + JSON.parse(address.billing.city).city_name + ", " + JSON.parse(address.billing.state).state_name + ", " + address.billing.country + " " + address.billing.pincode
          order.addressName.shipping = address.shipping.name
          order.addressName.billing = address.billing.name
          order.address.shipping = shipping
          order.address.billing = billing
          order.mobile.shipping = address.shipping.mobile
          order.mobile.billing = address.billing.mobile
          order.placedOn = getDate(order.orders[0].created_at)

          return (
            <>
              <div className="sts_head_box">
                <div>
                  <div className="d_fr detail_sm_badge">
                    <div className="sub_txt cgreen btxt">
                      #ORDERID:
                    </div>
                    <div className="clnk">
                      {`${order.id}`}
                    </div>
                  </div>

                  <div className="d_fr">
                    <div className="sts_head_sec">
                      <div className="smtxt cgrey">Order Placed on</div>
                      <div className="sub_txt">
                        {order.placedOn}
                      </div>
                    </div>
                    <div className="sts_head_sec">
                      <div className="smtxt cgrey">Total</div>
                      <div className="sub_txt">{`₹${order.totalAmount}`}</div>
                    </div>
                    <div className="sts_head_sec">
                      <div className="smtxt cgrey">To</div>
                      <div className="sub_txt">{address.shipping.name}</div>
                    </div>
                  </div>
                </div>

                {tabActive !== "cancelled" && (
                  <div className="detail_sub_lnk" style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { navigate('/order-detail', { state: { order } }) }}>
                    View Order Details
                  </div>
                )}
              </div>
              {order.orders.map((o) => {
                const product = JSON.parse(o.product_details);
                const productDetails = JSON.parse(product.details);
                const category_id = product.category_id
                const priceAggregateAmount = parseInt(
                  productDetails.price *
                  (1 -
                    (productDetails.offer_percent ?? 0) /
                    100)
                );
                let trackorder_ = { invoiceId: o.id, img: handleImages(productDetails?.image?.length ? productDetails?.image : [], 1).imagepath }
                // let trackNavigationPath = `/track-order?invoiceId=${o.id}&img=${productDetails?.img?.length > 0 ? 'jpg/' + productDetails.img : 'png/NoImage2.png'}`
                if (o.linkTo) {
                  trackorder_["status"] = o.linkTo
                }

                const exchangeDate = JSON.parse(JSON.parse(o.product_details).details).exchange_date || '0'
                return (
                  <>
                    <div>
                      <div className="cart_box">
                        <div className="cart_box_imgb md_img">
                          <img
                            className="cart_box_img"
                            src={handleImages(productDetails?.image?.length ? productDetails?.image : [], 1).imagepath}
                            // src={productDetails?.img?.length > 0 ? '../assets/jpg/' + productDetails.img : '../assets/png/NoImage2.png'}
                            alt=""
                          />
                        </div>
                        <div
                          className="cart_box_rgt"
                          style={{ justifyContent: "flex-start" }}
                        >
                          <div className="row_sec">
                            <div>
                              <div className="detail_btxt sl_hide" style={{ cursor: 'pointer' }} onClick={() => { navigate(`/details`, { state: { productdetail: product } }) }}>
                                {productDetails.name}
                              </div>
                              <div className="detail_desg sl_hide">
                                {`Quantity: ${product.quantity}`}
                              </div>
                            </div>
                            <Attributes attributes={productDetails.attributes} selectedAttributes={product.attributes} />
                            {!!productDetails.offer_percent && !!priceAggregateAmount && Number(productDetails.offer_percent) <= 100 ? <div className="">
                              {!!priceAggregateAmount &&
                                !!productDetails.price && (
                                  <>
                                    <span className="">
                                      {(!!productDetails.offer_percent && Number(productDetails.offer_percent) !== 0) &&
                                        `-${productDetails.offer_percent} %`}
                                    </span>
                                    <span className="list_box_money">
                                      {`₹ ${priceAggregateAmount}`}
                                    </span>
                                  </>
                                )}
                              <div className="list_box_money_sm">
                                {(!!productDetails.offer_percent && Number(productDetails.offer_percent) !== 0) &&
                                  `₹ ${productDetails.price}`}
                              </div>

                            </div> : <div className="">
                              <span className="list_box_money">
                                FREE
                              </span>
                            </div>}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 15,
                                margin: 10,
                              }}
                            >
                              {tabActive !== "cancelled" ? (
                                <>
                                  {o.order_status !== 'delivered' ?
                                    <div className="detail_sub_lnk" style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { navigate('/track-order', { state: { order, categoryId: category_id, trackorder: trackorder_ } }) }}>
                                      Track Package
                                    </div>
                                    :
                                    returnTrack(order, o, exchangeDate, category_id)
                                  }
                                  {!o.isMoved && <div className="detail_sub_lnk cred" style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => cancelletionPopup(order.id.toString(), o.id.toString(), category_id, 'cancel')}>
                                    Cancel this Order
                                  </div>}
                                </>
                              ) : (
                                <>

                                  {o.order_status !== 'cancel_ordered' ?
                                    <div className="detail_sub_lnk" style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { navigate(`/track-order`, { state: { order, categoryId: category_id, trackorder: { invoiceId: o.id, img: handleImages(productDetails?.image?.length ? productDetails?.image : [], 1).imagepath, status: "cancel" } }, }) }}>
                                      Track Package
                                    </div>
                                    :
                                    <div className="detail_btxt cred">
                                      Cancelled
                                    </div>}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          );
        })
          :
          <NoData
            txt={"No Orders Found."}
          />
        }
      </div>
    </>
  );
};
