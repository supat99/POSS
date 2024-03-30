const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const port = 8900;

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8100
  })
} 


//GET
app.post('/getCustomers', async (req, res) => {
  try {
   let param = []
   let sql = 'SELECT * FROM customers';
   console.log(req.body)
   if(req.body.id){
     sql += ' WHERE customerID = ?';
     param = [req.body.id]
   }
   const results = await getQueryResult(sql,param)
   res.json(results[0]);
  } catch (error) {
    res.status(500).json({error: "something went wrong"});
  }
});

app.post('/getProduct', async (req, res) => {
  try {
   let param = []
   let sql = 'SELECT * FROM products';
   if(req.body.id){
     sql += ' WHERE productID = ?';
     param = [req.body.id]
   }
   const results = await getQueryResult(sql,param)
   res.json(results[0]);
  } catch (error) {
    res.status(500).json({error: "something went wrong"});
  }
});

app.post('/getSales', async (req, res) => {
  try {
   let param = []
   let sql = 'SELECT * FROM sales s left join customers c on c.customerID = s.customerID ';
   if(req.body.id){
     sql += ' WHERE s.saleID = ?';
     param = [req.body.id]
   }
   const results = await getQueryResult(sql,param)
   res.json(results[0]);
  } catch (error) {
    res.status(500).json({error: "something went wrong",message:error.message});
  }
});

//POST

app.post('/addCustomers', async (req, res) => {
   try {
    let sql = 'INSERT INTO `customers`(`customerName`, `address`, `phoneNumber`) '+
    'VALUES (?,?,?)';
    let body = req.body;
    let param = [body.customerName,body.address,body.phoneNumber]
    const results = await getQueryResult(sql,param);
    res.json(results[0]);
   } catch (error) {
    console.warn(error)
     res.status(500).json({error: "something went wrong"});
    }
});

app.post('/addProduct', async (req, res) => {
  try {
   let sql = 'INSERT INTO `products`(`productName`, `price`, `quantityInStock`) '+
   'VALUES (?,?,?)';
   let body = req.body;
   let param = [body.productName,body.price,body.quantityInStock]
   const results = await getQueryResult(sql,param);
   res.json(results[0]);
  } catch (error) {
   console.warn(error)
    res.status(500).json({error: "something went wrong"});
   }
});

app.post('/addSales', async (req, res) => {
  try {
    let body = req.body;
    console.log('body.customerID',body.customerID)
   let sql = 'INSERT INTO `sales`(`saleDate`, `saleTime`, `productID`, `quantitySold`, `customerID`) ';
    if(!body.customerID && body.customerID == 'null'){
      sql += 'VALUES ((select CURRENT_DATE()),(select TIME(NOW())),?,?,null)';
   }else{
      sql += 'VALUES ((select CURRENT_DATE()),(select TIME(NOW())),?,?,?)';
   }
   let param = [body.productID,body.quantitySold,body.customerID] 
   const results = await getQueryResult(sql,param);
  //  let sql2 = 'UPDATE `products` SET `quantityInStock`=(select CAST((SELECT price from products WHERE productID = ?) as UNSIGNED) - ?) WHERE productID = ?';
   let sql2 = 'UPDATE `products` SET `quantityInStock` = (select x.aa from(SELECT CAST(p.quantityInStock as UNSIGNED) - ? as aa FROM `products` as p WHERE p.productID = ?) as x) WHERE productID = ?';
   let param2 = [Number(body.quantitySold),body.productID,body.productID]
   const results2 = await getQueryResult(sql2,param2);
   console.warn(results)
   console.warn(results2)
   res.json({status: "success"});
  } catch (error) {
   console.warn(error)
    res.status(500).json({error: "something went wrong"});
   }
});

//PUT

app.put('/updateCustomers/:customerID', async (req, res) => {
  try {
    let sql = 'UPDATE `customers` SET `customerName`=?, `address`=?, `phoneNumber`=? WHERE customerID = ?';
    let body = req.body;
    let id = req.params.customerID;
    const results = await getQueryResult(sql, [body.customerName, body.address, body.phoneNumber, id]);
    console.log(results)
    res.status(200).json({status: 'UPDATE success'});
  } catch (error) {
    console.warn(error)
    res.status(500).json({error: "something went wrong"});
  }
});

app.put('/updateProduct/:productID', async (req, res) => {
  try {
   let sql = 'UPDATE `products` SET `productName`=?,`price`=?,`quantityInStock`=? WHERE productID = ?';
   let body = req.body;
   let id = req.params.productID;
   const results = await getQueryResult(sql,[body.productName,body.price,body.quantityInStock,id]);
   console.log(results)
   res.status(200).json({status: 'UPDATE success'});
  } catch (error) {
   console.warn(error)
    res.status(500).json({error: "something went wrong"});
   }
});

app.put('/updateSales/:salesID', async (req, res) => {
  try {
   let sql = 'UPDATE `sales` SET `productID`=?,`quantitySold`=?,`customerID`=? WHERE saleID = ?';
   let body = req.body;
   let id = req.params.salesID;
   const results = await getQueryResult(sql,[body.productID,body.quantitySold,body.customerID,id]);
   console.log(results)
   res.status(200).json({status: 'UPDATE success'});
  } catch (error) {
   console.warn(error)
    res.status(500).json({error: "something went wrong"});
   }
});

//DELETE

app.delete('/deleteCustomers/:customerID', async (req, res) => {
   try {
    let sql = 'DELETE FROM `customers` WHERE customerID = ?';
    let id = req.params.customerID;
    const results = await getQueryResult(sql,id);
    console.log(results)
    res.status(200).json({status: 'DELETE success'});
   } catch (error) {
    console.warn(error)
     res.status(500).json({error: "something went wrong"});
    }
});

app.delete('/deleteProduct/:productID', async (req, res) => {
  try {
   let sql = 'DELETE FROM `products` WHERE productID = ?';
   let id = req.params.productID;
   const results = await getQueryResult(sql,id);
   console.log(results)
   res.status(200).json({status: 'DELETE success'});
  } catch (error) {
   console.warn(error)
    res.status(500).json({error: "something went wrong"});
   }
});

app.delete('/deleteSales/:saleID', async (req, res) => {
  try {
   let sql = 'DELETE FROM `sales` WHERE saleID = ?';
   let id = req.params.saleID;
   const results = await getQueryResult(sql,id);
   console.log(results)
   res.status(200).json({status: 'DELETE success'});
  } catch (error) {
   console.warn(error)
    res.status(500).json({error: "something went wrong"});
   }
});

async function getQueryResult(query, params){
  return await conn.query(query,params);
}

app.listen(port, async () => {
  await initMySQL()
});