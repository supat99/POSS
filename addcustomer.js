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
        document.getElementById('headers').innerText = 'แก้ไขรายชื่อลูกค้า (Edit a list of customers)'
        console.log("userID",userID);
       
        try {
            const response = await axios.post(`${BASE_URL}/getCustomers`,userID);
            const user = response.data[0];
            console.log("data", response.data);
            
            let customerNameDOM = document.querySelector('input[name="customerName"]');
            let addressDOM = document.querySelector('input[name="address"]');
            let phoneNumberDOM = document.querySelector('input[name="phoneNumber"]');

            customerNameDOM.value = user.customerName;
            addressDOM.value = user.address;
            phoneNumberDOM.value = user.phoneNumber;
            
        }catch(error){
            console.log('error',error)
        }
    }    
}

const submitData = async () => {
    
    let customerNameDOM = document.querySelector('input[name="customerName"]');
    let addressDOM = document.querySelector('input[name="address"]');
    let phoneNumberDOM = document.querySelector('input[name="phoneNumber"]');
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    try {
         if(customerNameDOM.value && addressDOM.value && phoneNumberDOM.value){

         
        console.log('TEST',mode);
        const userData = {
            customerName: customerNameDOM.value,
            address: addressDOM.value,
            phoneNumber: phoneNumberDOM.value
        };
        
        console.log("SubmitData", userData);     
        
        if (mode == "CREATE") {
            const response = await axios.post(`${BASE_URL}/addCustomers`, userData);
            alert("บันทึกข้อมูลเรียบร้อยแล้ว");
            console.log("response", response.data);
        }
        else{
            const response = await axios.put(`${BASE_URL}/updateCustomers/${selectedId}`, userData);
            alert("แก้ไขข้อมูลเรียบร้อยแล้ว");
            console.log("response", response.data);
        }
    }
    
    }catch(error){
        console.log('error message',error.message)
        if(error.response){
            console.log(error.response.data.message)
          error.message=error.response.data.message

        }
    }
};
