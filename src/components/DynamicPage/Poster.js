
import serviceProxy from "../../services/serviceProxy";
import { useNavigate } from "react-router-dom";
import { handleImages } from "../../constants/imagepath";
const Poster = (props) => {
    const { details } = props
    const navigate = useNavigate()
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
        <>
            {bannerItems.map((Item) => {
                return (
                    <div onClick={() => navigate(`/products`, { state: { query: Item.all } })} className="list_banner_container list_banner_full">
                        <div style={{ overflow: 'auto', padding: '10px' }}>
                            <div className="list_banner_cover">
                                <img
                                    className="list_banner_coverimg"
                                    src={Item.bannerName}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
        </>

    )
}




export default Poster