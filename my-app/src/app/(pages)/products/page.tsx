"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image' 
import Link from 'next/link'
import './page.css'

import { drones, spareParts } from '@/data/products'
import Footer from "@/app/components/footer/footer";

import Toast from "@/app/components/toast/toast";

interface Product {
    name: string;
    image: string;
    description: string;
    type: string;
}

const Page = () => {
    const [selectedType, setSelectedType] = useState("All");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    const [cart, setCart] = useState<Product[]>([]); // Default empty array
    const [showToast, setShowToast] = useState(false); // State for toast visibility
    const [toastProduct, setToastProduct] = useState<Product | null>(null); // State for the product added to cart

    useEffect(() => {
        if (typeof window !== "undefined") { 
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        }
    }, []);
    
    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart, product];
            if (typeof window !== "undefined") {  
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            }
            setToastProduct(product); // Set the product for the toast
            setShowToast(true); // Show the toast
            setTimeout(() => setShowToast(false), 3000); // Hide the toast after 3 seconds
            return updatedCart;
        });
    };

    const filteredProducts = [...drones, ...spareParts].filter((product) => {
        if (selectedType === "All") {
            return product.name.toLowerCase().includes(search.toLowerCase());
        } else {
            return product.name.toLowerCase().includes(search.toLowerCase()) && product.type === selectedType;
        }
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'search') {
            setSearch(value);
            setCurrentPage(1); 
        } else if (name === 'selectedType') {
            setSelectedType(value);
            setCurrentPage(1);  
        }
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="ProComponent">
            <div className="ProComponent-in">

                <div className="pro-one">
                    <div className="pro-one-in">
                        <div className="pro-one-in-one">
                            <Image 
                                src="/logos/AGRO.png"
                                alt="logo"
                                width={200}
                                height={200}
                            />
                        </div>
                        <div className="pro-one-in-two">
                            <Link href='/'>Back to Home</Link>
                            <Link href='/cart'>View Cart</Link>
                        </div>
                    </div>
                </div>

                <div className="pro-two">
                    <div className="pro-two-in">
                        <div className="pro-two-in-one">
                            <input 
                                type="text"
                                placeholder="Search for products"
                                className="pro-two-in-one-input"
                                name='search'   
                                value={search}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="pro-two-in-two">
                            <select 
                                name="selectedType" 
                                onChange={handleChange}
                                value={selectedType}
                                >
                                <option value="All">All</option>
                                <option value="Drones">Drones</option>
                                <option value="Spare Parts">Spare Parts</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pro-three">
                    <div className="pro-three-in">
                        {currentProducts.map((product) => (
                            <ProductCard key={product.name} product={product} onAddToCart={addToCart} />
                        ))}
                    </div>
                </div>
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                <Footer />

                {showToast && toastProduct && (
                    <Toast
                        name="Product Added"
                        description={`${toastProduct.name} has been added to your cart.`}
                        type="success"
                    />
                )}

            </div>
        </div>
    )
}

export default Page

 
const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: (product: Product) => void }) => {
    return (
        <div className="ProductCardComponent">
            <div className="ProductCardComponent-in">
                <div className="productCard-one">
                    <Image 
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={200}
                    />
                </div>
                <div className="product-two">
                    <div className="product-two-in">
                        <div className="product-two-in-one">
                            <h1>{product.name}</h1>
                            <p>{product.description}</p>
                        </div>
                        <div className="product-two-in-two">
                            <button
                                onClick={() => onAddToCart(product)}
                            >Add to Cart</button>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}