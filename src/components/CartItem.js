import '../styles/Details.scss'
import '../styles/Listing.scss'
import '../styles/Filter.scss'
import { SupplierDetails } from './DetailsEssentials'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react'
import serviceProxy from "../services/serviceProxy";
import Constants from "../constants";
import _ from "lodash"
import { SET_CART_DETAILS } from '../redux/slices/store';
import { AlertBox, AppLoader } from "../components/CommonEssentials";
import { _sum } from "../utils/mainStream"
import { handleImages } from "../constants/imagepath";
import Attributes from './Attributes'


const CartItem = (props) => {
    const { setTrigger, cityCondition } = props
    const dispatch = useDispatch();
    const currentCartDetails = useSelector((state) => state.pageData.cartDetails)
    const [productDetails, setProductDetails] = useState([])
    const [totalSubProducts, setTotalSubProducts] = useState(0)
    const [count, setCount] = useState(0)
    const [cartId, setCartId] = useState()
    const navigate = useNavigate()
    const account_id = serviceProxy.localStorage.getItem('account_info').account
    const [loading, setLoading] = useState(true);
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')

    useEffect(() => {
        if (Object.keys(currentCartDetails).length > 0) {
            setCartId(currentCartDetails?.id)
            const cardIds = currentCartDetails?.products?.items?.map(data => data.id)
            setCount(_sum(currentCartDetails.products?.items, 'quantity'))
            !cartId && cardIds?.length && fetchCartDetails(cardIds)
        } else {
            setLoading(false)
        }
    }, [currentCartDetails])

    useEffect(() => {
        const totalValue = productDetails.reduce((accumulator, currentProduct) => {
            return accumulator + ((currentProduct?.productAggregateAmount ?? 0) * (currentProduct.quantity ?? 0))
        }, 0)
        setTotalSubProducts(totalValue)
    }, [productDetails])

    const fetchCartDetails = (id = []) => {
        setLoading(true)
        serviceProxy.business.find(Constants.Application, Constants.MODULES.Product, "view", { account_id: { $eq: account_id }, is_active: { $eq: "Y" }, id: { "$in": id } }, ['id', 'account_id', 'partner_id', 'details'], 1, 100, [])
            .then(async (response) => {
                if (response?.records?.length > 0) {
                    const productData = []
                    for (const record of response.records) {
                        let { details, ...rest } = record
                        try {
                            record.details = details ? JSON.parse(details) : {}
                        } catch (error) {
                            console.log('error', error)
                        }
                        const priceAmount = record?.details?.price;
                        const priceAggregateAmount = parseInt(priceAmount * (1 - (record?.details?.offer_percent ?? 0) / 100));
                        const module = record?.partner_id && record?.partner_id !== '0' ? Constants.MODULES.PartnerAccount : Constants.MODULES.ProjectAccount
                        const query = record?.partner_id && record?.partner_id !== '0' ? { partner_id: { $eq: record?.partner_id } } : { account_id: { $eq: record?.account_id } }
                        const filteredCart = currentCartDetails?.products?.items?.filter(data => data?.id === record?.id)

                        for (const filterCart of filteredCart) {

                            const productObj = {
                                ...rest,
                                details: record?.details,
                                attributes: filterCart?.attributes,
                                quantity: filterCart?.quantity ?? 1,
                                productAggregateAmount: priceAggregateAmount,
                                productOriginalAmount: priceAmount,
                                productOfferPercentage: record?.details?.offer_percent
                            }

                            const supplierDetails = await new Promise((resolve) => {
                                serviceProxy.business.find(Constants.Application, module, "view", query, ["name", "email", "address", "phone_number"], 1, 1, []).then((supplierDetails) => {
                                    if (supplierDetails?.records?.length > 0) {
                                        resolve(supplierDetails.records[0])
                                    }
                                })
                            })
                            productObj.supplierDetails = supplierDetails
                            productData.push(productObj)
                        }
                    }

                    let totalCount = 0
                    currentCartDetails?.products?.items.forEach(c => {
                        totalCount += c.quantity
                    })
                    setCount(totalCount)
                    setProductDetails(productData);
                }
                setLoading(false)
            }).catch((error) => {
                console.log('error', error)
                setLoading(false)
                navigate(-1)
            })
    }

    const handleRemoveCart = (data) => {
        let payload = { ...currentCartDetails }
        payload = _.omit(payload, ['updated_by', 'updated_at', 'created_at', 'created_by'])
        const removeProduct = _.cloneDeep(payload.products.items)
        const rmIndex = removeProduct.findIndex(item => (item.id === data.id && _.isEqual(item.attributes, data.attributes)))
        removeProduct.splice(rmIndex, 1)

        payload.products = {
            ...payload.products,
            items: removeProduct
        };
        if (payload?.products?.items?.length) {
            dispatch(SET_CART_DETAILS(payload))
            serviceProxy.business.update(
                Constants.Application,
                Constants.MODULES.Cart,
                payload
            ).then((res) => {
                const removeProductDetails = _.cloneDeep(productDetails)
                const rmProIndex = removeProductDetails.findIndex(item => (item.id === data.id && _.isEqual(item.attributes, data.attributes)))
                removeProductDetails.splice(rmProIndex, 1)
                setProductDetails(removeProductDetails)
            }).catch(error => {
                console.log('error => ', error)
            })
        } else {
            serviceProxy.business.delete(Constants.Application, Constants.MODULES.Cart, currentCartDetails?.id).then((res) => {
                if (res) {
                    dispatch(SET_CART_DETAILS({}))
                    setProductDetails([])
                    setCount(0)
                    setTrigger((t) => !t)
                    navigate(-1)
                }
            })
        }
    }

    const handleCart = async (operation, item) => {
        const carts = []
        let totalCount = 0
        for (const product of productDetails) {
            let { id, quantity, ...rest } = product
            if (operation && (id === item?.id && _.isEqual(product.attributes, item.attributes))) {
                if (operation === 'Add') {
                    quantity += 1
                } else if (operation === 'Sub' && item?.quantity > 1) {
                    quantity -= 1
                }
            }
            totalCount += quantity

            carts.push({ id, quantity, ...rest })
        }
        await updateCartProduct(carts)
        setCount(totalCount)
    }

    const updateCartProduct = async (carts) => {

        const cart = carts.map(c => {
            return { id: c.id, quantity: c.quantity, attributes: c.attributes }
        })

        let payload = { id: cartId }
        payload.products = {
            items: cart
        };
        dispatch(SET_CART_DETAILS(payload))
        serviceProxy.business
            .update(Constants.Application, Constants.MODULES.Cart, payload)
            .then(() => {
                setProductDetails(carts)
                // setTrisgger((t) => !t)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if (loading) {
        return (
            <AppLoader />
        );
    }


    return (
        <>

            <div>
                <div className='cart_box_sec'>
                    <div>
                        <div className='mdtxt'>
                            Your Shopping Cart
                        </div>
                        <div className='cart_box_icob'>
                            <img alt="icon"
                                className='cart_box_ico'
                                src={require("../assets/png/ecommerce.png")} />
                        </div>
                    </div>
                </div>
                {productDetails.map((item) => {
                    const { name, in_stock, city, attributes } = item?.details
                    return (
                        <div className='cart_box'>
                            <div className='cart_box_imgb'>
                                <img
                                    className='cart_box_img'
                                    src={handleImages(item?.details?.image?.length ? item?.details?.image : [], 1).imagepath}
                                    alt=''
                                />
                            </div>
                            <div className='cart_box_rgt'>
                                <div className='row_sec'>
                                    <div className='row_sec'>
                                        <div className="detail_title sl_hide" style={{ cursor: 'pointer' }} onClick={() => { navigate(`/details`, { state: { productdetail: item } }) }}>
                                            {name}
                                        </div>
                                        <div className="detail_badge sl_hide">
                                            <div class="list_box_badge_txt sl_hide">
                                                {in_stock === 'Y' ? 'Available' : 'Out of stock'}
                                            </div>
                                        </div>
                                    </div>
                                    {!!item?.productOfferPercentage && !!item?.productAggregateAmount && Number(item?.productOfferPercentage) <= 100 ? <div className="">
                                        {!!item?.productAggregateAmount &&
                                            !!item?.productOriginalAmount && (
                                                <>
                                                    <span className="">
                                                        {(!!item?.productOfferPercentage && Number(item?.productOfferPercentage) !== 0) &&
                                                            `- ${item?.productOfferPercentage} %`}
                                                    </span>
                                                    <span className="list_box_money">
                                                        {`₹ ${item?.productAggregateAmount}`}
                                                    </span>
                                                </>
                                            )}
                                        <div className="list_box_money_sm">
                                            {(!!item?.productOfferPercentage && Number(item?.productOfferPercentage) !== 0) &&
                                                `₹ ${item?.productOriginalAmount}`}
                                        </div>

                                    </div> : <div className="">
                                        <span className="list_box_money">
                                            FREE
                                        </span>
                                    </div>}
                                    <SupplierDetails supplierDet={item.supplierDetails} />
                                    <Attributes attributes={attributes} selectedAttributes={item.attributes} />
                                    
                                    {isLoggedIn ?

                                        (!cityCondition(city) &&
                                            <AlertBox
                                                txt={`Sorry, the selected product is not available in your location, Please Add your Address in Your Profile.`}
                                                type="error"
                                            />
                                        )
                                        :
                                        (!cityCondition(city) &&
                                            <AlertBox
                                                txt={`Please Login to add the Product.`}
                                                type="error"
                                            />
                                        )
                                    }
                                    <div className='cart_box_qty_box'>
                                        <div style={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: 'grey'
                                        }}>
                                            Quantity :
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: '15px',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: '10px'
                                        }}>
                                            <div className='cart_box_qty'>
                                                <div className='cart_box_qty_btn' onClick={() => handleCart('Sub', item)}>
                                                    -
                                                </div>
                                                <div className='cart_box_qtyb'>
                                                    <input
                                                        className='cart_box_qty_inp'
                                                        type='text'
                                                        placeholder='0'
                                                        value={item?.quantity}
                                                    />
                                                </div>
                                                <div className='cart_box_qty_btn' onClick={() => handleCart('Add', item)}>
                                                    +
                                                </div>
                                            </div>
                                            <div className='list_box_btn btn_lgt_red'
                                                onClick={() => handleRemoveCart(item)}>
                                                Remove
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )

                })}
                <div className='cart_box_sec'>
                    <div>
                        <div className='cart_box_icob'>
                            <img alt="icon"
                                className='cart_box_ico'
                                src={require("../assets/png/ecommerce.png")} />
                        </div>
                    </div>
                    <div className='cart_box_sub_sec'>
                        <div>
                            <div>
                                SubTotal (<span className='btxt sub_txt'>{count}</span> Items)
                            </div>
                        </div>
                        <div className="detail_separator">
                        </div>
                        <div className=''>
                            <span className='list_box_money'>
                                ₹{totalSubProducts}
                            </span>
                        </div>
                        <div className="detail_separator">
                        </div>
                        <div style={{
                            marginRight: 0
                        }} className='list_box_btn list_box_btn_primary'
                            onClick={() => navigate('/proceed-buy')}
                        >
                            Proceed to Buy
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}

export default CartItem 