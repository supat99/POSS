const URL_BASE = "http://localhost:8900";

let customerData = []
let productData = []
let mode = "CREATE"
let selectedId = ''

window.onload = async () => {
    await loadCustomerData();
    await loadProductData();
    await setvalue();
    TotalPrice();
};

async function loadCustomerData() {
    try {
        const response = await axios.post(`${URL_BASE}/getCustomers`);
        console.log(response.data);
        customerData = response.data;
        generateSelectCustomer();
    } catch (error) {
        console.error(error);
    }
}

async function loadProductData() {
    try {
    const response = await axios.post(`${URL_BASE}/getProduct`);
    console.log(response.data);
    productData = response.data;
    generateSelectProduct()
    } catch (error) {
        console.error(error);
    }
}

function generateSelectCustomer(){
    let htmlStr = `<select class="sss" name="customer" id="customers">
    <option value="null">เลือกรายชื่อลูกค้า</option>
    `
    for (let i = 0; i < customerData.length; i++) {
        let customer = customerData[i];
        htmlStr += `<option value="${customer.customerID}">${customer.customerName}</option>`
    }
    htmlStr += `</select>`
    document.getElementById('customer').innerHTML = htmlStr;
}

function generateSelectProduct(){
    let htmlStr = `<select class="sss" name="product" id="products" onchange="TotalPrice()">
    <option value="null">เลือกสินค้า</option>`

    for (let i = 0; i < productData.length; i++) {
        let product = productData[i];
        htmlStr += `<option value="${product.productID}">${product.productName}</option>`
    }

    htmlStr += `</select>`
    document.getElementById('product').innerHTML = htmlStr;
}

async function TotalPrice() {
    console.log('quantity');
    let quantity = document.getElementById('quantity').value;
    let productsId = document.getElementById('products').value;
    let totalPriceDOM = document.getElementById('totalPrice');

    if(productsId != "null" && quantity){
        let x = await productData.filter(product => product.productID == productsId)[0].price
        let totalPrice = (quantity * x);
        totalPriceDOM.value = totalPrice == 0 ? '' : totalPrice;
    }
}

async function setvalue()  {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log("id", id);
    
    if (id) {
        mode = "EDIT";
        selectedId = id;
        const userID = {"id":id}
        document.getElementById('headers').innerText = 'แก้ไขประวัติการขาย (Edit a Sales Record)'
        console.log("userID",userID);
       
        try {
            const response = await axios.post(`${URL_BASE}/getSales`,userID);
            const user = response.data[0];
            console.log("data", response.data);
            
            let customerIDDOM = document.getElementById('customers');
            let productIDDOM = document.getElementById('products');
            let quantityInStockDOM = document.getElementById('quantity');

            customerIDDOM.value = user.customerID;
            productIDDOM.value = user.productID;
            quantityInStockDOM.value = user.quantitySold;
            
        }catch(error){
            console.log('error',error)
        }
    }    
}

const submitData = async () => {
    let customerIDDOM = document.getElementById('customers');
    let productIDDOM = document.getElementById('products');
    let quantityInStockDOM = document.getElementById('quantity');
    
    try{
    console.log("test",customerIDDOM)
    const orderData = {
        customerID: customerIDDOM.value,
        productID: productIDDOM.value,
        quantitySold: quantityInStockDOM.value,
    }

    console.log("SubmitData", orderData);

    if (mode == "CREATE") {
        const response = await axios.post(`${URL_BASE}/addSales`, orderData);
        console.log("response", response.data);
        alert("บันทึกข้อมูลเรียบร้อยแล้ว");
    }
    else if (mode == "EDIT"){
        const response = await axios.put(`${URL_BASE}/updateSales/${selectedId}`, orderData);
        console.log("response", response.data);
        alert("แก้ไขข้อมูลเรียบร้อยแล้ว");
    }

    console.log(orderData);

}   catch(error){
    console.error(error)
    if(error.response){
        console.log(error.response.data.message)
      error.message=error.response.data.message

}
}}