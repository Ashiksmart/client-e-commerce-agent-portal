import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { InfoCircleFilled } from "@ant-design/icons";
import WestRoundedIcon from '@mui/icons-material/WestRounded';

// Helper function to avoid repetitive CSS class assignments
const getClassNames = (...classes) => classes.filter(Boolean).join(" ");

export const AppModal = ({ content, yesFunc, noFunc, confirmOpen, setConfirmOpen }) => {
  return (
    <div className={getClassNames("backdrop", confirmOpen && "backdrop-open")}>
      <div className="back-modal">
        <InfoCircleFilled style={{ color: "rgb(94 94 94)" }} />
        <div>{content}</div>
        <div className="d_fr">
          <button className="list_box_btn list_box_btn_primary" onClick={noFunc}>
            No
          </button>
          <button className="list_box_btn list_box_btn_primary" onClick={yesFunc}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export const AppLoader = () => (
  <div className="loader">
    <ThreeDots
      height="80"
      width="80"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperClassName="loader_col"
      visible={true}
      className={"loader_col"}
    />
  </div>
);

export const AuthLogo = ({ logopath }) => (
  <div className="auth_himgb">
    <img className="auth_himg" src={logopath} alt="basmart" />
  </div>
);

export const OfferCoversPoster = ({ offers }) => {
  const navigate = useNavigate();
  
  return (
    <div className="list_banner_box">
      {offers.map((item) => (
        <div
          key={item.id}
          className="list_banner_sec"
          onClick={() => navigate(`/products`, { state: { query: item.all } })}
        >
          <div className="list_banner_imgb">
            <img src={item.bannerName} className="list_banner_img" alt="Offer Banner" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const OfferCovers = ({ offers }) => {
  const navigate = useNavigate();

  return (
    <div className="list_banner_box">
      {offers.map((item) => (
        <div
          key={item.id}
          className="list_banner_sec"
          onClick={() => navigate(`/details`, { state: { productdetail: item } })}
        >
          <div className="list_banner_title">Offers on Top</div>
          <div className="sub_txt ml_hide_2">{item?.details?.name}</div>
          <div className="list_banner_imgb">
            <img
              src={require(`../assets/${item?.details?.img?.length ? "jpg/" + item?.details?.img[0] : "png/Noimage.png"}`)}
              className="list_banner_img"
              alt="Offer Image"
            />
          </div>
          <div className="list_banner_sub_title">
            {`Upto ${item?.details?.offer_percent}% Off`}
          </div>
        </div>
      ))}
    </div>
  );
};

export const RadioSecBox = ({ name, value, mainText, subText, checked, handleOptionChange }) => (
  <label className="buy_accord_sub_sec">
    <input
      type="radio"
      value={value}
      name={name}
      defaultChecked={checked === "Y"}
      onChange={handleOptionChange}
      style={{ visibility: "hidden" }}
    />
    <div className="cradio" />
    <div>
      <div className="mdtxt smtxt">{mainText}</div>
      <div className="sub_txt">{subText}</div>
    </div>
  </label>
);

export const CBack = ({ navigate }) => (
  <div className="chead_back_btn" onClick={() => navigate(-1)}>
    <WestRoundedIcon sx={{ width: "20px", height: "20px", color: "grey" }} />
    <div style={{ fontSize: "14px" }}>Back</div>
  </div>
);

export const CBadge = ({ status }) => (
  <div className="detail_badge">
    <div className="list_box_badge_txt sl_hide">{status?.status}</div>
  </div>
);

export const COptions = ({ options }) => (
  <div className="opt_cont">
    {options.map((o, i) => (
      <div key={i} className="opt_box">
        <div className="opt_box_lbl">{o.city_name}</div>
      </div>
    ))}
  </div>
);

export const AlertBox = ({ txt, type }) => (
  <div
    className={getClassNames(
      "alert_box",
      type === "error" && "bg_lgt_red",
      type === "success" && "bg_lgt_green",
      type !== "error" && type !== "success" && "bg_lgt_gry"
    )}
  >
    {txt}
  </div>
);

export const NoData = ({ txt }) => (
  <div className="no_rec_cont">
    <img
      className="no_rec_box_ico"
      src={require("../assets/png/no-data.png")}
      alt="No Data"
    />
    <div className="no_rec_box">{txt}</div>
  </div>
);

export const SectionContent = ({ title, des, btnTxt }) => (
  <li className="sec_box">
    <div className="sec_txt">{title}</div>
    <div className="sub_sec_txt">{des}</div>
    {btnTxt && <div className="btn btn_primary">{btnTxt}</div>}
  </li>
);