/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FloatingLabel, Form, Modal, Table } from "react-bootstrap";
import { useState } from "react";

const EMPUSelectCustomerModal = ({
  state,
  setState,
  show,
  setShow,
  customerList,
}) => {
  const [suggestion, setSuggestion] = useState({
    searched: "",
    suggestions: [],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSuggestion({
      ...suggestion,
      searched: value,
    });
    let searchResult = [];

    if (e.target.value !== "") {
      customerList.forEach((customer) => {
        if (customer.customerName.toLowerCase().includes(value.toLowerCase())) {
          searchResult.push(customer);
        }
      });
      setSuggestion({
        ...suggestion,
        suggestions: searchResult,
      });
    } else {
      setSuggestion({
        ...suggestion,
        suggestions: [],
      });
    }
  };

  const handleSelection = ({ selected }) => {
    setState({
      ...state,
      customerId: selected.key,
      customerType: selected.customerType,
    });
    setSuggestion({
      searched: "",
      suggestions: [],
    });
    setShow(false);
  };

  return (
    <Modal
      centered
      scrollable
      backdrop="static"
      show={show}
      onHide={() => {
        setSuggestion({
          ...suggestion,
          searched: "",
          suggestions: [],
        });
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Customer EMPU
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FloatingLabel
          controlId="floatingInput"
          label="Nama Customer"
          className="mb-3"
        >
          <Form.Control
            name="searched"
            placeholder="Nama Customer"
            type="text"
            onChange={() => handleSearch(event)}
            autoFocus
          />
        </FloatingLabel>
        <hr />
        <Table responsive hover>
          <tbody>
            {suggestion.suggestions.map((selection, index) => (
              <tr
                key={index}
                onClick={() => {
                  handleSelection({ selected: selection });
                }}
              >
                <td>{selection.customerName}</td>
                <td>{selection.customerType}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default EMPUSelectCustomerModal;
