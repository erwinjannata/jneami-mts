import { Card, Col, Placeholder, Row } from "react-bootstrap";
import { FaBoxes, FaTruckLoading } from "react-icons/fa";
import { FaTruckPlane } from "react-icons/fa6";
import { handleFilter } from "@/pages/Last Mile/Home Page/functions";
import { GrDocumentMissing } from "react-icons/gr";

function CategoryCards({ documents, state, setState, setShowList, loading }) {
  let iconSize = 50;
  let cardsCategories = [
    {
      bg: "dark",
      textColor: "white",
      title: "Received",
      text: documents.reduce(
        (counter, obj) =>
          obj.status == "Received" || obj.status == "Received*"
            ? (counter += 1)
            : counter,
        0
      ),
      icon: <FaTruckLoading size={iconSize} />,
    },
    {
      bg: "primary",
      textColor: "white",
      title: "Dalam Perjalanan",
      text: documents.reduce(
        (counter, obj) =>
          obj.status == "Dalam Perjalanan" ? (counter += 1) : counter,
        0
      ),
      icon: <FaTruckPlane size={iconSize} />,
    },
    {
      bg: "warning",
      textColor: "dark",
      title: "Standby",
      text: documents.reduce(
        (counter, obj) => (obj.status == "Standby" ? (counter += 1) : counter),
        0
      ),
      icon: <FaBoxes size={iconSize} />,
    },
    {
      bg: "danger",
      textColor: "white",
      title: "Unreceived",
      text: documents.reduce(
        (counter, obj) =>
          obj.status == "Unreceived" ? (counter += 1) : counter,
        0
      ),
      icon: <GrDocumentMissing size={iconSize} />,
    },
  ];

  return cardsCategories.map((category, idx) => (
    <Col key={idx} sm>
      <Card
        key={idx}
        bg={
          (state.filtered == true) & (state.currentFilter == category.title)
            ? "white"
            : category.bg
        }
        text={
          (state.filtered == true) & (state.currentFilter == category.title)
            ? category.bg
            : category.textColor
        }
        border={category.bg}
        className="mb-2 user-select-none"
        onClick={() =>
          handleFilter({
            status: category.title,
            state: state,
            documentList: documents,
            setShowList: setShowList,
            setState: setState,
          })
        }
      >
        <Card.Body>
          <Row>
            <Col xs={3} sm={3} lg={3}>
              {category.icon}
            </Col>
            <Col xs={9} sm={9} lg={9}>
              <Card.Title className="fs-6 fw-bold">{category.title}</Card.Title>
              {loading ? (
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
              ) : (
                <Card.Text className="display-6 fw-bold">
                  {category.text}
                </Card.Text>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  ));
}

export default CategoryCards;
