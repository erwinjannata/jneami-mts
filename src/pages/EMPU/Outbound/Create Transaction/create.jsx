import CustomInput from "@/components/partials/customInput";
import CustomerForm from "./partials/customerForm";
import { useForm } from "@/hooks/useForm";
import { useEffect, useState } from "react";
import { Button, Container, InputGroup } from "react-bootstrap";
import { fetchCustomerData } from "../../partials/functions";

function EMPUOutboundAdd() {
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const { values, handleChange } = useForm({
    smu: "",
    weight: 10,
    koli: 1,
    keterangan: "",
    consignee: "",
    destination: "",
    flight: "",
  });

  useEffect(() => {
    fetchCustomerData({
      setLoading: setLoading,
      setCustomerList: setCustomerList,
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({ ...values, customer: selectedCustomer });
  };

  return (
    <Container>
      <h2 className="fw-bold">Outbound Transaction</h2>
      <hr />
      <div className="rounded border p-4">
        <form>
          <CustomInput
            type="text"
            name="smu"
            value={values.smu}
            label="SMU"
            onChange={handleChange}
            disabled={loading}
          />
          <InputGroup>
            <CustomInput
              name="koli"
              type="number"
              value={values.koli}
              label="Koli"
              onChange={handleChange}
              disabled={loading}
              min={1}
            />
            <CustomInput
              name="weight"
              type="number"
              value={values.weight}
              label="Weight"
              onChange={handleChange}
              disabled={loading}
              min={1}
            />
          </InputGroup>
          <CustomInput
            name="keterangan"
            type="text"
            label="Keterangan"
            as="textarea"
            style={{ height: "100px" }}
            value={values.keterangan}
            onChange={handleChange}
            disabled={loading}
          />
          <CustomerForm
            customers={customerList}
            setSelectedCustomer={setSelectedCustomer}
            loading={loading}
          />
          <Button variant="dark" onClick={(e) => handleSubmit(e)}>
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default EMPUOutboundAdd;
