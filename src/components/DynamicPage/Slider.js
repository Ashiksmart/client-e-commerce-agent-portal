import Slider from "react-slick";
import serviceProxy from "../../services/serviceProxy";
import { PrevArrow, NextArrow } from "../../components/SliderEssentials";
import { useNavigate } from "react-router-dom";
import { handleImages } from "../../constants/imagepath";
const SliderView = (props) => {
  const { details } = props
  const navigate = useNavigate()
  const bannerItems = JSON.parse(details).map((res, index) => {
    let image = ""
        if (res.image !== undefined && res.image.length > 0) {
            image = handleImages(res.image,1).imagepath
        } else {
            image = handleImages().imagepath
        }
        if (res.apidata.details) {
          res.apidata.details = {
              ...res.apidata.details, ...{
                  "$.is_attributed": "Y"
              }
          }
      } else {
          res.apidata.details = {
              ...{
                  "$.is_attributed": "Y"
              }
          }
      }
        let obj = {
            all: res.apidata,
            id: index + 1,
            name: `bannerlist${index + 1}`,
            bannerName: image
        }
        return obj
  })

  var smBanners = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false
        }
      }
    ]
  };
  return (
    <>
      <div className="list_banner_box">
        <Slider {...smBanners} className="list_banner_slide">
          {bannerItems.map((Item) => {
            return (
              <div className="list_banner_cover">
                <img onClick={() => navigate(`/products`,{ state: { query:Item.all } })}
                  className="list_banner_coverimg"
                  src={Item.bannerName}
                  alt=""
                />
              </div>
            )
          })}
        </Slider>
      </div>
    </>

  )
}




export default SliderView