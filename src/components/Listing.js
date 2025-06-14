import { useNavigate } from "react-router-dom";
import { images } from "../assets";
import "../styles/Listing.scss";
import { AppLoader } from "../components/CommonEssentials";
import serviceProxy from "../services/serviceProxy";
import { handleImages } from "../constants/imagepath";

const handleImageUpload = (data = {}) => {
  if (typeof data?.details?.img === "string" && data?.details?.img) {
    return "jpg/" + data?.details.img;
  } else if (data?.details?.img && data?.details?.img.length) {
    return "jpg/" + data?.details.img[0];
  } else {
    const noPictureRandomArray = [
      "Noimage.png",
      "Noimage1.png",
      "Noimage2.png",
    ];
    return (
      "png/" +
      noPictureRandomArray[
      Math.floor(Math.random() * noPictureRandomArray.length)
      ]
    );
  }
};

const handleProductsName = (product = {}) => {
  return product?.product_title || product?.productName || product?.name;
};

const convertToNumber = (amount = "") => {
  const removeSpecialCharacters = amount.replace("₹", "");
  const numericValue = parseFloat(removeSpecialCharacters);
  return !Number.isNaN(numericValue) ? parseFloat(numericValue) : false;
};

const handleAmount = (...rest) => {
  const amount = [...rest].filter((data) => data).toString();
  let value = false;
  if (typeof amount === "string" && amount) {
    value = convertToNumber(amount);
  } else if (typeof amount === "number" && amount) {
    value = amount;
  }
  return value?.toString() ?? value;
};

const handleCurrentPriceProduct = (priceAmount = {}) => {
  let offerPercent = handleAmount(priceAmount?.offer_percent);
  let productPriceAmount = handleAmount(
    priceAmount?.price,
    priceAmount?.amount
  );
  let value = false;
  offerPercent = offerPercent ? offerPercent : 0;
  productPriceAmount = productPriceAmount ? productPriceAmount : 0;
  value = productPriceAmount * (1 - (offerPercent ?? 0) / 100);
  return parseInt(value);
};

const validateOffers = (listOfProducts = {}) => {
  return !!(
    handleAmount(listOfProducts?.offer_percent) &&
    handleAmount(listOfProducts?.price, listOfProducts?.amount)
  );
};

const Listing = (props) => {
  const navigate = useNavigate();
  const {
    listOfProducts,
    selectedCategory,
    defaultCategory,
    loading,
    details,
  } = props;

  const productOriginalAmount = handleAmount(details.price, details.amount);

  const productAggregateAmount = handleCurrentPriceProduct(details);
  const productOfferPercentage = handleAmount(details.offer_percent);
  const imageLoader = (imagedata) => {
    let image = "";
    if (imagedata.image !== undefined && imagedata.image.length > 0) {
      image = imagedata?.image;
      return handleImages(image, 1).imagepath;
    } else {
      return handleImages().imagepath;
    }
  };
  const productStockStatus =
    details.in_stock === "Y" ? "Available" : "Out Of Stock";
  return (
    <div
      className="list_box"
      onClick={() => {
        navigate(`/details`, { state: { productdetail: listOfProducts } });
      }}
    >
      {loading && <AppLoader />}
      {!loading && (
        <>
          <div className="list_box_imgb">
            <img
              src={imageLoader(details)}
              // src={imageLoader(details)}
              className="list_box_img"
              alt={""}
            />
          </div>
          <div>
            <div className="list_box_title ml_hide_2">
              {handleProductsName(details)}
            </div>
            <div className="list_box_desg sl_hide">
              {selectedCategory ? selectedCategory : defaultCategory}
            </div>
          </div>
          {details?.is_costing || details?.is_costing === "Y" ? (
            <div>
              {!!productOfferPercentage &&
                !!productAggregateAmount &&
                Number(productOfferPercentage) <= 100 ? (
                <div className="">
                  {!!productOriginalAmount && !!productAggregateAmount && (
                    <span className="list_box_money">
                      {"₹ " + productAggregateAmount}
                    </span>
                  )}
                  {validateOffers(listOfProducts) &&
                    !!productOfferPercentage &&
                    Number(productOfferPercentage) !== 0 && (
                      <span>
                        <span className="list_box_money_sm">
                          {"₹ " + productOriginalAmount}
                        </span>
                        <span className="">
                          {`-${productOfferPercentage}%`}
                        </span>
                      </span>
                    )}
                </div>
              ) : (
                <div className="">
                  <span className="list_box_money">FREE</span>
                </div>
              )}
            </div>
          ) : null}

          <div className="list_box_des">{details.description ?? ""}</div>
          {/* <div className="list_box_tags">
        <div className="list_box_tag">Home</div>
        <div className="list_box_tag">Office</div>
      </div> */}
          <div className="list_box_btn btn_lgt_primary">See more Details</div>
          {details?.is_costing === "Y" ? (
            <div
              className={`${details.in_stock === "Y" ? "btn_success" : "btn_lgt"
                } list_box_badge`}
            >
              <div className="list_box_badge_txt sl_hide">
                {productStockStatus}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Listing;
