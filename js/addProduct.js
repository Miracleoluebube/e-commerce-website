let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');

// checknig user is logged in or not
window.onload = () => {
    if(user){
        if(!compareToken(user.authToken, user.email)){
          //  location.replace('/login');
        }
    }  else{
        location.replace('/login');
    } 
}

// price inputs

const actualPrice = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice = document.querySelector('#sell-price');

discountPercentage.addEventListener('input', () => {
    if(discountPercentage.value > 100){
        discountPercentage.value = 90;
    } else{
        let discount = actualPrice.value * discountPercentage.value / 100;
        sellingPrice.value = actualPrice.value - discount;
    }
})

sellingPrice.addEventListener('input', () => {
    let discount = (sellingPrice.value / actualPrice.value) * 100;
    discountPercentage.value = discount;
})
// upload image handle
// upload image handle
let uploadImages = document.querySelectorAll('.fileupload');
let imagePaths = []; // will store all uploaded images paths;