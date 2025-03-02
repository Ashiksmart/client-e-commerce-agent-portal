export const FormInp = (props) => {
    const {
        label,
        fldDataType
    } = props
    return (
        <div>
            <div className='fld_box'>
                <label className='fld_box_lbl'>
                    {label}
                </label>
                <div className='fld_box_fld'>
                    <input
                    onChange={(e)=>{console.log(e)}}
                        type={fldDataType === 'string' ? 'text' : 'password'}
                        className='fld_box_inp'
                    />
                </div>
                <div className='fld_box_msg cred'>
                    Error
                </div>
            </div>
        </div>
    )
}

const FormField = (props) => {
    const {
        type,
        label,
        fldDataType
    } = props

    switch (type) {
        case 'text':
            return (
                <>
                    <FormInp
                        label={label}
                        type={type}
                        fldDataType={fldDataType}
                    />
                </>
            )
        default:
            <>
            </>
    }
}


export default FormField