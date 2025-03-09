import serviceProxy from "../services/serviceProxy";

const getImagePath = (filePath) => {
  if (!filePath) {
    return require(`../assets/png/Noimage.png`);
  }
  const imageDomain = serviceProxy.localStorage.getItem("account_info").image_domain;
  return imageDomain + filePath.replace("/domains/plum-wasp-686705.hostingersite.com/public_html", "");
};

export const handleImages = (images = [], quantity = 0) => {
  if (images.length === 0) {
    return { imagepath: [require(`../assets/png/Noimage.png`)] };
  }

  if (quantity > 0) {
    const image = images[quantity - 1];
    return {
      imagepath: [getImagePath(image.file_path)],
    };
  }

  const imagePaths = images.map((image) => getImagePath(image.file_path));
  return { imagepath: imagePaths };
};
