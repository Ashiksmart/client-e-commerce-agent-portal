import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { handleImages } from "../constants/imagepath";
import Lottie from "lottie-react";
import Tick from "../assets/json/tick.json";
import RecommendedProducts from "../components/RecommendedProducts";
const OrderPlace = () => {
  // const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { orderDetails } = useSelector((state) => state.store);
  const navigate = useNavigate();

  window.onpopstate = () => {
    console.log(" back button clicked order place ");
    navigate("/");
  };

  useEffect(() => {
    if (orderDetails.length === 0) {
      navigate("/");
    }
  }, []);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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

  const getAddress = (addressInfo) => {
    return (
      addressInfo?.address +
      ", " +
      JSON.parse(addressInfo?.city)?.city_name +
      ", " +
      JSON.parse(addressInfo?.state)?.state_name +
      ", " +
      addressInfo?.country +
      " " +
      addressInfo?.pincode
    );
  };

  // if (loading) {
  //     return (
  //         <ThreeDots
  //             height="80"
  //             width="80"
  //             radius="9"
  //             color="#93e1dd"
  //             ariaLabel="three-dots-loading"
  //             wrapperStyle={{}}
  //             wrapperClassName=""
  //             visible={true}
  //         />
  //     );
  // }

  return (
    <>
      <Header />

      <div className="cbody">
        <div className="cart_container">
          <div
            className="cart_box_sec cart_box_sec_col"
            style={{
              overflow: "initial",
            }}
          >
            <div className="cart_box_done">
              <div className="cart_box_ltxt">
                Order has been Placed SuccessFully
              </div>
              <Lottie
                style={{
                  width: 200,
                }}
                animationData={Tick}
                loop={false}
              />
              <div
                style={{ marginRight: 0 }}
                onClick={() =>
                  navigate("/my-orders", { state: { isBack: true } })
                }
                className="list_box_btn btn_white"
              >
                My Orders
              </div>
            </div>
            <div className="detail_separator"></div>
            <div>
              <div className="order_box">
                {orderDetails.map((o, i) => {
                  const details = JSON.parse(o.product_details.details);
                  return (
                    <div key={i} className="cart_box order_done_list">
                      <div
                        className="cart_box_imgb"
                        style={{ width: 100, height: 60 }}
                      >
                        <img
                          className="cart_box_img"
                          src={
                            handleImages(
                              details?.image?.length ? details?.image : [],
                              1
                            ).imagepath
                          }
                          alt=""
                        />
                      </div>
                      <div>
                        <div className="detail_lbl sl_hide">Delivery date</div>
                        <div className="detail_desg sl_hide">
                          {deliveryDate(details.delivery_date)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="row_sec col_sec addr_sec_box">
                <div className="detail_lbl">{`Shipping to `}</div>
                <div>
                  {`${
                    orderDetails[0]?.address_info?.shipping.name
                  } ${getAddress(orderDetails[0]?.address_info?.shipping)}`}
                </div>
              </div>
            </div>
          </div>
        </div>
        <RecommendedProducts></RecommendedProducts>
      </div>
      <Footer />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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

export default OrderPlace;
