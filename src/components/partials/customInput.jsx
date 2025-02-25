/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";

const CustomInput = ({
  name,
  label,
  type,
  value,
  className,
  onChange,
  ...props
}) => {
  return (
    <Form.Floating className={`mb-3 ${className}`}>
      <Form.Control
        type={type}
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        {...props}
      />
      <label>{label}</label>
    </Form.Floating>
  );
};

export default CustomInput;
