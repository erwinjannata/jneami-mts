/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import NavMenu from "../../../../components/partials/navbarMenu";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomerListModal from "./partials/customerListModal";
import EMPUAddCustomerModal from "./partials/empuAddCustomerModal";
import { fetchCustomerData, fetchTransactionData } from "./partials/functions";

const EMPUIndex = () => {
  const [state, setState] = useState({
    searched: "",
    filter: "",
    limit: 50,
  });
  const [data, setData] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [showData, setShowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerData({
      setLoading: setLoading,
      setCustomerList: setCustomerList,
    });
    fetchTransactionData({
      state: state,
      setData: setData,
      setShowData: setShowData,
      setLoading: setLoading,
    });
  }, []);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>EMPU</h2>
        <hr />
        <Button
          variant="outline-primary"
          className="me-2"
          onClick={() => navigate("add")}
        >
          Transaksi Baru
        </Button>
        <Button
          variant="outline-dark"
          className="me-2"
          onClick={() => setShowCustomerModal(true)}
        >
          Customer
        </Button>
        <Button
          variant="outline-secondary"
          className="me-0"
          onClick={() => setShowNewCustomerModal(true)}
        >
          Tambah Customer
        </Button>
        <hr />
        <EMPUAddCustomerModal
          show={showNewCustomerModal}
          setShow={setShowNewCustomerModal}
        />
        <CustomerListModal
          show={showCustomerModal}
          setShow={setShowCustomerModal}
          customerList={customerList}
          setShowNewCustomer={setShowCustomerModal}
        />
      </Container>
    </div>
  );
};

export default EMPUIndex;
