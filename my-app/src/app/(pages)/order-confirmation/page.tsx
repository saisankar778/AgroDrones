"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import './page.css'

import Footer from "@/app/components/footer/footer";
import ToastComponent from "@/app/components/toast/toast";
import Loader from "@/app/components/loader/loader";


// Import the Product interface
interface Product {
    name: string;
    image: string;
    description: string;
    type: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface PageProps {
    cart: CartItem[];
}

interface FormData {
    name: string;
    phone: string;
    email: string;
    pincode: string;
    address: string;
    city: string;
    state: string;
}

const OrderConfirmationPage = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        email: '',
        pincode: '',
        address: '',
        city: '',
        state: ''
    });
    const router = useRouter();
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [toast, setToast] = useState<{ visible: boolean, name: string, description: string, type: string }>({
        visible: false,
        name: '',
        description: '',
        type: ''
    });
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const cartParam = searchParams.get('cart');
        
        if (cartParam) {
            setCart(JSON.parse(decodeURIComponent(cartParam)));
            console.log('Cart:', JSON.parse(decodeURIComponent(cartParam)));
        } else {
            router.push('/cart');
        }
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const showToast = (name: string, description: string, type: string) => {
        setToast({
            visible: true,
            name,
            description,
            type
        });

        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000); // Hide the toast after 3 seconds
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Phone validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Pincode validation
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(formData.pincode)) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        // City validation
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        // State validation
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0] as keyof FormData;
            showToast('Validation Error', newErrors[firstErrorKey] || 'Please fill all the required fields', 'error');
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                cart,
                customerDetails: formData
            };

            const response = await axios.post('/api/send-mail', orderData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Order placed successfully:', response.data);
            localStorage.removeItem('cart');
            router.push('/order-success'); 

        } catch (error) {
            console.error('Error placing order:', error);
            showToast('Order Error', 'There was an error placing your order. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="Order-ConfirmationComponent">
            {toast.visible && (
                <ToastComponent
                    name={toast.name}
                    description={toast.description}
                    type={toast.type}
                />
            )}
            {loading && <Loader />}
            <div className="Order-ConfirmationComponent-in">

                <div className="order-one">
                    <div className="order-one-in">
                        <div className="order-one-in-one">
                            <Image 
                                src="/logos/AGRO.png"
                                alt="logo"
                                width={200}
                                height={200}
                            />
                        </div>
                        <div className="order-one-in-two">
                            <Link href='/'>Back to Home</Link>
                            <Link href='/cart'>View Cart</Link>
                        </div>
                    </div>
                </div>

                <div className="order-two">
                    <div className="order-two-in">
                        <h1>Order Confirmation</h1> 
                        <p>Thank you for shopping with us. Please fill your address and contact details to place the order</p>
                        <div className="order-ad-one">
                                <input 
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    className={errors.name ? 'error' : ''}
                                />
                                <input 
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Phone Number"
                                    className={errors.phone ? 'error' : ''}
                                />
                        </div>
                        <div className="order-ad-two">
                                <input 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email Address"
                                    className={errors.email ? 'error' : ''}
                                />
                                <input 
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    placeholder="Pincode"
                                    className={errors.pincode ? 'error' : ''}
                                />
                        </div>
                        <div className="order-ad-three">
                                <textarea  
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Delivery Address"
                                    className={errors.address ? 'error' : ''}
                                />
                        </div>
                        <div className="order-ad-four">
                                <input 
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="City"
                                    className={errors.city ? 'error' : ''}
                                />
                                <input 
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="State"
                                    className={errors.state ? 'error' : ''}
                                />
                        </div>
                    </div>
                </div>

                <div className="order-three">
                    <button
                        onClick={handlePlaceOrder}
                    >Place Order</button>
                </div>

                <Footer />

            </div>
        </div>
    )
}

export default OrderConfirmationPage

