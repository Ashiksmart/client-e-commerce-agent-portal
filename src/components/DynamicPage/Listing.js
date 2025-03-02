import { OfferCoversPoster, AppLoader } from "../../components/CommonEssentials"
import { useEffect, useState } from "react";
import serviceProxy from "../../services/serviceProxy";
import { handleImages } from "../../constants/imagepath";
const Listing = (props) => {
  const { details } = props
  const bannerItems = JSON.parse(details).map((res, index) => {
    let image = ""
    if (res.image !== undefined && res.image.length > 0) {

      image = handleImages(res.image, 1).imagepath
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
  return (

    <div className="offers_cont" style={{ overflow: 'auto', padding: '10px' }}>
      <OfferCoversPoster offers={bannerItems} />
    </div>
  )
}




export default Listing