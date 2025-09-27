/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { fetchCustomerData } from "./partials/functions";
import {
  Button,
  Container,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { IoPersonAdd } from "react-icons/io5";
import NavMenu from "../../components/partials/navbarMenu";
import CustomInput from "../../components/partials/customInput";
import LoadingAnimation from "../../components/partials/loading";
import EMPUEditCustomerModal from "./partials/editCustomerModal";
import EMPUAddCustomerModal from "./partials/addCustomerModal";

const EMPUCustomersList = () => {
  const [state, setState] = useState({
    customerName: "",
  });
  const [customerList, setCustomerList] = useState([]);
  const [showCustomerList, setShowCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFocus, setCurrentFocus] = useState(null);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);

  const handleFind = (e) => {
    const value = e.target.value;
    let searchResult = [];

    setState({
      ...state,
      [e.target.name]: value,
    });

    if (e.target.value === "") {
      setShowCustomerList(customerList);
    } else {
      customerList.forEach((data) => {
        if (data.customerName.toLowerCase().includes(value.toLowerCase())) {
          searchResult.push(data);
        }
      });
      setShowCustomerList(searchResult);
    }
  };

  useEffect(() => {
    fetchCustomerData({
      setLoading: setLoading,
      setCustomerList: setCustomerList,
      setShowCustomerList: setShowCustomerList,
    });
  }, []);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2 className="fw-bold">EMPU Customers</h2>
        <hr />
        <div className="rounded border p-4">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-top`}>New Customer</Tooltip>}
          >
            <Button
              variant="outline-dark"
              className="me-0 mb-3"
              disabled={loading}
              onClick={() => setShowNewCustomerModal(true)}
            >
              <IoPersonAdd />
              {` New Customer`}
            </Button>
          </OverlayTrigger>
          <CustomInput
            name="customerName"
            label="Customer Name"
            value={state.customerName}
            type="text"
            onChange={() => handleFind(event)}
          />
          <hr />
          {loading ? (
            <LoadingAnimation />
          ) : (
            <div className="rounded border p-2">
              <Table responsive hover id="tableData">
                <thead id="stickyHead">
                  <tr>
                    <th>Customer Name</th>
                    <th>Customer Type</th>
                    <th>Customer Number</th>
                  </tr>
                </thead>
                <tbody>
                  {showCustomerList.map((customer, index) => (
                    <tr
                      key={index}
                      onClick={async (e) => {
                        e.preventDefault();
                        await setCurrentFocus(index);
                        setShowEditCustomerModal(true);
                      }}
                    >
                      <td className="w-50">{customer.customerName}</td>
                      <td className="w-50">{customer.customerType}</td>
                      <td className="w-75">{customer.customerNumber || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </Container>
      {currentFocus === null ? null : (
        <EMPUEditCustomerModal
          show={showEditCustomerModal}
          setShow={setShowEditCustomerModal}
          customer={showCustomerList[currentFocus]}
          loading={loading}
          setLoading={setLoading}
          setCurrentFocus={setCurrentFocus}
        />
      )}
      <EMPUAddCustomerModal
        show={showNewCustomerModal}
        setShow={setShowNewCustomerModal}
      />
    </div>
  );
};

export default EMPUCustomersList;
