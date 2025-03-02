
const UnderConstruction = () => {
    return (
        <div style={{
            backgroundColor: '#fff5de',
            padding: '10px',
            color: '#581414'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <img
                    style={{
                        maxWidth: '60px',
                        height: '60px'
                    }}
                    alt='' src={require('../assets/png/under-construction-barrier-icon.png')} />
                <div style={{
                    textAlign: 'center'
                }}>
                    <img
                        className='construct_anim'
                        width={'50px'}
                        alt='' src={require('../assets/png/construction.png')} />
                    <div style={{
                        color: '#795503',
                        fontWeight: 700,
                        fontSize: '16px'
                    }}>
                        Website Under Construction
                    </div>
                </div>
                <img
                    style={{
                        maxWidth: '60px',
                        height: '60px'
                    }}
                    alt='' src={require('../assets/png/under-construction-barrier-icon.png')} />
            </div>
        </div>
    )
}

export default UnderConstruction