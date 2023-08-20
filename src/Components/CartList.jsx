import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import FooterSec from './FooterSec';
import axios from 'axios';
//import {useNavigate} from 'react-router-dom';



const CartList = () => {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
 // const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const getProductsFromLocalStorage = () => {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
  };

  useEffect(() => {
    const storedProducts = getProductsFromLocalStorage();
    setProducts(storedProducts);
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [products]);

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleIncreaseQuantity = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].productQuantity++;
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleDecreaseQuantity = (index) => {
    const updatedProducts = [...products];
    if (updatedProducts[index].productQuantity > 1) {
      updatedProducts[index].productQuantity--;
    } else {
      updatedProducts.splice(index, 1);
    }
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const addProductToCart = (product) => {
    const productIndex = products.findIndex((p) => p.id === product.id);
    if (productIndex === -1) {
      // Product not found in the cart, add it with a quantity of 1
      const updatedProducts = [...products, { ...product, productQuantity: 1 }];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } else {
      // Product found in the cart, increase its quantity
      handleIncreaseQuantity(productIndex);
    }
  };

  const calculateTotalPrice = () => {
    const total = products.reduce((Total, product) => Total + product.ProductPrice * product.productQuantity, 0);
    setTotalPrice(total);
  };

  // Group products by their ID to display as a single row in the table
  const groupedProducts = Object.values(
    products.reduce((acc, product) => {
      const { _id, price, title, thumbnail } = product;
      if (!acc[_id]) {
        acc[_id] = { ...product, productQuantity: 0 };
      }
      acc[_id].productQuantity += product.productQuantity;
      return acc;
    }, {})
  );

  const handlePlaceOrderClick = () => {
    setIsOrderConfirmed(false); // Reset order confirmation state
    setIsPlacingOrder(true);
  };


  const handleOrderConfirm = async (e) => {
    setIsPlacingOrder(false);
    setIsOrderConfirmed(true);
    e.preventDefault();

    if (customerName === '' || customerEmail === '' || customerId === '' || customerContact === '' || customerAddress === '') {
      alert('Please Fill All Fields');
    } else {
      try {
        const response = await axios.post("http://localhost:3500/api/place-order", {
          customerName,
          customerEmail,
          customerId,
          customerContact,
          customerAddress
        });
        console.log(response) // Handle successful login response ;    
       // navigate('/Categories') // Redirect to dashboard after successful login
      } catch (error) {
        alert('Please check your networks');
      }
    }
  };

  return (
    <>
      <Navigation />
      <div className="container mt-5">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Product Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {groupedProducts.map((product, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={product.ProductThumbnail}
                      alt={product.name}
                      style={{ width: '100px', height: '100px' }}
                      className="img-fluid"
                    />
                  </td>
                  <td className="text-capitalize">{product.ProductName}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => handleDecreaseQuantity(index)}
                      >
                        -
                      </button>
                      <span className="mx-2 font-weight-bold">
                        {product.productQuantity}
                      </span>
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => handleIncreaseQuantity(index)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="font-weight-bold">${product.ProductPrice}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm fw-bold"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-right font-weight-bold">
                  <strong>Total Price:</strong>
                </td>
                <td className="font-weight-bold text-success">
                  <strong>${totalPrice}</strong>
                </td>
              </tr>
            </tfoot>
          </table>

          <div>
            {!isOrderConfirmed ? (
              <div className="text-center my-4">
                {!isPlacingOrder ? (
                  <button
                    className="btn btn-primary"
                    onClick={handlePlaceOrderClick}
                  >
                    Place Order
                  </button>
                ) : (
                  <div d-flex align-items-center className="order-form">
                    <h2>Confirm Your Order</h2>
                    <p>Please fill Complete Information</p>
                    <div style={{
                      border: '1px solid #ccc',
                      padding: '20px',
                      borderRadius: '5px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      maxWidth: '400px',
                      margin: '0 auto',
                      backgroundColor: 'black',
                      color: 'white',
                    }}>
                      <form>
                        <div className="form-group my-3">
                          <label htmlFor="customerName">Customer Name:</label>
                          <input
                            type="text"
                            id="customerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                            }}
                          />
                        </div>

                        <div className="form-group my-3">
                          <label htmlFor="customerEmail">Customer Email:</label>
                          <input
                            type="email"
                            id="customerEmail"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                            }}
                          />
                        </div>

                        <div className="form-group my-3">
                          <label htmlFor="customerID">Customer ID:</label>
                          <input
                            type="text"
                            id="customerId"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                            }}
                          />
                        </div>

                        <div className="form-group my-3">
                          <label htmlFor="customerContact">Customer Contact:</label>
                          <input
                            type="tel"
                            id="customerContact"
                            value={customerContact}
                            onChange={(e) => setCustomerContact(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                            }}
                          />
                        </div>

                        <div className="form-group my-3">
                          <label htmlFor="customerAddress">Customer Address:</label>
                          <textarea
                            id="customerAddress"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleOrderConfirm}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            backgroundColor: 'green',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Confirm Order   
                        </button>
                      </form>
                    </div>
                  </div>
                )}
                         </div>
            ) : (
              <div className='my-5' style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'black',
                color: 'white',
                height: '5vh'

              }}>
                <h3>Your order has been confirmed Check your Email Thank you!</h3>
              </div>
              


            )}

          </div>

        </div>
      </div>
      <FooterSec />
    </>
  );
};



export default CartList;



