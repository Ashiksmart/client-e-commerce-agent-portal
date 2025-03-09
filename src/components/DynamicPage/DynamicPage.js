import { useState, useEffect } from "react";
import Listing from "./Listing";
import ProListing from "../Listing";
import Poster from "./Poster";
import SliderView from "./Slider";
import Banner from "../Banner";
import Title from "./Title";
import Constants from "../../constants";
import serviceProxy from "../../services/serviceProxy";
import { NoData } from "../CommonEssentials";

const DynamicPage = ({ Flow }) => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    // Extracted function to handle the data fetch and processing
    const fetchProductData = async (value) => {
        const updatedProducts = [];
        const data = JSON.parse(value.filter);

        for (let i = 0; i < data.length; i++) {
            const element = data[i].apidata;
            const elementDetails = {
                ...element.details,
                "$.is_attributed": "Y"
            };

            try {
                const response = await serviceProxy.business.find(
                    Constants.Application,
                    "product",
                    "view",
                    { ...element, details: elementDetails },
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
                            return { ...rest, details: detailData, additional_info_Data };
                        } catch (error) {
                            console.error("Error parsing product data:", error);
                        }
                    }
                    return null; // Ensure we return null if parsing fails
                }).filter(Boolean); // Filter out any null values

                if (productData.length > 0) {
                    updatedProducts.push(productData);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }

        return updatedProducts;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const allProducts = [];

            for (const value of Flow) {
                if (value.status_name === 'product_listing' && value.filter !== null) {
                    const productData = await fetchProductData(value);
                    allProducts.push(...productData);
                }
            }

            setProducts(allProducts);
            setLoading(false);
        };

        fetchData();
    }, [Flow]);

    return (
        <>
            {Flow.map((value, index) => (
                <div key={index} className="home_sec">
                    <Title details={value} />

                    {/* Product Listing Section */}
                    {value.status_name === "product_listing" && value.filter && products.length > 0 && (
                        products.map((list, productIndex) => (
                            <div key={productIndex}>
                                {list.map((product, innerIndex) => (
                                    <ProListing
                                        key={innerIndex}
                                        details={product?.details ?? product?.details}
                                        listOfProducts={product}
                                        loading={loading}
                                    />
                                ))}
                            </div>
                        ))
                    )}

                    {/* No Data Available Section */}
                    {value.status_name === "product_listing" && value.filter && products.length === 0 && (
                        <NoData txt="No data" />
                    )}

                    {/* Other Sections */}
                    {value.status_name === "slider" && value.filter && <Banner details={value.filter} />}
                    {value.status_name === "multiposter" && value.filter && <Listing details={value.filter} />}
                    {value.status_name === "singleposter" && value.filter && <Poster details={value.filter} />}
                    {value.status_name === "minislider" && value.filter && <SliderView details={value.filter} />}
                </div>
            ))}
        </>
    );
};

export default DynamicPage;