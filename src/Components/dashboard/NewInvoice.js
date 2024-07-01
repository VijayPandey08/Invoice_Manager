import React, { useState } from "react";
import {db} from "../../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const NewInvoice = () => {
  const [to, setTo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] =useState(false);

  // const [products, setProducts] = useState([
  //   { id: 0, name: "laptop", price: 72000, quantity: 2 },
  //   { id: 1, name: "mouse", price: 2000, quantity: 1 },
  //   { id: 2, name: "keyboard", price: 3000, quantity: 1 },
  // ]);

  const [product, setProduct] = useState([]);

  const navigation = useNavigate()

  const addProduct = () => {
    setProduct([
      ...product,
      {
        id: product.length,
        name: name,
        price: price,
        quantity: quantity,
      },
    ]);
    const t =quantity*price
    setTotal(total + t)
    setName('')
    setPrice('')
    setQuantity(1)
  };

const saveData = async () => {
  setLoading(true)
  console.log(to,phone,email)
  console.log(product)
  console.log(total)
  const data = await addDoc(collection(db,"invoices"),{
    to: to,
    phone: phone,
    email: email,
    product: product,
    total: total,
    uid: localStorage.getItem('uid'),
    date: Timestamp.fromDate(new Date())
  })
  console.log(data)
  navigation('/dashboard/invoices')
  setLoading(false)
}

  return (
    <div>
          <div className="header_row">
          <h1 className="new_invoice_heading">New Invoice</h1>
          <button onClick={saveData} className="add-btn1" type="button">  {loading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>} Save Invoice </button>
          </div>
      <form className="new_invoive_form">
        <div className="first_row">
          <input
            onChange={(e) => {
              setTo(e.target.value);
            }}
            placeholder="To"
            value={to}
          ></input>

          <input
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            placeholder="Phone"
            value={phone}
          ></input>

          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            value={email}
          ></input>
        </div>

        <h1 className="new_invoice_heading1">Add Product Details</h1>



        <div className="first_row">
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Product Name"
            value={name}
          ></input>
          <input
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            placeholder="Price"
            value={price}
          ></input>
          <input
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
            type="number"
            placeholder="Quantity"
            value={quantity}
          ></input>
        </div>

        <button onClick={addProduct} className="add-btn" type="button">
          Add Product
        </button>

      </form>



      { product.length > 0 &&
        <div className="product_wrapper">
          <div className="product_list1">
            <p> S.No </p>
            <p> Product Name </p>
            <p> Price </p>
            <p> Quantity </p>
            <p> Total Price </p>
          </div>

          <hr></hr>

          {product.map((data, index) => (
            <div className="product_list" key={index}>
              <p> {index + 1} </p>
              <p> {data.name} </p>
              <p> {data.price} </p>
              <p> {data.quantity} </p>
              <p> {data.quantity * data.price} </p>
              <button onClick={()=>{
                setProduct(product.filter(item => item.id!== data.id))
                setTotal(total - (data.quantity * data.price))
              }} className="delete-btn" type="button">delete</button>
            </div>
          ))}
          <div className="total_wrapper">
            <p> Total Price : {total}</p>
            {/* <p> {product.reduce((a, b) => a + b.price * b.quantity, 0)} </p> */}
          </div>
        </div>
      }
    </div>
  );
};

export default NewInvoice;
