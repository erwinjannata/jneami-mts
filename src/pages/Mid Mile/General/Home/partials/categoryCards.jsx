/* eslint-disable react/prop-types */
import { Card, Col, Placeholder, Row } from "react-bootstrap";
import { FaBoxes, FaTruckLoading } from "react-icons/fa";
import { FaTruckArrowRight } from "react-icons/fa6";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { MdOutlinePendingActions } from "react-icons/md";

const MidMileCategoryCards = ({
  data,
  state,
  windowSize,
  handler,
  loading,
  setState,
  setShowData,
}) => {
  const iconSize = 40;
  const categories = [
    {
      title: "Received",
      background: "dark",
      textColor: "white",
      text: data.reduce(
        (counter, obj) =>
          obj.status === "Received" || obj.status === "Received*"
            ? (counter += 1)
            : counter,
        0
      ),
      icon: <FaTruckLoading size={iconSize} />,
    },
    {
      title: "Ongoing",
      background: "danger",
      textColor: "white",
      text: data.reduce(
        (counter, obj) => (obj.status === "Ongoing" ? (counter += 1) : counter),
        0
      ),
      icon: <MdOutlinePendingActions size={iconSize} />,
    },
    {
      title: "Dalam Perjalanan",
      background: "primary",
      textColor: "white",
      text: data.reduce(
        (counter, obj) =>
          obj.status === "Dalam Perjalanan" ? (counter += 1) : counter,
        0
      ),
      icon: <FaTruckArrowRight size={iconSize} />,
    },
    {
      title: "Standby",
      background: "warning",
      textColor: "dark",
      text: data.reduce(
        (counter, obj) => (obj.status === "Standby" ? (counter += 1) : counter),
        0
      ),
      icon: <FaBoxes size={iconSize} />,
    },
    {
      title: "Submitted",
      background: "secondary",
      textColor: "light",
      text: data.reduce(
        (counter, obj) =>
          obj.status === "Submitted" ? (counter += 1) : counter,
        0
      ),
      icon: <HiClipboardDocumentCheck size={iconSize} />,
    },
  ];

  return (
    <Row>
      {categories.map((category, index) => (
        <Col key={index} xs={windowSize.width >= 768 ? "" : "0"}>
          <Card
            bg={
              (state.filtered === true) &
              (state.currentFilter === category.title)
                ? "white"
                : category.background
            }
            key={category.background}
            text={
              (state.filtered === true) &
              (state.currentFilter === category.title)
                ? category.background
                : category.textColor
            }
            border={category.background}
            className="mb-2 user-select-none"
            onClick={() =>
              handler({
                status: category.title,
                state: state,
                data: data,
                setState: setState,
                setShowList: setShowData,
              })
            }
          >
            <Card.Body>
              <Row>
                <Col xs={3} sm={3} lg={3}>
                  {category.icon}
                </Col>
                <Col xs={9} sm={9} lg={9}>
                  <Card.Title className="small">{category.title}</Card.Title>
                  {loading ? (
                    <Placeholder as={Card.Text} animation="glow">
                      <Placeholder xs={6} />
                    </Placeholder>
                  ) : (
                    <Card.Text className="display-6">{category.text}</Card.Text>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default MidMileCategoryCards;
