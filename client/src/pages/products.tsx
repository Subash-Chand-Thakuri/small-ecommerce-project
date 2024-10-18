import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: number;
  name: string;
  price: number;
  weight: number;
}

interface Package {
  items: Product[];
  totalWeight: number;
  totalPrice: number;
  courierPrice: number;
}

const fetchProductLists = async (): Promise<Product[]> => {
  try {
    const res = await axiosInstance.get("/product");
    return res.data.products;
  } catch (error) {
    console.error("Error while fetching the product lists:", error);
    return [];
  }
};

const Products: React.FC = () => {

  const {
    data: productsList = [],
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProductLists,
  });

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  // Toggle product selection for placing an order
  const toggleProduct = (product: Product) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(product)
        ? prevSelected.filter((p) => p.id !== product.id)
        : [...prevSelected, product]
    );
  };

  // Place order handler: Sends selected products to the backend
  const placeOrder = async () => {
    console.log("Selected products:", selectedProducts);
    try {
      const response = await axiosInstance.post("/place-order", {
        products: selectedProducts,
      });

      const data = response.data;
      // console.log("packages:", data);
      setPackages(data.packages);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{(error as Error).message}</div>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {productsList.map((product) => (
          <li key={product.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedProducts.some((p) => p.id === product.id)}
                onChange={() => toggleProduct(product)}
              />
              {product.name} - ${product.price} - {product.weight}g
            </label>
          </li>
        ))}
      </ul>
      <button onClick={placeOrder}>Place order</button>

      {packages.length > 0 && (
        <div>
          <h2>Order Packages</h2>
          {packages.map((pkg, index) => (
            <div key={index}>
              <h3>Package {index + 1}</h3>
              <p> Items:{" "}
          {pkg.items.map((item: Product) => item.name).join(", ")}</p>
              <p>Total weight: {pkg.totalWeight}g</p>
              <p>Total price: ${pkg.totalPrice.toFixed(2)}</p>
              <p>Courier price: ${pkg.courierPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
