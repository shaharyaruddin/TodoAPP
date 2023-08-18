import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import FooterSec from './FooterSec';

const CartList = () => {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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
    const total = products.reduce((Total,product) => Total + product.ProductPrice * product.productQuantity, 0);
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
              <button className='btn btn-dark my-5'>
                Placed Order
              </button>
            </tfoot>
          </table>
        </div>
      </div>
      <FooterSec/>
    </>
  );
};


export default CartList;


