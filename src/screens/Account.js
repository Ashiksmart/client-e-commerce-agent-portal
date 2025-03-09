import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { jwtDecode } from "jwt-decode";
import { SectionTxt } from "./tc&pp";
import RecommendedProducts from "../components/RecommendedProducts";

export const Support = () => {
  const accountId = () => {
    const isLoggedIn = serviceProxy.localStorage.getItem("isLoggedIn");
    return isLoggedIn
      ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id
      : serviceProxy.localStorage.getItem("account_info").account;
  };

  const [flowData, setFlowData] = useState([]);

  useEffect(() => {
    const fetchFlow = () => {
      const account_id = accountId();
      const detailsQuery = {
        account_id: { $eq: account_id },
        app_id: { $eq: "-5" },
        page_type: { $eq: "client" },
      };

      serviceProxy.business
        .find(
          Constants.Application,
          "workflow_status",
          "view",
          detailsQuery,
          [],
          1,
          10,
          []
        )
        .then((response) => {
          if (response.records.length > 0) {
            const updatedRecords = response.records.map((element) => {
              element.content = JSON.parse(element.content);
              return element;
            });
            setFlowData(updatedRecords);
          }
        })
        .catch((error) => console.error(error));
    };

    fetchFlow();
  }, []);

  return (
    <>
      <Header />
      <div className="cbody">
        <div className="container container_center">
          <div>
            <div className="detail_title sl_hide">Support</div>
          </div>
          <div className="cart_container">
            <div className="dtl_box">
              {flowData.length > 0 &&
                flowData[0].content.map((item, index) => (
                  <div key={index}>
                    <SectionTxt title={item.title} description={item.description} />
                    <div className="clnk">{item.link}</div>
                    <div className="dtl_iconb">
                      <img
                        className="dtl_icon"
                        src={
                          serviceProxy.localStorage.getItem("account_info")
                            .image_domain +
                          item.image[0]?.file_path.replace(
                            "/domains/plum-wasp-686705.hostingersite.com/public_html",
                            ""
                          )
                        }
                        alt="support"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Account = () => {
  const navigate = useNavigate();
  const [accOpt, setAccOpt] = useState([
    { id: 1, title: "Your Orders", des: "Go to Your Orders", icon: "orders.png", lnk: "/my-orders" },
    { id: 2, title: "Profile", des: "Your Profile", icon: "user.png", lnk: "/profile" },
    { id: 3, title: "Contact Us", des: "Contact Support", icon: "support.png", lnk: "/support" },
    { id: 4, title: "Terms and Conditions", des: "Terms and Conditions", icon: "t&c.png", lnk: "/terms-and-conditions" },
    { id: 5, title: "Privacy Policy", des: "Privacy Policy", icon: "pp.png", lnk: "/privacy-policy" },
  ]);
  const [agentPermission, setAgentPermission] = useState(false);

  useEffect(() => {
    agentButtonPermission();
  }, []);

  const agentButtonPermission = async () => {
    try {
      const data = await serviceProxy.account.domain(Constants.DOMAIN);
      const hasPermission =
        data?.data?.data?.permissions?.client_partner_request === "Y";
      setAgentPermission(hasPermission);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      const loginRes = await serviceProxy.auth.logout();
      if (loginRes.status === 200 || loginRes?.response?.status === 401) {
        serviceProxy.localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <Header />
      <div className="cbody">
        <div className="container container_center">
          <div>
            <div className="detail_title sl_hide">Your Account</div>
          </div>
          <div className="opt_nav_cont">
            {accOpt.map((item) => (
              <a href={item.lnk} key={item.id}>
                <div className="opt_nav_box">
                  <div>
                    <div className="btxt sub_txt">{item.title}</div>
                    <div className="sub_txt">{item.des}</div>
                  </div>
                  <img
                    className="opt_nav_ico"
                    src={require(`../assets/png/${item.icon}`)}
                    alt={item.icon}
                  />
                  <img
                    className="opt_nav_icoo"
                    src={require(`../assets/png/${item.icon}`)}
                    alt={item.icon}
                  />
                </div>
              </a>
            ))}
            {agentPermission && (
              <div>
                <div
                  className="opt_nav_box"
                  onClick={() =>
                    navigate("/join-as-agent-form", {
                      state: { partner_id: undefined, type: "account" },
                    })
                  }
                >
                  <div>
                    <div className="btxt sub_txt">Join as an Agent</div>
                    <div className="sub_txt">Join as an Agent</div>
                  </div>
                  <img
                    className="opt_nav_ico"
                    src={require("../assets/png/join.png")}
                    alt="join"
                  />
                  <img
                    className="opt_nav_icoo"
                    src={require("../assets/png/join.png")}
                    alt="join"
                  />
                </div>
              </div>
            )}
            <a onClick={logout}>
              <div className="opt_nav_box">
                <div>
                  <div className="btxt sub_txt">Logout</div>
                  <div className="sub_txt">Logout the application</div>
                </div>
                <img
                  className="opt_nav_ico"
                  src={require(`../assets/png/user.png`)}
                  alt="user.png"
                />
                <img
                  className="opt_nav_icoo"
                  src={require(`../assets/png/user.png`)}
                  alt="user.png"
                />
              </div>
            </a>
          </div>
        </div>
        <RecommendedProducts />
      </div>
    </>
  );
};

export default Account;