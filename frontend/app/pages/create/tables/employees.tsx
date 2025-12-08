import React, { useState } from "react";

import { domain_link } from "../../domain"
 
export function CreateEmployees() {

    const [first_name,   setFName]  = useState("");
    const [last_name,    setLName]  = useState("");
    const [phone_number, setPNum]   = useState("");
    const [gender,       setGender] = useState("");
    const [role_id,      setRid]    = useState("");
        
    const bodyData = {
        first_name:   first_name,
        last_name:    last_name,
        phone_number: phone_number,
        gender:       gender,
        created_at:   new Date().toISOString(),
        role_id:      role_id,
    };

    return (
        <></>
    )
}
