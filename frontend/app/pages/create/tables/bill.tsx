import React, { useState } from "react";

import { domain_link } from "../../domain"
 
export function CreateBill() {

    const [customer_id,  setCustomerId]  = useState("");
    const [employee_id,  setEmployeeId]  = useState("");
    const [total_amount, setTotal]       = useState("");
        
    const bodyData = {
        customer_id:       customer_id,
        employee_id:       employee_id,
        total_amount:      Number(total_amount),
        transaction_time:  new Date().toISOString(),
    };

    return (
        <></>
    )
}
