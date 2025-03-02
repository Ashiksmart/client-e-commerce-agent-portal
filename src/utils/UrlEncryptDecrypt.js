import CryptoJS from 'crypto-js';

const Encode = (payload) => {
    if(payload !== "" &&payload !== undefined){
        
        const enbase64data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));
        console.log(enbase64data,"33333333333334444444444")
        return enbase64data
    }
    
};



const Decode = (payload) => {
    if(payload !== "" && payload !== undefined){
        let debase64data = CryptoJS.enc.Base64.parse(payload).toString(CryptoJS.enc.Utf8);
        debase64data =  JSON.parse(debase64data)
        return debase64data
    }
    
};

export { Encode, Decode };
