/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Button,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
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
    isDG: false,
    isSurcharge: false,
    surchargeDay: 0,
    reqTS: false,
    customerId: "",
    customerType: "",
    paymentMethod: "",
    amount: 0,
    additionalCharge: 0,
  });
  const [customerName, setCustomerName] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);

  const checkLabels = [
    { name: "isSurcharge", label: "Penimbunan" },
    { name: "reqTS", label: "Antar ke alamat" },
    { name: "isDG", label: "Special Handling" },
  ];

  const calculations = {
    Agen: { tarif: 1600, admin: 4000, tax: 0.11 },
    Personal: { tarif: 2000, admin: 6000, tax: 0.0 },
  };

  const countAmount = () => {
    if (state.customerId !== "") {
      // Weight
      let chargedWeight = state.weight <= 10 ? 10 : state.weight;

      // Base Amount
      let baseAmount =
        chargedWeight * calculations[state.customerType].tarif +
        calculations[state.customerType].admin;
      baseAmount += baseAmount * calculations[state.customerType].tax;

      let tarifJaster = chargedWeight * 640;
      let tsAmount = state.reqTS ? 5000 : 0;
      let penimbunanAmount = 0;
      let specialAmount = 0;

      // Penimbunan Amount / Surcharge Amount
      if (state.isSurcharge) {
        penimbunanAmount = tarifJaster * (state.surchargeDay - 2) + 3000;
        penimbunanAmount += penimbunanAmount * 0.11;
      }

      // Dangerous Goods / Special Handling
      if (state.isDG) {
        specialAmount = tarifJaster + 3000;
        specialAmount += specialAmount * 0.11;
      }

      let additionalCharge = Math.ceil(
        penimbunanAmount + specialAmount + tsAmount
      );

      setState({
        ...state,
        amount: baseAmount,
        additionalCharge: additionalCharge,
        totalAmount: baseAmount + additionalCharge,
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
            label="Koli"
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
        <CustomInput
          name="surchargeDay"
          type="number"
          label="Penimbunan (Hari)"
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
        <InputGroup>
          <CustomInput
            name="amount"
            type="text"
            label="Amount"
            value={`Rp. ${Intl.NumberFormat().format(
              state.amount + state.additionalCharge
            )}`}
            readOnly
          />
          <FloatingLabel label="Payment Method">
            <Form.Select
              name="paymentMethod"
              onChange={() =>
                handleChange({
                  e: event,
                  state: state,
                  stateSetter: setState,
                })
              }
              value={state.paymentMethod}
              disabled={loading}
            >
              <option value="">- Pilih -</option>
              <option value="CASH">CASH</option>
              <option value="CREDIT">CREDIT</option>
            </Form.Select>
          </FloatingLabel>
        </InputGroup>

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
