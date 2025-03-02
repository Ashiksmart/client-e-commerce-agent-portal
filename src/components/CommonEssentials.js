import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { InfoCircleFilled } from "@ant-design/icons";
import RecommendedProducts from "./RecommendedProducts";
import WestRoundedIcon from '@mui/icons-material/WestRounded';

export const AppModal = (props) => {
  const { content, yesFunc, noFunc, confirmOpen, setConfirmOpen } = props;
  return (
    <div className={`${confirmOpen ? "backdrop-open" : ""} backdrop`}>
      <div className="back-modal">
        <InfoCircleFilled style={{ color: "rgb(94 94 94)" }} />
        <div>{content}</div>
        <div className="d_fr">
          <div className="list_box_btn list_box_btn_primary" onClick={noFunc}>
            No
          </div>
          <div className="list_box_btn list_box_btn_primary" onClick={yesFunc}>
            Yes
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppLoader = () => {
  return (
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
};

export const AuthLogo = (props) => {
  return (
    <div className="auth_himgb">
      <img className="auth_himg" src={props.logopath} alt="basmart" />
    </div>
  );
};
export const OfferCoversPoster = (props) => {
  const { offers } = props;
  const navigate = useNavigate();
  return (
    <div className="list_banner_box">
      {offers.length > 0 &&
        offers.map((item, index) => {
          return (
            <div
              key={index}
              className="list_banner_sec"
              onClick={() =>
                navigate(`/products`, { state: { query: item.all } })
              }
            >
              <div className="list_banner_imgb">
                <img src={item.bannerName} className="list_banner_img" alt="" />
              </div>
              <div></div>
              {/* <div className="list_banner_sub_title">
              {`Upto ${item?.details?.offer_percent}% Off`}
            </div> */}
            </div>
          );
        })}
    </div>
  );
};

export const OfferCovers = (props) => {
  const { offers } = props;
  const navigate = useNavigate();
  return (
    <div className="list_banner_box">
      {offers.length > 0 &&
        offers.map((item, index) => {
          return (
            <div
              key={index}
              className="list_banner_sec"
              onClick={() => {
                navigate(`/details`, { state: { productdetail: item } });
              }}
            >
              <div className="list_banner_title">{` Offers on Top`}</div>
              <div className="sub_txt ml_hide_2">{item?.details?.name}</div>
              <div className="list_banner_imgb">
                <img
                  src={require(`../assets/${item?.details?.img?.length
                    ? "jpg/" + item?.details?.img[0]
                    : "png/Noimage.png"
                    }`)}
                  className="list_banner_img"
                  alt=""
                />
                {/* <img
                                src={require(`../assets/jpg/${offerData?.img?.length ? offerData?.img[0] : '../assets/png/Noimage.png'}`)}
                                className="list_banner_img"
                                alt=""
                            /> */}
              </div>
              <div></div>
              <div className="list_banner_sub_title">
                {`Upto ${item?.details?.offer_percent}% Off`}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export const RadioSecBox = (props) => {
  const { name, value, mainText, subText, checked, handleOptionChange } = props;
  return (
    <label className="buy_accord_sub_sec">
      <input
        type="radio"
        value={value}
        name={name}
        defaultChecked={checked === "Y"}
        onChange={handleOptionChange}
        style={{ visibility: "hidden" }}
      />
      <div className="cradio"></div>
      <div>
        <div className="mdtxt smtxt">{mainText}</div>
        <div className="sub_txt">{subText}</div>
      </div>
    </label>
  );
};

export const CBack = (props) => {
  const {
    navigate 
  } = props
  return (
    <div className="chead_back_btn" onClick={() => navigate(-1)}>
      <WestRoundedIcon
        sx={{
          width: "20px",
          height: "20px",
          color: "grey"
        }}
      />
      <div style={{
        fontSize: "14px"
      }}>
        Back
      </div>
    </div>
  );
};

export const CBadge = (status) => {
  return (
    <div className="detail_badge">
      <div className="list_box_badge_txt sl_hide">{status?.status}</div>
    </div>
  );
};

export const COptions = (props) => {
  const { options } = props;

  console.log(options);

  return (
    <div className="opt_cont">
      {options.map((o, i) => {
        return (
          <div className="opt_box">
            <div className="opt_box_lbl">{o.city_name}</div>
          </div>
        );
      })}
    </div>
  );
};

export const AlertBox = (props) => {
  const { txt, type } = props;
  return (
    <div
      className={`alert_box ${type == "error"
        ? "bg_lgt_red"
        : type == "success"
          ? "bg_lgt_green"
          : "bg_lgt_gry"
        }`}
    >
      {txt}
    </div>
  );
};

export const NoData = (props) => {
  const { txt } = props;

  return (
    <>
      <div className="no_rec_cont">
        <img
          className="no_rec_box_ico"
          src={require("../assets/png/no-data.png")}
          alt="no-data"
        />
        <div className={`no_rec_box`}>{txt}</div>
      </div>
     
    </>
  );
};

export const SectionContent = (props) => {
  const { title, des, btnTxt } = props;
  return (
    <li className="sec_box">
      <div className="sec_txt">Title</div>
      <div className="sub_sec_txt">Description</div>
      {btnTxt != "" ? <div className="btn btn_primary">Go to Link</div> : null}
    </li>
  );
};
