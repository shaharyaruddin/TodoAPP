import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { Link } from "react-router-dom";
import Navigation from "../Components/Navigation";

function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:3500/api/get-product-by-category', {
        params: {
          ProductCategory: categoryName
        }
      })
      .then((response) => {
        const fetchedProducts = response.data.product;
        setProducts(fetchedProducts);
        // console.log(fetchedProducts);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);
  // Inline CSS for the CategoryPage
  const categoryTitleStyles = {
    color: "black",
    fontSize: "32px",
    fontWeight: "bold",
    margin: "20px 0",
  };

  const productCardStyles = {
    border: "1px solid #e4e4e4",
    borderRadius: "4px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const productImageStyles = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "4px",
  };

  const productTitleStyles = {
    color: "#333",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  const productPriceStyles = {
    color: "#D32F2F",
    fontSize: "20px",
    fontWeight: "bold",
  };

  return (
    <>
      <Navigation />

      <div className="container">
        <div className="my-5 text-center">
          <h1 style={categoryTitleStyles}>{categoryName?.toUpperCase()}</h1>
        </div>
        <div className="row">
          {products?.map((val, key) => (
            <div className="my-4 col-md-4" key={key} style={productCardStyles}>
              <Link className="text-decoration-none" to={`/products/${val?.ProductId}`}>
                <img src={val.ProductThumbnail} alt={val.title} style={productImageStyles} />
                <div>
                  <p style={productTitleStyles}>{val.ProductName}</p>
                  <p style={productPriceStyles}>${val.ProductPrice}</p>
                </div>
                <Button variant="dark">Add to Cart</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CategoryPage;
