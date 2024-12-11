import { Card, Col, Row } from "react-bootstrap";
import { FaBoxes, FaTruckLoading } from "react-icons/fa";
import { FaPlaneCircleCheck, FaTruckPlane } from "react-icons/fa6";

function CategoryCards(props) {
  let iconSize = 50;
  let cardsCategories = [
    {
      id: "0",
      key: "dark",
      bg: "dark",
      textColor: "white",
      title: "Received",
      text: props.data.reduce(
        (counter, obj) =>
          obj.status == "Received" || obj.status == "Received*"
            ? (counter += 1)
            : counter,
        0
      ),
      icon: <FaTruckLoading size={iconSize} />,
    },
    {
      id: "1",
      key: "primary",
      bg: "primary",
      textColor: "white",
      title: "Sampai Tujuan",
      text: props.data.reduce(
        (counter, obj) =>
          obj.status == "Sampai Tujuan" ? (counter += 1) : counter,
        0
      ),
      icon: <FaPlaneCircleCheck size={iconSize} />,
    },
    {
      id: "2",
      key: "warning",
      bg: "warning",
      textColor: "dark",
      title: "Dalam Perjalanan",
      text: props.data.reduce(
        (counter, obj) =>
          obj.status == "Dalam Perjalanan" ? (counter += 1) : counter,
        0
      ),
      icon: <FaTruckPlane size={iconSize} />,
    },
    {
      id: "3",
      key: "danger",
      bg: "danger",
      textColor: "white",
      title: "Menunggu Vendor",
      text: props.data.reduce(
        (counter, obj) =>
          obj.status == "Menunggu Vendor" ? (counter += 1) : counter,
        0
      ),
      icon: <FaBoxes size={iconSize} />,
    },
  ];

  return cardsCategories.map((category, idx) => (
    <Col key={idx} xs={props.windowSize.width >= 768 ? "" : "0"}>
      <Card
        bg={
          (props.state.filtered == true) &
          (props.state.currentFilter == category.title)
            ? "white"
            : category.bg
        }
        key={category.key}
        text={
          (props.state.filtered == true) &
          (props.state.currentFilter == category.title)
            ? category.bg
            : category.textColor
        }
        border={category.bg}
        className="mb-2 user-select-none"
        onClick={() => props.handler(category.title)}
      >
        <Card.Body>
          <Row>
            <Col xs={3} sm={3} lg={3}>
              {category.icon}
            </Col>
            <Col xs={9} sm={9} lg={9}>
              <Card.Title className="small">{category.title}</Card.Title>
              <Card.Text className="display-6">{category.text}</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  ));
}

export default CategoryCards;
