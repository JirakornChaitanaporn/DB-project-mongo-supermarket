import React, { useState } from "react";

import { domain_link } from "../../domain"
 
export function CreateBillItems() {

    const [bill_id,     setBillId]      = useState("");
    const [product_id,  setProductId]   = useState("");
    const [quantity,    setQuantity]    = useState("");
    const [PAToS,       setPAToS]       = useState("");
        
    const bodyData = {
        bill_id:                bill_id,
        product_id:             product_id,
        quantity:               Number(quantity),
        price_at_time_of_sale:  Number(PAToS)
    };

    return (
        <></>
    )
}
