import Header from "../components/Header";
import Footer from "../components/Footer";
import UnderConstruction from "../components/UnderConstruction";
import { useNavigate, useLocation } from "react-router-dom";
import serviceProxy from "../services/serviceProxy";
import "../styles/Details.scss";
import "../styles/Listing.scss";
import _ from "lodash";
import { useEffect, useState } from "react";
import Constants from "../constants";
import Listing from "../components/Listing";
import { handleImages } from "../constants/imagepath";
import { NoData } from "../components/CommonEssentials";
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import RecommendedProducts from "../components/RecommendedProducts";
const SupplierProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const supplierInfo = location?.state?.supplierInfo || "";
  const currentProductDetail = location?.state?.currentProductDetail || "";

  const image =
    supplierInfo && supplierInfo?.avatar_url !== ""
      ? handleImages([JSON.parse(supplierInfo?.avatar_url)], 1).imagepath
      : handleImages().imagepath;

  let citycode = serviceProxy.localStorage.getItem("cityCode");
  const account_id = serviceProxy.localStorage.getItem("account_info")?.account;
  const [employee_permission, setemployee_permission] = useState(false)
 
  useEffect(() => {
    mount();
  }, []);
  useEffect(() => {
    if (supplierInfo === "" || "email" in supplierInfo === false) {
      navigate("/");
    }
  }, []);

  const mount = async () => {
    employee_button_permission()
  }
  let employee_button_permission = async () => {
    let getdata = await serviceProxy.account.domain(Constants.DOMAIN)
    if (getdata?.data?.data?.permissions?.client_employee_request === "Y") {
      setemployee_permission(true)
    } else {
      setemployee_permission(false)
    }


  }
  return (
    <>
      <Header />

      <div className="cbody">
        <div className="container container_center">
          <div className="cart_box" style={{ flexDirection: "column" }}>
            <div className="mdtxt">About</div>
            <div>
              <div className="col_sec">
                <div
                  className="prof_sec"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="prof_sec_sub">
                    <div className="detail_sub_sec">
                      <div className="prof_imgb">
                        <img className="auth_himg" alt="Profile" src={image} />
                      </div>
                    </div>
                    <div className="row_sec">
                      <div className="detail_sub_sec">
                        <div className="detail_lbl">Name:</div>
                        <div className="detail_sub_lbl">
                          {" "}
                          {supplierInfo.first_name}
                        </div>
                      </div>
                      <div className="detail_sub_sec">
                        <div className="detail_lbl">Email:</div>
                        <div className="detail_sub_lbl">
                          {" "}
                          {supplierInfo.email}
                        </div>
                      </div>
                      {/* <div className="detail_sub_sec">
                  <div className="detail_lbl">Address:</div>
                  <div className="detail_sub_lbl"> {supplierInfo.address}
                  </div>
                </div> */}
                      <div className="detail_sub_sec">
                        <div className="detail_lbl">Contact:</div>
                        <div className="detail_sub_lbl">
                          {" "}
                          {supplierInfo.phone_number}
                        </div>
                      </div>
                      {supplierInfo.description && (
                        <div className="detail_sub_sec">
                          <div className="detail_lbl">Description:</div>
                          <div className="detail_sub_lbl">
                            <div className="detail_des">
                              {supplierInfo.description}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  { employee_permission === true && <div
                      className="list_box_btn list_box_btn_primary"
                      onClick={() => navigate("/join-as-agent-form", { state: { partner_id: currentProductDetail.partner_id !==null?currentProductDetail.partner_id:undefined, type: "employee" } })}
                    >
                      Join as a Employee
                    </div>}
                </div>
              </div>
            </div>
          </div>
        
        </div>
        <RecommendedProducts/>
      </div>
      <Footer />
    </>
  );
};

export default SupplierProfile;
