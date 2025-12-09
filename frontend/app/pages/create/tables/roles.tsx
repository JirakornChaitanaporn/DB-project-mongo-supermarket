import React, { useState } from "react";

import { domain_link } from "../../domain";

export function CreateRoles() {
  const [role_name, setRoleName] = useState("");
  const [role_description, setRoleDesc] = useState("");
  const [role_salary, setSalary] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      role_name: role_name,
      role_description: role_description,
      role_salary: Number(role_salary),
    };

    try {
      const response = await fetch("http://localhost:8002/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        alert("Role created successfully!");
        setRoleName("");
        setRoleDesc("");
        setSalary("");
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
    textarea: {
      width: "100%",
      padding: "12px",
      border: "2px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "#fff",
      color: "#333",
      resize: "vertical" as const,
      minHeight: "100px",
      fontFamily: "inherit",
      boxSizing: "border-box" as const,
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#2196F3",
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
      <h2 style={styles.title}>Create Role</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Role Name:</label>
          <input
            type="text"
            value={role_name}
            onChange={(e) => setRoleName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Role Description:</label>
          <textarea
            value={role_description}
            onChange={(e) => setRoleDesc(e.target.value)}
            style={styles.textarea}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Role Salary:</label>
          <input
            type="number"
            value={role_salary}
            onChange={(e) => setSalary(e.target.value)}
            style={styles.input}
            min="10000"
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Create Role
        </button>
      </form>
    </div>
  );
}
