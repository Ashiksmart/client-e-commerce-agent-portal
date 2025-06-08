// App.js
import Home from './screens/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Details from './screens/Details';
import ProductListing from './screens/ProductListing';
import Cart from './screens/Cart';
import SignUp from './screens/Auth/SignUp';
import Otp from './screens/Auth/Otp';
import Login from './screens/Auth/Login';
import ForgotPassword from './screens/Auth/ForgotPassword';
import CategoryPage from './screens/CategoryPage';
import SupplierProfile from './screens/SupplierProfile';
import ProceedBuy from './screens/ProceedBuy';
import OrderTrack from './screens/OrderTrack';
import JoinAgentForm from './screens/JoinAgentForm';
import Profile from './screens/Profile';
import { Provider } from "react-redux";
import store from './redux/utils/Store';
import MyOrders from './screens/MyOrders';
import OrderPlace from './screens/OrderPlace';
import OrderDetail from './screens/OrderDetail';
import Constants from './constants';
import NotFound from './screens/NotFound';
import AllCategoryPage from './screens/All_category';
import JoinCondition from './screens/JoinCondition';
import TermsAndConditions, { PrivacyPolicy } from './screens/tc&pp';
import Account, { Support } from './screens/Account';

function App() {

  return (
    <>
      <Provider store={store}>

        <BrowserRouter basename={Constants.BASE_PATH}>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Home />} />
            <Route path='/verify-otp' element={<Otp />} />
            <Route path='/verify-forgot-otp' element={<Otp />} />
            <Route path='/details' element={<Details />} />
            <Route path='/products' element={<ProductListing />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/proceed-buy' element={<ProceedBuy />} />
            <Route path='/my-orders' element={<MyOrders />} />
            <Route path='/track-order' element={<OrderTrack />} />
            <Route path='/order-place' element={<OrderPlace />} />
            <Route path='/order-detail' element={<OrderDetail />} />
            <Route path='/your-account' element={<Account />} />
            <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/join-as-agent-form' element={<JoinAgentForm />} />
            <Route path='/support' element={<Support />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/category' element={<CategoryPage />} />
            <Route path='/allcategory' element={<AllCategoryPage />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/supplier-profile' element={<SupplierProfile />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>

  );
}

export default App;
