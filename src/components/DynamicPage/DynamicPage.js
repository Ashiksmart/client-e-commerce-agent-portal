import Listing from "./Listing";
import ProListing from "../Listing";
import Poster from "./Poster";
import SliderView from "./Slider";
import Banner from "../Banner";
import Title from "./Title";
import Constants from "../../constants";
import serviceProxy from "../../services/serviceProxy";
import { useState, useEffect } from "react";
import { NoData } from "../CommonEssentials";

const DynamicPage = (props) => {
    const { Flow } = props;
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const updatedProducts = [];
            for (const value of Flow) {
                if (value.status_name === 'product_listing' && value.filter !== null) {


                    const data = JSON.parse(value.filter);
                    setLoading(true);
                    for (let i = 0; i < data.length; i++) {
                        let element = data[i].apidata;
                        if (element.details) {
                            element.details = {
                                ...element.details, ...{
                                    "$.is_attributed": "Y"
                                }
                            }
                        } else {
                            element.details = {
                                ...{
                                    "$.is_attributed": "Y"
                                }
                            }
                        }

                        try {
                            const response = await serviceProxy.business.find(
                                Constants.Application,
                                "product",
                                "view",
                                element,
                                [],
                                1,
                                10,
                                []
                            );
                            const productData = (response?.records ?? []).map((list) => {
                                const { details, additional_info, ...rest } = list;
                                if (details || additional_info) {
                                    try {
                                        const detailData = JSON.parse(details);
                                        const additional_info_Data = JSON.parse(additional_info);
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
                            if (productData.length > 0) {
                                updatedProducts.push(productData);
                            }

                        } catch (error) {
                            console.error("Error fetching products:", error);
                        }
                    }
                    setLoading(false);
                }
            }
            setProducts(updatedProducts);
        }

        fetchData();
    }, [Flow]);

    return (
        <>
            {Flow.map((value, index) => (
                <div key={index} className="home_sec">
                    <Title details={value} />
                    {value.status_name === "product_listing" && value.filter !== null && products.length > 0 && (
                        products.map((list, index) => (
                            < >
                                {list.map((product, innerIndex) => (
                                    <ProListing
                                        key={innerIndex}
                                        details={product?.details ?? product?.details}
                                        listOfProducts={product}
                                        loading={loading}
                                    />
                                ))}
                            </>
                        ))
                    )}
                    {value.status_name === "product_listing" && value.filter !== null && products.length === 0 &&
                        <>
                            <NoData
                                txt={"No data"}
                            />
                        </>}
                    {value.status_name === "slider" && value.filter !== null && <Banner details={value.filter} />}
                    {value.status_name === "multiposter" && value.filter !== null && <Listing details={value.filter} />}
                    {value.status_name === "singleposter" && value.filter !== null && <Poster details={value.filter} />}
                    {value.status_name === "minislider" && value.filter !== null && <SliderView details={value.filter} />}
                </div>
            ))}
        </>
    );
};

export default DynamicPage;
