/* eslint-disable react/prop-types */
import moment from "moment";
import {
  Accordion,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { FaRoute, FaTruck } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { useEffect, useState } from "react";

function DocumentInfo({ data }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [isMobile]);

  const infos = [
    {
      title: "Document Info",
      icon: <IoDocumentText />,
      items: [
        { label: "No. Surat", value: data.noSurat, user: "No. Surat" },
        { label: "Status", value: data.status, user: "Status" },
      ],
    },
    {
      title: "Route",
      icon: <FaRoute />,
      items: [
        { label: "Origin", value: data.origin, user: data.approveUser },
        {
          label: "Destination",
          value: data.destination,
          user: data.receiveUser || "-",
        },
      ],
    },
    {
      title: "Approval",
      icon: <FaCheckCircle />,
      items: [
        {
          label: "Approved",
          user: data.approveUser,
          value: moment(data.approved).locale("id").format("ll LT"),
        },
        {
          label: "Received",
          user: data.receiveUser || "-",
          value:
            data.received === "" || data.received === undefined
              ? "-"
              : moment(data.received).locale("id").format("ll LT"),
        },
      ],
    },
    {
      title: "Transport",
      icon: <FaTruck />,
      items: [
        {
          label: "Driver",
          value: data.driver || "-",
          user: data.noPolisi || "-",
        },
        {
          label: "Departure",
          user: data.noRef || "-",
          value:
            data.departure === "" || data.departure === undefined
              ? "-"
              : moment(data.departure).locale("id").format("ll LT"),
        },
      ],
    },
  ];

  return isMobile ? (
    <Accordion defaultActiveKey="0">
      {infos.map((info, index) => {
        return (
          <Accordion.Item key={index} eventKey={String(index)}>
            <Accordion.Header>
              <Stack direction="horizontal" gap={2}>
                <span className="fw-bold">{info.icon}</span>
                <span className="fw-bold">{info.title}</span>
              </Stack>
            </Accordion.Header>
            <Accordion.Body>
              {info.items.map((item, index) => {
                return (
                  <Stack key={index} direction="vertical" gap={2}>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-${item.label}`}>
                          {item.user}
                        </Tooltip>
                      }
                    >
                      <div>
                        <p className="mb-0 text-muted">{item.label}</p>
                        <p className="fw-bold">{item.value}</p>
                      </div>
                    </OverlayTrigger>
                  </Stack>
                );
              })}
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  ) : (
    <Row>
      {infos.map((info, index) => {
        return (
          <Col md={3} className="mb-2" key={index}>
            <Card>
              <Card.Body>
                <Card.Title className="mb-3">
                  <Stack direction="horizontal" gap={2}>
                    <span>{info.icon}</span>
                    <span className="fw-bold">{info.title}</span>
                  </Stack>
                </Card.Title>
                {info.items.map((item) => {
                  return (
                    <Stack key={item.label} direction="vertical">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-${item.label}`}>
                            {item.user}
                          </Tooltip>
                        }
                      >
                        <div>
                          <p className="mb-0 text-muted">{item.label}</p>
                          <p className="fw-bold">{item.value}</p>
                        </div>
                      </OverlayTrigger>
                    </Stack>
                  );
                })}
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

export default DocumentInfo;
