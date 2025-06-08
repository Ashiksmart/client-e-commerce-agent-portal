import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Header.scss';
import { SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { SET_CART_DETAILS } from '../redux/slices/store';
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import { _sum } from "../utils/mainStream";
import { jwtDecode } from 'jwt-decode';
import { checkFilterObj } from '../utils/utilities';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

const Header = ({ services, trigger, setTrigger, setCityList }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentCartDetails = useSelector((state) => state.pageData.cartDetails);
    
    const [cartDetails, setCartDetails] = useState(currentCartDetails);
    const [optOpen, setOptOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchScope, setSearchScope] = useState('');
    const [cities, setCities] = useState([]);
    const [searchFoc, setSearchFoc] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [categoryDetails, setCategoryDetails] = useState([]);

    const currentPath = location.pathname;
    const isLoggedIn = serviceProxy.localStorage.getItem("isLoggedIn");
    const userId = serviceProxy.localStorage.getItem("userId");

    if (!serviceProxy.auth.getJWTToken()) {
        serviceProxy.localStorage.setPrefixKey("b4b");
        serviceProxy.localStorage.setItem('isLoggedIn', false);
    }

    const accountId = () => {
        const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn');
        return isLoggedIn ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id : serviceProxy.localStorage.getItem('account_info').account;
    };

    // Fetch category details
    useEffect(() => {
        fetchCategoryDetails();
        fetchCities();
        if (!currentPath.includes('/products')) {
            serviceProxy.localStorage.setItem("searchQuery", "");
        }
    }, []);

    useEffect(()=>{
       setFilteredCities(cities);
    }, [cities])


    const fetchCategoryDetails = async () => {
            try {
                const response = await serviceProxy.business.find(
                    Constants.Application, "market_place", "view", {
                        is_client_show: { $eq: "Y" },
                        account_id: { $eq: accountId() },
                        is_default: { $eq: "N" },
                        is_active: { $eq: "Y" },
                        show_on_market: { $eq: "Y" },
                        is_costing: { $eq: "Y" }
                    });
                setCategoryDetails(response.records.length > 0 ? response.records : []);
            } catch (error) {
                console.error("Error fetching category details:", error);
            }
        };

        const fetchCities = async () => {
            try {
                const response = await serviceProxy.business.find(
                    Constants.Application, Constants.MODULES.LocationCity, "view", { is_active: 'Y' }, ["city_name", "city_code"], 1, 1000000, [{ column: "city_name", order: "asc" }]
                );
                setCities(response.records);
                const term = serviceProxy.localStorage.getItem("cityName")
                const filtered = term == "All Cities" ? cities : cities.filter((c) => c.city_name.toLowerCase().includes(term.toLowerCase()));
                setFilteredCities(filtered)
                if (response.records?.length) {
                    setSelectedCity(serviceProxy.localStorage.getItem('cityCode')?.toString() || '');
                    if (setCityList) setCityList(response.records);
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

    // Fetch cart details
    useEffect(() => {
        const fetchCartDetails = async () => {
            if (!Object.keys(currentCartDetails).length > 0) {
                try {
                    const response = await serviceProxy.business.find(
                        Constants.Application, Constants.MODULES.Cart, "view", { user_id: userId }, [], 1, 1, []
                    );
                    let quantity = 0;
                    if (response?.records?.length) {
                        const { products } = response.records[0];
                        const productsParsed = JSON.parse(products);
                        response.records[0].products = productsParsed;
                        dispatch(SET_CART_DETAILS(response.records[0]));

                        quantity = _sum(productsParsed?.items, 'quantity');
                    }
                    setQuantity(quantity);
                    setCartDetails(response?.records ?? []);
                } catch (error) {
                    console.error("Error fetching cart details:", error);
                }
            } else {
                setQuantity(_sum(currentCartDetails.products?.items, 'quantity'));
                setCartDetails(currentCartDetails);
            }
        };

        fetchCartDetails();
    }, [currentCartDetails, trigger]);

    const handleSearch = (event) => {
        event.stopPropagation();
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = cities.filter((c) => c.city_name.toLowerCase().includes(term.toLowerCase()));
        setFilteredCities(filtered);
    };

    const handleCityChange = (cityCode, name) => {
        serviceProxy.localStorage.setItem("cityCode", cityCode);
        serviceProxy.localStorage.setItem("cityName", name);
        setSelectedCity(cityCode);
        
        if (currentPath.includes('/products')) {
            setTrigger((t) => !t);
        } else {
            navigate(`/products`, { state: { query: buildFilterQuery(cityCode) } });
        }
        setSearchTerm('');
        setFilteredCities(cities);
        setOptOpen(false)
    };

    const buildFilterQuery = (cityCode) => {
        const query = {
            is_active: { "$eq": "Y" },
            account_id: { "$eq": accountId() },
            details: {
                "$.is_attributed": "Y",
                "$.city": cityCode,
                "$.tags": serviceProxy.localStorage.getItem("searchQuery")
            }
        };
        if (currentPath.includes('/category')) {
            query.category_id = { $eq: categorydata.app_id };
        }
        return checkFilterObj(query);
    };

    const handleSearchScope = () => {
        serviceProxy.localStorage.setItem("searchQuery", searchScope);
        if (currentPath.includes('/products')) {
            setTrigger((t) => !t);
            setSearchScope('');
        } else {
            navigate(`/products`, { state: { query: buildFilterQuery(serviceProxy.localStorage.getItem('cityCode')) } });
        }
    };

    const handleEnterSearch = (e) => {
        if (e.key === 'Enter') handleSearchScope();
    };

    return (
        <div className={`chead ${(currentPath !== '/' && !currentPath.includes('/profile') && !currentPath.includes('/category') && !currentPath.includes('/products') && !currentPath.includes('/supplier-profile') && !currentPath.includes('/details')) ? "chead_norm" : ""}`}>
            <div className='chead_sec' style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                <div className="chead_imgb">
                    <div className="chead_logo_imgb">
                        <img src={serviceProxy.localStorage.getItem("account_details").primay_logo} className="chead_logo_img" alt="basmart" />
                    </div>
                </div>
            </div>

            {!(currentPath !== '/' && !currentPath.includes('/profile') && !currentPath.includes('/category') && !currentPath.includes('/products') && !currentPath.includes('/supplier-profile') && !currentPath.includes('/details')) &&
                <div className={`chead_searchb ${searchFoc ? "search_foc_active" : ""}`}>
                    <div className='chead_loc'>
                        <div className='chead_loc_sec' onClick={() => setOptOpen(prev => !prev)}>
                            <span className='chead_loc_icob'>
                                <img className='chead_loc_ico' src={require('../assets/png/location-pin.png')} alt='location-pin' />
                            </span>
                            <span className='chead_loc_lbl'>
                                {serviceProxy.localStorage.getItem("cityName")}
                            </span>
                            <ArrowDropDownRoundedIcon sx={{ width: "30px", height: "30px" }} />
                        </div>
                        {optOpen &&
                            <div className='chead_loc_search'>
                                <div style={{ padding: '10px', paddingBottom: '0px' }}>
                                    <input type='text' placeholder='Search Cities' value={searchTerm} onChange={handleSearch} className='chead_loc_search_inp' />
                                </div>
                                <div>
                                    <div className="opt_cont">
                                        <div className="opt_box" onClick={() => handleCityChange("", "All Cities")}>
                                            <div className={selectedCity === "" ? 'opt_box_lbl selected' : 'opt_box_lbl'}>All Cities</div>
                                        </div>
                                        {filteredCities.length > 0 && filteredCities.map((o) => (
                                            <div key={o.city_code} className="opt_box" onClick={() => handleCityChange(o.city_code.toString(), o.city_name)}>
                                                <div className={selectedCity === o.city_code.toString() ? 'opt_box_lbl selected' : 'opt_box_lbl'}>{o.city_name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <input
                            type="text"
                            className="chead_search"
                            placeholder='Search'
                            value={searchScope}
                            onFocus={() => setSearchFoc(true)}
                            onBlur={() => setSearchFoc(false)}
                            onKeyDown={handleEnterSearch}
                            onChange={(event) => {
                                const term = event.target.value.toLowerCase();
                                serviceProxy.localStorage.setItem("searchQuery", term);
                                setSearchScope(term);
                            }}
                        />
                        <div className='6t'>
                            <div className="chead_search_btn" onClick={handleSearchScope}>
                                <SearchOutlined style={{ fontSize: '16px', color: '#ffffff' }} />
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className='chead_sec chead_rgt'>
                {isLoggedIn && categoryDetails.filter(i => i.process !== 'service').length > 0 &&
                    <div className={'chead_icob'} onClick={() => navigate('/my-orders')}>
                        <img className='chead_ico_img' src={require("../assets/png/shopping-bag.png")} alt="order-icon" />
                    </div>
                }
                {isLoggedIn && categoryDetails.filter(i => i.process !== 'service').length > 0 &&
                    <div className={`${quantity === 0 ? 'chead_icob disabled' : 'chead_icob'}`} onClick={() => quantity && navigate('/cart')}>
                        <ShoppingCartOutlined className='chead_ico' style={{ color: 'grey' }} />
                        <div className='chead_badge_ico'>{quantity}</div>
                    </div>
                }
                {isLoggedIn && <div className='chead_icob' onClick={() => navigate('/your-account')}>
                    <UserOutlined className='chead_ico' style={{ color: 'grey' }} />
                </div>}
                {!isLoggedIn && <div onClick={() => navigate('/login')}>
                    <div className="list_box_btn list_box_btn_primary">Login</div>
                </div>}
            </div>
        </div>
    );
};

export default Header;