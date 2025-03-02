import serviceProxy from '../services/serviceProxy';

export const handleImages = (image=[],quantity=0) => {
    if(image.length>0){
      if(quantity >0){
        return {imagepath:[image[quantity-1].file_path===undefined?require(`../assets/png/Noimage.png`):serviceProxy.localStorage.getItem('account_info').image_domain + image[quantity-1].file_path.replace('/var/www/html', "")]}
      }else{
        let filepath=[]
        for (let i = 0; i < image.length; i++) {
          filepath.push(image[i].file_path===undefined?require(`../assets/png/Noimage.png`):serviceProxy.localStorage.getItem('account_info').image_domain +image[i].file_path.replace('/var/www/html', ""))
        }
        return {imagepath:filepath}
      }
  
    }else{
      return {imagepath:[require(`../assets/png/Noimage.png`)]}
    }
    
  };

