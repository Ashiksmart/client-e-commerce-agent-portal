import CartItem from "../components/CartItem"
import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import Footer from '../components/Footer'
import { useEffect, useState } from "react";
import _ from 'lodash'
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import RecommendedProducts from "../components/RecommendedProducts";
const Cart = () => {
    const [trigger, setTrigger] = useState(false)
    const [cityList, setCityList] = useState({});
    const [addressCity, setAddressCity] = useState({})

    const user_id = serviceProxy.localStorage.getItem("userId")?.toString()
    useEffect(() => {
        fetchAddress(user_id)
    }, [])

    const cityCondition = (cityCode) => {
        if (!_.isEmpty(cityList) && !_.isEmpty(addressCity)) {
            const cityCodeAddress = cityList.find(c => c.city_code === JSON.parse(addressCity).city_code)
            return cityCode.includes(cityCodeAddress?.city_code?.toString())
        }
    }

    const fetchAddress = async (id) => {
        const addressCriteria = { user_id: { "$eq": id } };
        const addressFields = [
            "city",
            "is_default"
        ];
        const address = await serviceProxy.business.find(
            Constants.Application,
            Constants.MODULES.Address,
            "view",
            addressCriteria,
            addressFields
        );
        if (address?.records) {
            if (address.records.length === 1) { address.records[0].is_default = 'Y' }
            const addressInfo = address.records.find(a => a.is_default === 'Y')
            setAddressCity(addressInfo?.city)
        }
    };


    return (
        <>
            <Header trigger={trigger} setCityList={setCityList} />
            
            <div className="gry_bg">
                <div className="cart_container">
                    <CartItem setTrigger={setTrigger} cityCondition={cityCondition} />
                </div>
                <RecommendedProducts></RecommendedProducts>
            </div>
            <Footer />
        </>
    )
}

export default Cart