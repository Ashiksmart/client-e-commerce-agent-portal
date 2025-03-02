import '../styles/Listing.scss'
import Slider from "react-slick";
import { PrevArrow, NextArrow } from '../components/SliderEssentials'
import serviceProxy from "../services/serviceProxy";
import { useNavigate } from "react-router-dom";
import { handleImages } from "../constants/imagepath";
const Banner = (props) => {
    const navigate = useNavigate()
    const { details } = props
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };

    const bannerItems = JSON.parse(details).map((res, index) => {
        let image = ""
        if (res.image !== undefined && res.image.length > 0) {

            image = handleImages(res.image,1).imagepath
        } else {
            image = handleImages().imagepath
        }
        let obj = {
            all: res.apidata,
            id: index + 1,
            name: `bannerlist${index + 1}`,
            bannerName: image
        }
        return obj
    })


    return (

        <Slider {...settings}>
            {true && bannerItems.map((item) => {
                console.log(item, "itemitemitemitemitemitemitem")
                return (

                    <div className='list_box_banner' >
                        <img onClick={() => navigate(`/products`, { state: { query: item.all } })} className='list_box_banner_img' alt='banner1' src={item.bannerName} />
                    </div>
                )
            })}

        </Slider>
    )
}




export default Banner