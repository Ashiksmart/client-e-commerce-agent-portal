import Header from "../components/Header";
import UnderConstruction from "../components/UnderConstruction";
import Footer from '../components/Footer'
import OrderOverview from "../components/OrderOverview";
import RecommendedProducts from "../components/RecommendedProducts";
const MyOrders = () => {
    return (
        <>
            <Header />

            
            <div className="gry_bg">
                <div className="cart_container">
                    <OrderOverview />
                </div>
                <RecommendedProducts></RecommendedProducts>
            </div>

            <Footer />
        </>
    )
}

export default MyOrders