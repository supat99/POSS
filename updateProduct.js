const BASE_URL = 'http://localhost:8900';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('on load');
    try {
        const response = await axios.post(`${BASE_URL}/getProduct`);
        console.log(response.data);

        const userDOM = document.getElementById('user');
        let htmlteble = `<table class="table table-bordered">
        <thead class="thead-dark" >
          <tr>
            <th>รหัสสินค้า</th>
            <th>ชื่อสินค้า</th>
            <th>ราคา</th>
            <th>จำนวนคงเหลือ</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        `

        for (let i = 0; i < response.data.length; i++) {
            let user = response.data[i];
            htmlteble += `<tr>
            <tr>
                <td>${user.productID}</td>
                <td>${user.productName}</td>
                <td>${user.price}</td>
                <td>${user.quantityInStock}</td>  
                <td>
                    <a href="addproduct.html?id=${user.productID}&mode=EDIT"><button class="button">Edit</button></a>
                    <button class="button-delete" data-id="${user.productID}">Delete</button>
                </td>
            `;
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
                    await axios.delete(`${BASE_URL}/deleteProduct/${id}`);
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
