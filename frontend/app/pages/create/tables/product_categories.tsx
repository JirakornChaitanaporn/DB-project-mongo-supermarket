import React, { useState } from "react";

import { domain_link } from "../../domain"
 
export function CreateProductCategories() {

    const [category_name,        setCategoryName] = useState("");
    const [category_description, setCategoryDesc] = useState("");
    
    const bodyData = {
        catagory_name:        category_name,
        category_description: category_description,
    };

    return (
        <></>
    )
}
