import React, { useState } from "react";

import { domain_link } from "../../domain"
 
export function CreatePromotions() {

    const [promo_name,       setPromoName]  = useState("");
    const [discount_percent, setDiscount]   = useState("");
    const [start_date,       setStart]      = useState("");
    const [end_date,         setEnd]        = useState("");
    const [product_id,       setPId]        = useState("");
        
    const bodyData = {
        promo_name:       promo_name,
        discount_percent: discount_percent,
        start_date:       start_date,
        end_date:         end_date,
        product_id:       product_id,
    };

    return (
        <></>
    )
}
