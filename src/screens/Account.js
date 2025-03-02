import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import _ from "lodash";
import { jwtDecode } from "jwt-decode";
import { SectionTxt } from "./tc&pp";
import RecommendedProducts from "../components/RecommendedProducts";

export const Support = () => {
  const accountId = () => {
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')
    return isLoggedIn ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id : serviceProxy.localStorage.getItem('account_info').account
  }
  const [flowData, setFlowData] = useState()

  useEffect(() => {
    const fetchFlow = () => {
      const account_id = accountId()
      const detailsQuery = {
        account_id: { $eq: account_id },
        "app_id": {
          "$eq": "-5"
        },
        "page_type": {
          "$eq": "client"
        }
      }

      serviceProxy.business.find(Constants.Application, "workflow_status", "view", detailsQuery, [], 1, 10, [])
        .then((response) => {
          if (response.records.length > 0) {
            setFlowData((set) => {
              response.records.forEach(element => {
                console.log(JSON.parse(element.content));
                element.content = JSON.parse(element.content)
              });
              return response.records
            })
            // setFlowData(response.records)
          }

        }).catch((error) => {
          console.log(error)
        })
    }
    fetchFlow()
  }, [])

  return (
    <>
      <Header />
      <div className="cbody">
        <div className="container container_center">
          <div>
            <div class="detail_title sl_hide">Support</div>
          </div>
          <div className="cart_container">
            <div className="dtl_box">
              {flowData && flowData.length > 0 && flowData[0].content.map((item) => {
                return (
                  <>
                    <SectionTxt
                      title={item.title}
                      description={item.description}
                    />
                    <div className="clnk">{item.link}</div>
                    <div className="dtl_iconb">
                      <img
                        className="dtl_icon"
                        src={serviceProxy.localStorage.getItem('account_info').image_domain + item.image[0]?.file_path.replace('/var/www/html', "")}
                        alt={"support"}
                      />
                    </div>
                  </>
                )
              })}
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
    {
      id: 1,
      title: "Your Orders",
      des: "Go to Your Orders",
      icon: "orders.png",
      lnk: "/my-orders",
    },
    {
      id: 2,
      title: "Profile",
      des: "Your Profile",
      icon: "user.png",
      lnk: "/profile",
    },
    // {
    //     id: 3,
    //     title: "Your Addresses",
    //     des: "Your Addresses",
    //     lnk: "/my-addresses"
    // },
    {
      id: 3,
      title: "Contact Us",
      des: "Contact Support",
      icon: "support.png",
      lnk: "/support",
    },
    {
      id: 4,
      title: "Terms and Conditions",
      des: "Terms and Conditions",
      icon: "t&c.png",
      lnk: "/terms-and-conditions",
    },
    {
      id: 5,
      title: "Privacy Policy",
      des: "Privacy Policy",
      icon: "pp.png",
      lnk: "/privacy-policy",
    },
  ]);
  let [agent_permission, setagent_permission] = useState(false)
  useEffect(() => {
    agent_button_permission()
  }, [])
  let agent_button_permission = async () => {
    let getdata = await serviceProxy.account.domain(Constants.DOMAIN)
    if (getdata?.data?.data?.permissions?.client_partner_request === "Y") {
      setagent_permission(true)
    } else {
      setagent_permission(true)
    }


  }
  const logout = async () => {
    let loginres = await serviceProxy.auth.logout()
    if (loginres.status == 200 || loginres?.response?.status == 401) {

      serviceProxy.localStorage.clear()
      navigate('/')
    }
  }
  return (
    <>
      <Header />
      <div className="cbody">
        <div className="container container_center">
          <div>
            <div class="detail_title sl_hide">Your Account</div>
          </div>
          <div className="opt_nav_cont">
            {accOpt.map((item) => {
              return (
                <a href={item.lnk}>
                  <div className="opt_nav_box" key={item.id}>
                    <div className="">
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
              );
            })}
            {agent_permission &&
              (
                agent_permission) && (
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
                      <div className="btxt sub_txt">Join as a Agent</div>
                      <div className="sub_txt">Join as a Agent</div>
                    </div>
                    <img
                      className="opt_nav_ico"
                      src={require("../assets/png/join.png")}
                      alt={""}
                    />
                    <img
                      className="opt_nav_icoo"
                      src={require(`../assets/png/join.png`)}
                      alt={"join"}
                    />
                  </div>
                </div>
              )}
            {/* <div className="opt_nav_cont"> */}


            <a onClick={() => { logout() }}>
              <div className="opt_nav_box" >
                <div className="">
                  <div className="btxt sub_txt">{"Logout"}</div>
                  <div className="sub_txt">{"Logout the application"}</div>
                </div>
                <img
                  className="opt_nav_ico"
                  src={require(`../assets/png/${"user.png"}`)}
                  alt={"user.png"}
                />
                <img
                  className="opt_nav_icoo"
                  src={require(`../assets/png/${"user.png"}`)}
                  alt={"user.png"}
                />
              </div>
            </a>
            {/* </div> */}
          </div>
        </div>
        <RecommendedProducts />
      </div>
    </>
  );
};

export default Account;
