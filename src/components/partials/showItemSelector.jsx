import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { handleChange } from "../functions/functions";
import PropTypes from "prop-types";

ShowItemSelector.propTypes = {
  loading: PropTypes.bool.isRequired,
  state: PropTypes.shape({
    limit: PropTypes.number.isRequired,
  }).isRequired,
  setState: PropTypes.func.isRequired,
};

export default function ShowItemSelector({ loading, state, setState }) {
  return (
    <div>
      <Row>
        <Col xl={2} xs={6}>
          <FloatingLabel controlId="floatingSelectShow" label="Show">
            <Form.Select
              aria-label="Show"
              name="limit"
              onChange={() =>
                handleChange({
                  e: event,
                  state: state,
                  stateSetter: setState,
                })
              }
              value={state.limit}
              disabled={loading}
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
      </Row>
    </div>
  );
}
