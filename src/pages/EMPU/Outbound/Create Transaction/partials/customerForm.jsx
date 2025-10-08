/* eslint-disable react/prop-types */
import CustomInput from "@/components/partials/customInput";
import { useState } from "react";

function CustomerForm({ customers, setSelectedCustomer, loading }) {
  const [query, setQuery] = useState("");
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSelectedCustomer("");
      setFilteredCustomer([]);
      return;
    }

    const matches = customers.filter((customer) =>
      customer.customerName.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredCustomer(matches);
  };

  const handleCustomerSelect = ({ e, customer }) => {
    e.preventDefault();
    setQuery(customer.customerName);
    setSelectedCustomer(customer.key);
    setFilteredCustomer([]);
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <CustomInput
        label="Customer"
        name="query"
        type="text"
        value={query}
        onChange={handleCustomerChange}
        disabled={loading}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
      />
      {isFocused && filteredCustomer.length > 0 && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderTop: "none",
            width: "100%",
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 10,
            borderRadius: "0 0 4px 4px",
          }}
        >
          {filteredCustomer.map((customer, index) => (
            <div
              key={index}
              style={{
                padding: "8px",
                cursor: "pointer",
              }}
              onMouseDown={(e) =>
                handleCustomerSelect({ e: e, customer: customer })
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }
            >
              {customer.customerName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerForm;
