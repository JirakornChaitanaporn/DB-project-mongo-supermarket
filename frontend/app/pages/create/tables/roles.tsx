import React, { useState } from "react";

import { domain_link } from "../../domain"
 
export function CreateRoles() {

    const [role_name,        setRoleName]    = useState("");
    const [role_description, setRoleDesc]    = useState("");
    const [role_salary,      SetSalary]      = useState("");
            
    const bodyData = {
        role_name:        role_name,
        role_description: role_description,
        role_salary:      Number(role_salary),
    };

    return (
        <></>
    )
}
