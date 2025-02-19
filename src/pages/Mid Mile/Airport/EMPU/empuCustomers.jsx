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
import NavMenu from "../../../../components/partials/navbarMenu";
import EMPUAddCustomerModal from "./partials/empuAddCustomerModal";

const EMPUCustomersList = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);

  useEffect(() => {
    fetchCustomerData({
      setLoading: setLoading,
      setCustomerList: setCustomerList,
    });
  }, []);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>EMPU Customers</h2>
        <hr />
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-top`}>New Customer</Tooltip>}
        >
          <Button
            variant="outline-secondary"
            className="me-0"
            disabled={loading}
            onClick={() => setShowNewCustomerModal(true)}
          >
            <IoPersonAdd />
            {` New Customer`}
          </Button>
        </OverlayTrigger>
        <hr />
        <Table responsive hover striped id="tableData">
          <thead id="stickyHead">
            <tr>
              <th>Customer Name</th>
              <th>Customer Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customerList.map((customer, index) => (
              <tr key={index}>
                <td className="w-75">{customer.customerName}</td>
                <td className="w-75">{customer.customerType}</td>
                <td className="w-auto"></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <EMPUAddCustomerModal
        show={showNewCustomerModal}
        setShow={setShowNewCustomerModal}
      />
    </div>
  );
};

export default EMPUCustomersList;
