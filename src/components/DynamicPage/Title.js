
const Title = (props) => {
  const { details } = props
  return (
    <div class="list_box_head">
      <div class="list_box_head_txt">{details.display_name}</div>
    </div>
  )
}




export default Title