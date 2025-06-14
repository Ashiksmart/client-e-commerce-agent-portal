import { useState } from "react";
import "../styles/Listing.scss";
import { handleImages } from "../constants/imagepath";
import serviceProxy from "../services/serviceProxy";
import { jwtDecode } from 'jwt-decode'
export const SubCategoryList = (props) => {
  const { services, selectedCategory, setSelectedCategory } = props;
  const Images = (image) => {
    if (image === "null" || image === "" || image === undefined || image === null) {
      return handleImages().imagepath
    } else {
      let imagepath = JSON.parse(image)
      return handleImages(imagepath.icon, 1).imagepath
    }

  }
  return (
    <>
      <div className="sec">
        <div className="list_box_head">
          <div className="list_box_head_txt">
            <span className="detail_btxt sl_hide">Category</span>
            {selectedCategory?.name && (<> <span className="list_lg_rgtarr"></span>
              <span style={{ cursor: 'pointer' }}
                onClick={() => props.onTriggerCategory()}>{services.category_name}</span> </>)}
          </div>
        </div>
        <div className="list_lg_sub_cont">
          {(services).map((item) => {
            return (
              <div className="list_lg_sub_box" key={item?.id} onClick={() => props.onEmitData(item)}>
                <div className="list_lg_sub_icob">
                  <img
                    className="list_lg_sub_ico"
                    src={Images(item.details
                    )
                    }
                    alt=""
                  />
                  <img
                    className="list_lg_sub_icobg"
                    src={Images(item.details
                    )
                    }
                    alt=""
                  />
                </div>
                <div className="list_lg_lbl">{item?.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const CategoryListing = (props) => {
  const { services, navigation, alldata } = props;
  console.log('services ==> ', services)
  const Images = (image) => {
    if (image === "null" || image === "" || image === undefined || image === null) {
      return handleImages().imagepath
    } else {
      console.log(image, "imageimageimageimage")
      let imagepath = image
      return handleImages(imagepath.icon, 1).imagepath
    }

  }
  const accountId = () => {
    const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')
    return isLoggedIn ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id : serviceProxy.localStorage.getItem('account_info').account
  }
  const handleClick = (data, services, navigation) => {
    let item = {
      sub_category_id: { "$eq": data.id },
      is_active: { "$eq": "Y" },
      account_id: { "$eq": accountId() },
      details: {
        "$.is_attributed": "Y",
        "$.city": serviceProxy.localStorage.getItem("cityCode"),
        "$.tags": serviceProxy.localStorage.getItem("searchQuery")
      }
    }
    console.log(item);
    navigation(`/products`, { state: { query: item } })
  }
  const ViewallClick = (navigation) => {
    navigation(`/allcategory`, { state: { query: alldata } })
  }

  return (
    <div className="list_lg_box">
      <>
        {services.map((item) => {
          return (
            <div
              key={item.id}
              className="bar_head_box"
              onClick={() => handleClick(item, services, navigation)}
            >
              <div className="list_lg">
                <div className="list_lg_imgb">
                  <img
                    src={Images(item.details
                    )
                    }
                    alt=""
                    className="list_lg_img"
                  />
                </div>
                <div className="list_lg_lbl">{item.name.toUpperCase()}</div>
                {/* <div className="list_lg_arr"></div> */}
              </div>
            </div>
          );
        })}

      </>
      <div
        className="btn btn_primary"
        onClick={() => { ViewallClick(navigation) }}>
        View more
      </div>
    </div>
  );
};

export default CategoryListing;
