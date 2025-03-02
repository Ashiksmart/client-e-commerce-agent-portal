
export const NextArrow = (props) => {
    const { onClick } = props
    return (
        <div className='list_box_rarr' onClick={onClick}>
            <img className='list_box_arr_img' alt={'next-arrow'} src={require('../assets/png/right-arrow.png')} />
        </div>
    )
}
export const PrevArrow = (props) => {
    const { onClick } = props
    return (
        <div className='list_box_larr' onClick={onClick}>
            <img className='list_box_arr_img' alt={'prev-arrow'} src={require('../assets/png/left-arrow.png')} />
        </div>
    )
}