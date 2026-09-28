"use client"
import React, { useState } from 'react'
import axios from 'axios'
import './contact.css'
import Loader from "@/app/components/loader/loader";
import ToastComponent from "@/app/components/toast/toast";

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

const Contact = () => {
    const [data, setData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<{ visible: boolean, name: string, description: string, type: string }>({
        visible: false,
        name: '',
        description: '',
        type: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

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
        if (!data.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(data.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        // Message validation
        if (!data.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0] as keyof FormData;
            showToast('Validation Error', newErrors[firstErrorKey] || 'Please fill all the required fields', 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/contact-mail', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Message sent successfully:', response.data);
            showToast('Success', 'Your message has been sent successfully!', 'success');
            
            // Reset form after successful submission
            setData({
                name: '',
                email: '',
                phone: '',
                message: ''
            });

        } catch (error) {
            console.error('Error sending message:', error);
            showToast('Error', 'There was an error sending your message. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="ContactComponent" id="contact">
      {toast.visible && (
        <ToastComponent
            name={toast.name}
            description={toast.description}
            type={toast.type}
        />
      )}
      {loading && <Loader />}
      <div className="ContactComponent-in">
        <div className="contact-one">
          <h1>Contact Us</h1>
        </div>
        <div className="contact-two">
          <div className="contact-two-heading">
            <h1>Drop a Message To Get</h1>
            <h1>In Touch With Us</h1>
          </div>
          <div className="contact-three">
            {/* Left Section */}
            <div className="contactCard">
              <div className="contactCard-in">
                <h2>Get in Touch</h2>
                <div className="contactCard-item">
                  <div className="icon">✉️</div>
                  <div className="details">
                    <span>Email:</span>
                    <a href="mailto:agrodronessales@gmail.com">agrodronessales@gmail.com</a>
                  </div>
                </div>
                
                <div className="contactCard-item">
                  <div className="icon">📞</div>
                  <div className="details">
                    <span>Phone:</span>
                    <a href="tel:+919347027509">+91 9347027509</a>
                  </div>
                </div>
                
                <div className="contactCard-item">
                  <div className="icon">📍</div>
                  <div className="details">
                    <span>Address:</span>
                    <p>
                      Galayagudem, Denduluru,<br />
                      Near Sai baba temple,<br />
                      West Godavari, Pin:- 534450,<br />
                      Andhra Pradesh, INDIA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contactForm">
              <div className="contactForm-in">
                  <div className="form-group">
                    <input 
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <input 
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <input 
                        type="tel"
                        placeholder="Enter your phone"
                        name="phone"
                        value={data.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'error' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                        placeholder="Enter your message"
                        name="message"
                        value={data.message}
                        onChange={handleChange}
                        className={errors.message ? 'error' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <button onClick={handleSubmit}>Send Message</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact