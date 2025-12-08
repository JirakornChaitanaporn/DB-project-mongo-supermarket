import React, { useState } from "react";

import { domain_link } from "../../domain"
 
export function CreateSuppliers() {

    const [supplier_name,   setSupId]           = useState("");
    const [phone_number,     setPhoneNum]        = useState("");
    const [contact_person,  setContactPerson]   = useState("");
    const [address,         setAddress]         = useState("");
        
    const bodyData = {
        supplier_name:  supplier_name,
        phone_number:   phone_number,
        contact_person: contact_person,
        address:        address,
    };

    return (
        <></>
    )
}
