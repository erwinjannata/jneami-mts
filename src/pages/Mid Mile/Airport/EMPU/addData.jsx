/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Button,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchCustomerData, submitInboundData } from "./partials/functions";
import { useNavigate } from "react-router-dom";
import { handleChange } from "../../../../components/functions/functions";
import NavMenu from "../../../../components/partials/navbarMenu";
import EMPUSelectCustomerModal from "./partials/selectCustomerModal";
import CustomInput from "../../../../components/partials/customInput";

const EMPUAddData = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    awb: "",
    pcs: 0,
    weight: 0,
    keterangan: "",
    amount: 0,
    isDG: false,
    isSurcharge: false,
    surchargeDay: 0,
    reqTS: false,
    customerId: "",
    customerType: "",
  });
  const [customerName, setCustomerName] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);

  const checkLabels = [
    { name: "isSurcharge", label: "Penumpukan" },
    { name: "reqTS", label: "Ambil di Mataram" },
    { name: "isDG", label: "Dangerous Goods" },
  ];

  const calculations = {
    Agen: { tarif: 1600, admin: 4000, tax: 0.11 },
    Personal: { tarif: 2000, admin: 6000, tax: 0.0 },
  };

  const countAmount = () => {
    if (state.customerId !== "") {
      let baseAmount =
        state.weight * calculations[state.customerType].tarif +
        calculations[state.customerType].admin;
      let tax = baseAmount * calculations[state.customerType].tax;
      let tsAmount = 0;
      let surchargeAmount = 0;
      let dgAmount = 0;

      // Request TS
      if (state.reqTS) {
        tsAmount = 5000 * state.pcs;
      }

      // Surcharge
      if (state.isSurcharge && state.surchargeDay >= 3) {
        let baseCharge = state.weight * calculations[state.customerType].tarif;
        let chargeTax = baseCharge * calculations[state.customerType].tax;
        surchargeAmount = baseCharge + chargeTax;
      }

      // Dangerous Goods
      if (state.isDG) {
        dgAmount = baseAmount;
      }

      let finalAmount =
        baseAmount + tax + tsAmount + surchargeAmount + dgAmount;

      setState({
        ...state,
        amount: finalAmount,
        customerId: state.customerId,
        customerType: state.customerType,
      });
    }
  };

  useEffect(() => {
    fetchCustomerData({
      setLoading: setLoading,
      setCustomerList: setCustomerList,
    });
    const getCustomerName = () => {
      if (state.customerId !== "") {
        let index = customerList.findIndex(
          (customer) => customer.key === state.customerId
        );
        setCustomerName(customerList[index].customerName);
      }
    };

    getCustomerName();
    countAmount();
  }, [
    state.customerId,
    state.customerType,
    state.weight,
    state.pcs,
    state.reqTS,
    state.isSurcharge,
    state.isDG,
    state.surchargeDay,
  ]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>EMPU</h2>
        <hr />
        <CustomInput
          name="awb"
          type="text"
          label="AWB"
          value={state.awb}
          onChange={() =>
            handleChange({ e: event, state: state, stateSetter: setState })
          }
          disabled={loading}
        />
        <InputGroup>
          <CustomInput
            name="pcs"
            type="number"
            value={state.pcs}
            label="Pieces"
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
            disabled={loading}
          />
          <CustomInput
            name="weight"
            type="number"
            value={state.weight}
            label="Weight"
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
            disabled={loading}
          />
        </InputGroup>
        <CustomInput
          name="keterangan"
          type=""
          label="Keterangan"
          as="textarea"
          style={{ height: "100px" }}
          value={state.keterangan}
          onChange={() => {
            handleChange({ e: event, state: state, stateSetter: setState });
          }}
          disabled={loading}
        />
        <CustomInput
          name="customerName"
          type="text"
          label="Customer Name"
          value={customerName}
          onClick={() => setShowSelectModal(true)}
          readOnly
        />
        <InputGroup>
          <CustomInput
            name="surchargeDay"
            type="number"
            label="Penumpukan (Hari)"
            value={state.surchargeDay}
            onChange={() =>
              handleChange({
                e: event,
                state: state,
                stateSetter: setState,
              })
            }
            disabled={!state.isSurcharge || loading}
          />
        </InputGroup>
        <CustomInput
          name="amount"
          type="text"
          label="Amount"
          value={`Rp. ${Intl.NumberFormat().format(state.amount)}`}
          readOnly
        />

        {checkLabels.map((check, index) => (
          <Form.Check
            key={index}
            name={check.name}
            type="checkbox"
            id={`default-checkbox${index}`}
            label={check.label}
            className="user-select-none"
            onClick={() =>
              setState({
                ...state,
                [check.name]: !state[check.name],
              })
            }
          />
        ))}
        <hr />
        <Button
          variant="outline-primary"
          onClick={() =>
            submitInboundData({
              state: state,
              setLoading: setLoading,
              doAfter: navigate,
            })
          }
        >
          Approve
        </Button>
      </Container>
      <EMPUSelectCustomerModal
        state={state}
        setState={setState}
        show={showSelectModal}
        setShow={setShowSelectModal}
        customerList={customerList}
      />
    </div>
  );
};

export default EMPUAddData;
