import React from 'react'

import { SiTicktick } from "react-icons/si";
import { MdCancel } from "react-icons/md";

import './toast.css'

interface toastProps {
    name: string;
    description: string;
    type: string;
}

const page = (props : toastProps) => {
  return (
        <div className="ToastComponent">
            <div className="ToastComponent-in">
                <div className="toast-one">
                    {props.type === 'success' ? (
                        <SiTicktick className="icon-success" />
                    ) : (
                        <MdCancel className="icon-error" />
                    )}
                </div>
                <div className="toast-two">
                    <h1>{props.name}</h1>
                    <p>{props.description}</p>
                </div>
            </div>
        </div>
  )
}

export default page