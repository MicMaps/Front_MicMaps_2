//const CLOUD_NAME = 'da2ufs7rz' //test
//const UPLOAD_PRESET = 'qn01z5vh' //test
const CLOUD_NAME = 'df4u9snm7' //live
const UPLOAD_PRESET = 'micmaps' //live


export async function uploadImage(image) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: `{"file":"${image}","upload_preset":"${UPLOAD_PRESET}"}`
    }).then(response => {

      if(response.status === 200) {
        response.json().then(data => {
          resolve(data);
        }).catch(error => reject(error));
      }
    }).catch(error => {
      reject(error)
    });
  });
}

export function getResizedImageUrl(cloud, size) {

  let w = '';
  if(size === 'extra_small') w = 'w_80';
  else if(size === 'small') w = 'w_140';
  else if(size === 'normal') w = 'w_320';
  else if(size === 'large') w = 'w_600';
  else if(size === 'extra_large') w = 'w_1000';

  const {resource_type, type, version, public_id, format} = cloud;
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resource_type}/${type}/${w ? w+'/' : ''}v${version}/${public_id}.${format}`;
}

export function getOriginalSizeUri(imageUri) {

  let parts = imageUri.split("/");
  parts.splice(6,1);
  //console.log("Image parts", parts, parts.join("/"));
  return parts.join("/");
}
