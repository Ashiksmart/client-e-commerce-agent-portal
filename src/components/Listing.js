import { useNavigate } from "react-router-dom";
import { images } from "../assets";
import "../styles/Listing.scss";
import { AppLoader } from "../components/CommonEssentials";
import serviceProxy from "../services/serviceProxy";
import { handleImages } from "../constants/imagepath";

const getImagePath = (imageData = {}) => {
  if (imageData?.image?.length > 0) {
    return handleImages(imageData.image, 1).imagepath;
  }
  return handleImages().imagepath;
};

const getProductName = (product = {}) => product?.product_title || product?.productName || product?.name;

const convertToNumber = (amount = "") => {
  const sanitizedAmount = amount.replace("₹", "");
  const numericValue = parseFloat(sanitizedAmount);
  return !Number.isNaN(numericValue) ? numericValue : false;
};

const calculateDiscountedPrice = (priceAmount = {}) => {
  const offerPercent = handleAmount(priceAmount?.offer_percent);
  const productPriceAmount = handleAmount(priceAmount?.price, priceAmount?.amount);
  const discount = offerPercent ? offerPercent : 0;
  const price = productPriceAmount ? productPriceAmount : 0;
  return parseInt(price * (1 - discount / 100));
};

const handleAmount = (...values) => {
  const amount = values.filter((value) => value).toString();
  return amount ? convertToNumber(amount) : false;
};

const validateOffer = (product = {}) => {
  return handleAmount(product?.offer_percent) && handleAmount(product?.price, product?.amount);
};

const Listing = ({ listOfProducts, selectedCategory, defaultCategory, loading, details }) => {
  const navigate = useNavigate();

  const productOriginalAmount = handleAmount(details.price, details.amount);
  const productAggregateAmount = calculateDiscountedPrice(details);
  const productOfferPercentage = handleAmount(details.offer_percent);
  const productStockStatus = details.in_stock === "Y" ? "Available" : "Out Of Stock";

  return (
    <div className="list_box" onClick={() => navigate(`/details`, { state: { productdetail: listOfProducts } })}>
      {loading && <AppLoader />}
      
      {!loading && (
        <>
          <div className="list_box_imgb">
            <img
              src={getImagePath(details)}
              className="list_box_img"
              alt={getProductName(details)}
            />
          </div>
          <div>
            <div className="list_box_title ml_hide_2">
              {getProductName(details)}
            </div>
            <div className="list_box_desg sl_hide">
              {selectedCategory || defaultCategory}
            </div>
          </div>

          {details?.is_costing || details?.is_costing === "Y" ? (
            <div>
              {productOfferPercentage && productAggregateAmount && Number(productOfferPercentage) <= 100 ? (
                <div>
                  {productOriginalAmount && productAggregateAmount && (
                    <span className="list_box_money">{"₹ " + productAggregateAmount}</span>
                  )}
                  {validateOffer(listOfProducts) && productOfferPercentage !== 0 && (
                    <span>
                      <span className="list_box_money_sm">{"₹ " + productOriginalAmount}</span>
                      <span>{`-${productOfferPercentage}%`}</span>
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <span className="list_box_money">FREE</span>
                </div>
              )}
            </div>
          ) : null}

          <div className="list_box_des">{details.description || ""}</div>

          <div className="list_box_btn btn_lgt_primary">See more Details</div>

          {details?.is_costing === "Y" && (
            <div className={`${details.in_stock === "Y" ? "btn_success" : "btn_lgt"} list_box_badge`}>
              <div className="list_box_badge_txt sl_hide">
                {productStockStatus}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Listing;