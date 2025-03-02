import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import Footer from "../components/Footer";
import { json, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { handleImages } from "../constants/imagepath";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import { AppLoader } from "../components/CommonEssentials";
import RecommendedProducts from "../components/RecommendedProducts";

const InvoiceContent = (props) => {
  const {
    orderInfo,
    taxValue
  } = props
  let invDtl = orderInfo
  console.log(orderInfo);

  let grandTot = parseInt(invDtl?.totalAmount ?? 0) +
    parseInt(invDtl?.totalAmount === 0 ? 0 : taxValue) +
    parseInt(invDtl?.delivery_charges ?? 0)

  return (
    <>
      <div class="invoice-box" id="invoiceContent">
        <table cellpadding="0" cellspacing="0">
          <tr class="top">
            <td colspan="6">
              <table>
                <tr>
                  <td class="title">
                    <img
                      src={serviceProxy.localStorage.getItem("account_details").primay_logo}
                      style={{
                        width: "100%",
                        maxWidth: "200px"
                      }}
                      alt='invoice_image'
                    />
                  </td>

                  <td>
                    Invoice : {invDtl && invDtl?.id}<br />
                    Created: {invDtl && invDtl?.created_at}<br />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {/* <tr class="information">
            <td colspan="4">
              <table>
                <tr>
                  <td>
                    Sparksuite, Inc.<br />
                    12345 Sunny Road<br />
                    Sunnyville, CA 12345
                  </td>

                  <td>
                    Acme Corp.<br />
                    John Doe<br />
                    john@example.com
                  </td>
                </tr>
              </table>
            </td>
          </tr> */}
          <tr class="information">
            <td colspan="7">
              <table>
                <tr>
                  <td>
                    <div style={{
                      fontWeight: 600
                    }}>
                      Billing Detail
                    </div>
                    {invDtl && invDtl?.address?.billing}<br />
                  </td>

                  <td>
                    <div style={{
                      fontWeight: 600
                    }}>
                      Shipping Detail
                    </div>
                    {invDtl && invDtl?.address?.shipping}<br />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr class="heading">
            <td>Payment Method</td>

            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{
              textAlign: "right"
            }}>{'COD'}</td>
          </tr>

          <tr class="details">
            <td></td>
            <td></td>
          </tr>

          <tr class="heading">
            <td>Item</td>
            <td></td>
            <td></td>
            <td></td>
            <td>Qty</td>
            <td style={{ textAlign: "right" }}>Unit Price</td>
          </tr>
          {invDtl && invDtl?.orders.map((prodItem) => {
            return (
              <tr class="item">
                <td>{prodItem?.product_details?.details?.name}</td>
                <td></td>
                <td></td>
                <td></td>
                <td>{prodItem?.product_details?.quantity}</td>
                <td style={{ textAlign: "right" }}>{"₹" + parseInt(prodItem?.product_details?.details?.price * (1 - (prodItem?.product_details?.details?.offer_percent ?? 0) / 100))}</td>
              </tr>
            )
          })}
          <tr class="heading">
            <td>Sub Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right" }}>{invDtl && "₹" + invDtl?.totalAmount}</td>
          </tr>
          <tr class="heading">
            <td>Delivery Charges</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right" }}>{invDtl && "₹" + invDtl?.delivery_charges}</td>
          </tr>
          <tr class="heading">
            <td>Grand Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right" }}>{invDtl && "₹" + grandTot}</td>
          </tr>
          {/* <tr class="heading">
            <td>{convertPriceToWords(invDtl && invDtl?.billdetails.totalprice)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr> */}
          <tr class="heading">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right" }}><div>
              For:
              <div>
                {invDtl && invDtl[0]?.product_details?.supplierDetails?.name}
              </div>
              <div>
                {invDtl && invDtl?.product_details?.supplierDetails?.email}
                {invDtl && invDtl?.product_details?.supplierDetails?.phone_number}
              </div>
              <div>
                {invDtl && invDtl?.product_details?.supplierDetails?.address}
              </div>
            </div></td>
          </tr>
          <tr class="heading">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Authorized Signatory</td>
          </tr>
        </table>
      </div>
    </>
  )
}

const OrderDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const [taxValue, setTaxValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(true);

  useEffect(() => {
    if (location?.state?.order) {
      handleTaxDetails(location.state.order);
      setOrder(location.state.order);
      setLoading(false);
    } else {
      navigate("/my-orders");
    }
  }, []);

  const handleTaxDetails = async (productDetails) => {
    const account_id =
      serviceProxy.localStorage.getItem("account_info")?.account;
    const orderedProductDetails = productDetails.orders.map((data) => {
      const { address_info, product_details } = data;
      if (
        typeof address_info === "string" ||
        typeof product_details === "string"
      ) {
        data.address_info = JSON.parse(address_info);
        data.product_details = JSON.parse(product_details);
        data.product_details.details = JSON.parse(data.product_details.details);
      }
      return {
        id: data?.id,
        category_id: data?.product_details?.category_id,
        subCategory_id: data?.product_details?.details?.sub_category_id,
        ...data.product_details,
      };
    });
    const categoryIds = [
      ...new Set(
        orderedProductDetails
          .map((data) => data?.category_id)
          .filter((item) => item)
      ),
    ];
    const subcategoryIds = [
      ...new Set(
        orderedProductDetails
          .map((data) => data?.sub_category_id)
          .filter((item) => item)
      ),
    ];

    const categoryDetails = await serviceProxy.business.find(
      Constants.Application,
      "category_new",
      "view",
      { account_id, id: { $in: subcategoryIds }, is_active: { $eq: "Y" } },
      [],
      1,
      subcategoryIds?.length ?? 1,
      []
    );
    const { records } = categoryDetails;
    if (records?.length > 0) {
      const orderCategoryDetails = records;
      const TaxData = orderedProductDetails.flatMap((product) => {
        const category = orderCategoryDetails.find(
          (category) =>
            product.sub_category_id.toString() === category.id.toString()
        );
        if (category) {
          return { ...category, productDetail: product };
        }

        return [];
      });

      function calculatePercentageOfValue(
        value = 0,
        offerPercentage = 0,
        taxPercentage = 0,
        quantity = 0
      ) {
        value = offerPercentage
          ? Number(value) * (1 - Number(offerPercentage) / 100)
          : Number(value);
        taxPercentage = Number(taxPercentage);
        return Number(quantity) * ((taxPercentage / 100) * parseInt(value));
      }

      const TaxCalc = TaxData.reduce((accumlator, currentData) => {
        let gst = JSON.parse(currentData?.tax_details)?.gst ?? 0;
        return (
          accumlator +
          calculatePercentageOfValue(
            currentData?.productDetail?.details?.price,
            currentData?.productDetail?.details?.offer_percent,
            gst,
            currentData?.productDetail?.quantity
          )
        );
      }, 0);
      setTaxValue(Math.round(TaxCalc));
    }
  };
  const DownloadInvoice = () => {
    // setConfirmOpen(true)
    // Create a new jsPDF instance
    var pdf = new jsPDF();
    // if (confirmOpen) {

      // Get the HTML content of the invoice div
      var invoiceContent = document.getElementById("invoiceContent");

      // Use the html2pdf library to convert HTML to PDF
      html2pdf(invoiceContent, {
        margin: 10,
        filename: "invoice.pdf",
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      });
      // setConfirmOpen(false)
    // }
  };
  const totalAmount = order?.totalAmount ?? 0;

  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <Header />

      <div className="cbody">
        <div className={`${confirmOpen ? "backdrop-open" : ""} backdrop`} style={{
          zIndex: -1
        }}>
          <InvoiceContent
            orderInfo={order}
            taxValue={taxValue}
          />
        </div>
        <div className="cart_container">
          <div className="sts_head_box jc_bet">
            <div className="d_fr">
              <div className="sts_head_sec">
                <div className="smtxt cgrey">Order ID :</div>
                <div className="sub_txt">{order.id}</div>
              </div>
              <div className="sts_head_sec">
                <div className="smtxt cgrey">Ordered On :</div>
                <div className="sub_txt">{order.placedOn}</div>
              </div>
            </div>
            <div>
              <div
                className="clnk"
                onClick={() => {
                  DownloadInvoice();
                }}
              >
                Download invoice
              </div>
            </div>
            {/* <div>
                            <div class="list_box_btn list_box_btn_primary">
                                Download Invoice
                            </div>
                        </div> */}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 15,
              }}
            >
              {order?.orders?.length > 0 &&
                order.orders.map((o) => {
                  const product = o.product_details;
                  const productDetails = product.details;
                  const priceAggregateAmount = parseInt(
                    productDetails.price *
                    (1 - (productDetails.offer_percent ?? 0) / 100)
                  );

                  return (
                    <div className="cart_box d_fc">
                      <div className="d_fr">
                        <div className="cart_box_imgb md_img">
                          <img
                            className="cart_box_img"
                            src={
                              handleImages(
                                productDetails?.image?.length
                                  ? productDetails?.image
                                  : [],
                                1
                              ).imagepath
                            }
                            alt=""
                          />
                        </div>
                        <div
                          className="cart_box_rgt"
                          style={{ justifyContent: "flex-start" }}
                        >
                          <div className="row_sec">
                            <div>
                              <div className="detail_btxt sl_hide">
                                {productDetails.name}
                              </div>
                            </div>
                            <div className="detail_desg sl_hide">
                              {`Quantity: ${product.quantity}`}
                            </div>
                            <div className="detail_separator"></div>
                            <div>
                              <div className="">
                                <span className="list_box_money">
                                  {priceAggregateAmount <= 0
                                    ? "FREE"
                                    : `₹${priceAggregateAmount}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="detail_ft">
                                    <div>
                                        <div class="list_box_btn list_box_btn_primary">
                                            Track the Order
                                        </div>
                                    </div>
                                    <div>
                                        <div class="list_box_btn btn_lgt_red">
                                            Cancel the Order
                                        </div>
                                    </div>
                                </div> */}
                    </div>
                  );
                })}
              <div className="detail_row">
                <div className="detail_wsec detail_wsub_sec">
                  <div className="sec_btxt">Order Summary</div>
                  <div>
                    <div className="detail_row detail_sub_row">
                      <div className="sec_sub_txt">Sub total</div>
                      <div className="mdtxt">₹{totalAmount}</div>
                    </div>
                    <div className="detail_row detail_sub_row">
                      <div className="sec_sub_txt">Tax</div>
                      <div className="mdtxt">
                        {totalAmount === 0 ? 0 : taxValue}
                      </div>
                    </div>
                    <div className="detail_row detail_sub_row">
                      <div className="sec_sub_txt">Delivery Charges</div>
                      <div className="mdtxt">
                        ₹{order?.delivery_charges ?? 0}
                      </div>
                    </div>
                    <div className="detail_row detail_sub_row detail_sub_row_ft">
                      <div className="sec_sub_txt">Total Charges</div>
                      <div className="mdtxt">
                        {parseInt(order?.totalAmount ?? 0) +
                          (totalAmount === 0 ? 0 : taxValue) +
                          parseInt(order?.delivery_charges ?? 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail_row detail_col">
                <div className="detail_wsec">
                  <div className="sec_btxt">Billing Address</div>
                  <div className="smtxt">
                    {`${order.addressName.billing} ${order.address.billing} (${order.mobile.billing})`}
                  </div>
                </div>
                <div className="detail_wsec">
                  <div className="sec_btxt">Shipping Address</div>
                  <div className="smtxt">
                    {`${order.addressName.shipping} ${order.address.shipping} (${order.mobile.shipping})`}
                  </div>
                </div>
                <div className="detail_wsec">
                  <div className="sec_btxt">Payment Method</div>
                  <div className="smtxt">Mode: COD</div>
                </div>
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

export default OrderDetail;
