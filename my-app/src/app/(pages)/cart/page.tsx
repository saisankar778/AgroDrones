"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import './page.css'

import Footer from "@/app/components/footer/footer";


interface Product {
    name: string;
    image: string;
    description: string;
    type: string;
}

interface CartItem extends Product {
    quantity: number;
}

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                // Convert regular products to cart items with quantity
                const products: Product[] = JSON.parse(savedCart);
                const itemsWithQuantity = products.reduce((acc: CartItem[], product) => {
                    const existingItem = acc.find(item => item.name === product.name);
                    if (existingItem) {
                        existingItem.quantity += 1;
                        return acc;
                    }
                    return [...acc, { ...product, quantity: 1 }];
                }, []);
                setCartItems(itemsWithQuantity);
            }
        }
    }, []);

    const updateCart = (updatedItems: CartItem[]) => {
        // Convert cart items back to products for storage
        const productsForStorage = updatedItems.flatMap(item => 
            Array(item.quantity).fill({ ...item })
        );
        localStorage.setItem("cart", JSON.stringify(productsForStorage));
        setCartItems(updatedItems);
    };

    const increaseQuantity = (itemName: string) => {
        const updatedItems = cartItems.map(item =>
            item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(updatedItems);
    };

    const decreaseQuantity = (itemName: string) => {
        const updatedItems = cartItems.map(item =>
            item.name === itemName && item.quantity > 1 
                ? { ...item, quantity: item.quantity - 1 } 
                : item
        );
        updateCart(updatedItems);
    };

    const removeItem = (itemName: string) => {
        const updatedItems = cartItems.filter(item => item.name !== itemName);
        updateCart(updatedItems);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleOrder = () => {
        const encodedCart = encodeURIComponent(JSON.stringify(cartItems));
        router.push(`/order-confirmation?cart=${encodedCart}`);
    };

    return (
        <div className="CartComponent">
            <div className="CartComponent-in">
                <div className="cart-header">
                    <div className="cart-header-in">
                        <div className="cart-logo">
                            <Image 
                                src="/logos/AGRO.png"
                                alt="logo"
                                width={200}
                                height={200}
                            />
                        </div>
                        <div className="cart-nav">
                            <Link href='/'>Back to Home</Link>
                            <Link href='/products'>Continue Shopping</Link>
                        </div>
                    </div>
                </div>

                <div className="cart-content">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <h2>Your cart is empty</h2>
                            <Link href="/products">Start Shopping</Link>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div key={item.name} className="cart-item">
                                        <div className="item-image">
                                            <Image 
                                                src={item.image}
                                                alt={item.name}
                                                width={150}
                                                height={150}
                                            />
                                        </div>
                                        <div className="item-details">
                                            <h3>{item.name}</h3>
                                            <p>{item.description}</p>
                                            <div className="item-controls">
                                                <div className="quantity-controls">
                                                    <button onClick={() => decreaseQuantity(item.name)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => increaseQuantity(item.name)}>+</button>
                                                </div>
                                                <button 
                                                    className="remove-button"
                                                    onClick={() => removeItem(item.name)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-summary">
                                <div className="cart-summary-details">
                                    <p>Total Items: <span>{getTotalItems()}</span></p>
                                </div>
                                <button 
                                    className="place-order-button"
                                    onClick={handleOrder}
                                >
                                    Place Order
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default CartPage