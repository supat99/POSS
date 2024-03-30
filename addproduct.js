const BASE_URL = 'http://localhost:8900';

let mode = "CREATE"
let selectedId =''

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log("id", id);
    
    if (id) {
        mode = "EDIT";
        selectedId = id;
        const userID = {"id":id}
        document.getElementById('headers').innerText = 'แก้ไขรายการสินค้า (Edit a list of customers)'
        console.log("userID",userID);

        try {
            const response = await axios.post(`${BASE_URL}/getProduct`,userID);
            const user = response.data[0];
            console.log("user", response.data);
            
            let productNameDOM = document.querySelector('input[name="productName"]');
            let priceDOM = document.querySelector('input[name="price"]');
            let quantityInStockDOM = document.querySelector('input[name="quantityInStock"]');

            productNameDOM.value = user.productName;
            priceDOM.value = user.price;
            quantityInStockDOM.value = user.quantityInStock;
            
        }catch(error){
            console.log('error',error)
        }
    }    
}

const submitData = async () => {
    let productNameDOM = document.querySelector('input[name="productName"]');
    let priceDOM = document.querySelector('input[name="price"]');
    let quantityInStockDOM = document.querySelector('input[name="quantityInStock"]');
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    try {
        console.log('TEST')
        const userData = {
            productName: productNameDOM.value,
            price: priceDOM.value,
            quantityInStock: quantityInStockDOM.value
        };
        
        console.log("SubmitData", userData);

        if (mode == "CREATE") {
            const response = await axios.post(`${BASE_URL}/addProduct`, userData);
            console.log("response", response.data);
            alert("บันทึกข้อมูลเรียบร้อยแล้ว");
        }
        else {
            const response = await axios.put(`${BASE_URL}/updateProduct/${selectedId}`, userData);
            alert("แก้ไขข้อมูลเรียบร้อยแล้ว");
            console.log("response", response.data);
        }
    
    }catch(error){
        console.log('error message',error.message)
        if(error.response){
            console.log(error.response.data.message)
            error.message=error.response.data.message

        }
    }
};
