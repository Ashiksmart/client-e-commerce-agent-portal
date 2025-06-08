/* eslint-disable react-hooks/rules-of-hooks */
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import _ from "lodash";
import Listing from "../components/Listing";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const RecommendedProducts = () => {
  const [productLoading, setProductLoading] = useState(true);
  const [cartId, setCartId] = useState();
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  let [category, setcategory] = useState([]);
  let [brand, setbrand] = useState([]);
  let [app, setapp] = useState([]);
  const currentCartDetails = useSelector((state) => state.pageData.cartDetails);
  const account_id = serviceProxy.localStorage.getItem("account_info")?.account;
  useEffect(() => {
    watchProduct();
  }, []);
  useEffect(() => {
    if (Object.keys(currentCartDetails).length > 0) {
      const cardIds = currentCartDetails?.products?.items?.map(
        (data) => data.id
      );
      setCartId(!_.isEmpty(cardIds) ? cardIds : ["-0"]);
    }
  }, [currentCartDetails]);
  const watchProduct = async () => {
    const cityCode =
      serviceProxy.localStorage.getItem("cityCode")?.toString() || "";
    const recommendedParams = [


      {
        model: Constants.MODULES.Product,
        title: "Upto 40% Offers",
        query: {
          account_id: {
            $eq: account_id,
          },
          is_active: { $eq: "Y" },
          details: {
            "$.is_attributed": "Y",
            "$.offer_percent": {
              $gt: "0", $lt: "41",
            },
            "$.city": cityCode === "" ? "" : cityCode,
          },
        },
        limit: 10,
      },
      {
        model: Constants.MODULES.Product,
        title: "Upto 30% to 60% Offers",
        query: {
          account_id: {
            $eq: account_id,
          },
          is_active: { $eq: "Y" },
          details: {
            "$.is_attributed": "Y",
            "$.offer_percent": {
              $gt: "29", $lt: "61",
            },
            "$.city": cityCode === "" ? "" : cityCode,
          },
        },
        limit: 10,
      },
      {
        model: Constants.MODULES.Product,
        title: "Above 60% Offers",
        query: {
          account_id: {
            $eq: account_id,
          },
          is_active: { $eq: "Y" },
          details: {
            "$.is_attributed": "Y",
            "$.offer_percent": {
              $gt: "59"
            },
            "$.city": cityCode === "" ? "" : cityCode,
          },
        },
        limit: 10,
      },

      {
        model: Constants.MODULES.Product,
        title: "More Items to Explore",
        query: {
          account_id: {
            $eq: account_id,
          },
          is_active: { $eq: "Y" },
          details: {
            "$.is_attributed": "Y",
            "$.city": cityCode === "" ? "" : cityCode,
          },
        },
        limit: 10,
      },
      {
        model: Constants.MODULES.Product,
        title: "Dont miss your products in your cart",
        query: {
          account_id: {
            $eq: account_id,
          },
          is_active: { $eq: "Y" },
          id: { $in: cartId },
          details: {
            "$.is_attributed": "Y",
            "$.city": cityCode === "" ? "" : cityCode,
          },
        },
        limit: 10,
      },
    ];
    let output = []
    let remainingIndices = Array.from(recommendedParams.keys());
    for (let i = 0; i < 3; i++) {
      let randomIndex = Math.floor(Math.random() * remainingIndices.length);
      let selectedIndex = remainingIndices[randomIndex];
      if (recommendedParams[selectedIndex] !== undefined) {
        let insertproduct = recommendedParams[selectedIndex]
        output.push(insertproduct);

      }
      remainingIndices.splice(randomIndex, 1);

    }
    console.log(output, "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
    await Promise.all(output.map((r) => fetchProduct(r)))
      .then(() => {
        setRecommendedProducts(_.uniqBy(recommendedProducts, "title"));
      })
      .catch((error) => {
        console.log("error", error);
        setProductLoading(false);
      });
  };
  const pushUnique = (array, value) => {
    if (!array.includes(value)) {
      return true
    } else {
      return false
    }
  }
  const fetchProduct = (r) => {

    serviceProxy.business
      .find(Constants.Application, r.model, "view", r.query, [], 1, r.limit, [])
      .then((response) => {
        const productData = (response?.records ?? []).map((list) => {
          const { details, additional_info, ...rest } = list;
          if (details || additional_info) {
            try {
              const detailData = JSON.parse(details);
              const additional_info_Data = JSON.parse(additional_info);
              if (pushUnique(brand, detailData.brand)) {
                let arr = brand
                arr.push(detailData.brand)
                setbrand(arr)
              }
              if (pushUnique(category, list.sub_category_id)) {
                let arr = category
                arr.push(list.sub_category_id)
                setcategory(arr)
              }
              if (pushUnique(app, list.category_id)) {
                let arr = app
                arr.push(list.category_id)
                setapp(arr)
              }


              return {
                ...rest,
                details: detailData,
                additional_info_Data: additional_info_Data,
              };
            } catch (error) {
              console.error("Error parsing sub_category:", error);
            }
          }
        });
        const recommendedProductsList = {
          title: r.title,
          products: productData,
        };
        setRecommendedProducts((p) =>
          !_.isEmpty(p)
            ? [...p, recommendedProductsList]
            : [recommendedProductsList]
        );
      })
      .catch((error) => {
        console.log("error", error);
        setProductLoading(false);
      });
  };

  return (
    <>
      {recommendedProducts.length > 0 &&
        (recommendedProducts ?? []).map((r) => {
          return (
            <>
              {r?.products?.length > 0 && (
                <div key={r.id} className="no_rec_cont">
                  <div className="ctitle">
                    <div className="chead_title">
                      {r.title}
                    </div>
                  </div>
                  <div className="list_container">
                    {(r?.products ?? []).map((list) => {
                      return (
                        <Listing
                          key={list.id}
                          details={list?.details ?? JSON.parse(list?.details)}
                          listOfProducts={list}
                          loading={false}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          );
        })}
    </>
  );
};

export default RecommendedProducts;
