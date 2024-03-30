const BASE_URL = 'http://localhost:8900';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('on load');
    try {
        const response = await axios.post(`${BASE_URL}/getCustomers`);
        console.log(response.data);

        const userDOM = document.getElementById('user');       
        let htmlteble = `<table class="table table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>รหัสลูกค้า</th>
            <th>ชื่อลูกค้า</th>
            <th>ที่อยู่</th>
            <th>เบอร์โทรศัพท์</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        `

        for (let i = 0; i < response.data.length; i++) {
            let user = response.data[i];
            htmlteble += `<tr>
            <tr>
              <td>${user.customerID}</td>
              <td>${user.customerName}</td>
              <td>${user.address}</td>
              <td>${user.phoneNumber}</td>
              <td>
                <a href="addcustomers.html?id=${user.customerID}&mode=EDIT"><button class="button">Edit</button></a>
                <button class="button-delete" data-id="${user.customerID}">Delete</button>
              </td>
            </tr>
            `
        }

        htmlteble += `</tbody>
        </table>`
        console.log(htmlteble);
        userDOM.innerHTML = htmlteble;

        const deleteDOMs = document.getElementsByClassName('button-delete');
        for (let i = 0; i < deleteDOMs.length; i++) {
            deleteDOMs[i].addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                try {
                    await axios.delete(`${BASE_URL}/deleteCustomers/${id}`);
                    loadData();
                } catch (error) {
                    console.error(error);
                }
            });
        }
    }catch (error) {
        console.error(error);
    }
};
