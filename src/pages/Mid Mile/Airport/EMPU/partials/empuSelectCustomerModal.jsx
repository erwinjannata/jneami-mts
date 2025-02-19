/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FloatingLabel, Form, Modal, Table } from "react-bootstrap";
import { useState } from "react";

const EMPUSelectCustomerModal = ({
  index,
  show,
  setShow,
  customerList,
  awbList,
  setAwbList,
}) => {
  const [state, setState] = useState({
    searched: "",
    suggestions: [],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setState({
      ...state,
      searched: value,
    });
    let searchResult = [];

    if (e.target.value !== "") {
      customerList.forEach((customer) => {
        if (customer.customerName.toLowerCase().includes(value.toLowerCase())) {
          searchResult.push(customer);
        }
      });
      setState({
        ...state,
        suggestions: searchResult,
      });
    } else {
      setState({
        ...state,
        suggestions: [],
      });
    }
  };

  const handleSelection = ({ selected }) => {
    let amt = 0;

    setAwbList(
      awbList.map((awb, idx) => {
        if (idx === index) {
          if (selected.customerType === "Agen") {
            amt = awb.weight * 1600 + 4000;
            amt = amt + amt * 0.11;
          } else {
            amt = awb.weight * 2000 + 6000;
          }

          return {
            ...awb,
            customerId: selected.key,
            customer: selected.customerName,
            customerType: selected.customerType,
            amount: amt,
          };
        } else {
          return awb;
        }
      })
    );
    setState({
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
        setState({
          ...state,
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
            {state.suggestions.map((selection, index) => (
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
