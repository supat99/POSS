const BASE_URL = 'http://localhost:8900';

window.onload = async () => {
    await loadData();
};

function formatDate(utcDateString) {
    if (!utcDateString) {
      console.error('Invalid or missing date string');
      return 'N/A'; 
    }
  
    const date = new Date(utcDateString);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`; 
  }

function formatTime(timeString) {
    let [hours, minutes, seconds] = timeString.split(':');
    let date = new Date(0, 0, 0, hours, minutes, seconds);
    date.setHours(date.getHours() + 7); // เพิ่ม 7 ชั่วโมง เพื่อแปลงให้เป็นเวลา GMT+7
    return date.toTimeString().slice(0, 8);
  }

const loadData = async () => {
    console.log('on load');
    try {
        const response = await axios.post(`${BASE_URL}/getSales`);
        console.log(response.data);

        const userDOM = document.getElementById('user');
        
        let htmlteble = `<table class="table table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>รหัสการขาย</th>
            <th>วันที่ขาย</th>
            <th>เวลาที่ขาย</th>
            <th>รหัสสินค้า</th>
            <th>จำนวนที่ขาย</th>
            <th>รหัสลูกค้า</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        `

        for (let i = 0; i < response.data.length; i++) {
                let user = response.data[i];
                let formattedDate = formatDate(user.saleDate);
                let formattedTime = formatTime(user.saleTime);
                htmlteble += `<tr>
                <tr>
                    <td>${user.saleID}</td>
                    <td>${formattedDate}</td>
                    <td>${formattedTime}</td>
                    <td>${user.productID}</td>
                    <td>${user.quantitySold}</td>
                    <td>${user.customerID}</td>
                    <td>
                        <a href="shop.html?id=${user.saleID}&mode=EDIT"><button class="button">Edit</button></a>
                        <button class="button-delete" data-id="${user.saleID}">Delete</button>
                    </td>
                </tr>`;
        }

        htmlteble += `</tbody>
        </table>`;

        console.log(htmlteble);
        userDOM.innerHTML = htmlteble;

        const deleteDOMs = document.getElementsByClassName('button-delete');
        for (let i = 0; i < deleteDOMs.length; i++) {
                deleteDOMs[i].addEventListener('click', async (event) => {
                        const id = event.target.dataset.id;
                        try {
                                await axios.delete(`${BASE_URL}/deleteSales/${id}`);
                    loadData();
                } catch (error) {
                    console.error(error);
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
};
