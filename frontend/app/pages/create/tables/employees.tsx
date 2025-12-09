import React, { useState, useEffect } from "react";

import { domain_link } from "../../domain";

export function CreateEmployees() {
  const [first_name, setFName] = useState("");
  const [last_name, setLName] = useState("");
  const [phone_number, setPNum] = useState("");
  const [gender, setGender] = useState("");
  const [role_id, setRid] = useState("");
  const [role_name, setRoleName] = useState("");
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:8002/role");
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoleId = e.target.value;
    setRid(selectedRoleId);

    const selectedRole = roles.find((role) => role._id === selectedRoleId);
    if (selectedRole) {
      setRoleName(selectedRole.role_name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      firstname: first_name,
      lastname: last_name,
      phone_number: phone_number,
      gender: gender,
      created_at: new Date().toISOString(),
      role_id: role_id,
      role_name: role_name,
    };

    try {
      const response = await fetch("http://localhost:8002/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        alert("Employee created successfully!");
        setFName("");
        setLName("");
        setPNum("");
        setGender("");
        setRid("");
        setRoleName("");
      } else {
        const err = await response.json();
        alert("Error: " + (err.msg || err.message));
      }
    } catch (error) {
      alert("Failed to connect to server");
      console.error(error);
    }
  };

  const styles = {
    container: {
      maxWidth: "500px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "25px",
      color: "#333",
      textAlign: "center" as const,
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      color: "#555",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "2px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "#fff",
      color: "#333",
      boxSizing: "border-box" as const,
    },
    select: {
      width: "100%",
      padding: "12px",
      border: "2px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "#fff",
      color: "#333",
      cursor: "pointer",
      boxSizing: "border-box" as const,
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#FF9800",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Employee</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>First Name:</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Last Name:</label>
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number:</label>
          <input
            type="text"
            value={phone_number}
            onChange={(e) => setPNum(e.target.value)}
            style={styles.input}
            maxLength={10}
            minLength={10}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Role:</label>
          <select
            value={role_id}
            onChange={handleRoleChange}
            style={styles.select}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.role_name} - ${role.role_salary}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" style={styles.button}>
          Create Employee
        </button>
      </form>
    </div>
  );
}
