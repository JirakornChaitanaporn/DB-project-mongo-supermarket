import React, { useState } from "react";

import { domain_link } from "../../domain"
 
export function CreateCustomers() {

    const [first_name,    setFName]  = useState("");
    const [last_name,     setLName]  = useState("");
    const [phone_number,  setPNum]   = useState("");
    const [loyalty_point, setLPoint] = useState("");
            
    const bodyData = {
        first_name:    first_name,
        last_name:     last_name,
        phone_number:  phone_number,
        loyalty_point: Number(loyalty_point),
        created_at:    new Date().toISOString(),
    };

    return (
        <></>
    )
}
