import { OfferCovers, AppLoader } from "../CommonEssentials"
import { useEffect, useState } from "react";
import serviceProxy from "../../services/serviceProxy";
import { handleImages } from "../../constants/imagepath";
const ProductListing = (props) => {
  const { details } = props
  const bannerItems = JSON.parse(details).map((res, index) => {
    let image = ""
        if (res.image !== undefined && res.image.length > 0) {

            image =handleImages(res.image,1).imagepath
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

    <div style={{ overflow: 'auto', padding: '10px' }}>
      <OfferCovers offers={bannerItems} />
    </div>
  )
}




export default ProductListing