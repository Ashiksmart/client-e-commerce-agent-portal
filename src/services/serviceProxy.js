import ServiceProxy from 'b2b-service-proxy'
import Constants from '../constants'
import Interceptor from '../interceptors/interceptor'
let serviceProxy = new ServiceProxy(Constants, Interceptor)

export default serviceProxy
function setAccountinfo(){
    let account_data=serviceProxy.localStorage.getItem('account_info')
    if(account_data===null || account_data===undefined || account_data===""){
        Constants.ACCOUNT_ID=""
    }else{
        Constants.ACCOUNT_ID=account_data.account
    }
}

setAccountinfo()

export let serviceProxyUpdate =()=>{
    setAccountinfo()
    console.log("proxyupdate",Constants)
    serviceProxy = new ServiceProxy(Constants, Interceptor)
}