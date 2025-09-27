/* eslint-disable react/prop-types */
import moment from "moment";
import { useEffect, useState } from "react";
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
import { GrUpdate } from "react-icons/gr";
import { FaTruck, FaTruckRampBox } from "react-icons/fa6";

const MidMileDocInfo = ({ docData }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [isMobile]);

  const infos = [
    {
      title: "Latest Update",
      icon: <GrUpdate />,
      items: [
        { label: `Status: `, value: docData.status, overlay: "Latest Status" },
        {
          label:
            docData.status === "Received"
              ? `Received Date: `
              : `Latest Update: `,
          value: docData.latestUpdate
            ? moment(Date.parse(docData.latestUpdate))
                .locale("id")
                .format("ll LT")
            : "-",
          overlay: "Latest Update",
        },
      ],
    },
    {
      title: "Approval",
      icon: <FaCheckCircle />,
      items: [
        {
          label: `Petugas Bandara: `,
          value: docData.airportUser ? docData.airportUser : "-",
          overlay: docData.approvedDate
            ? moment(Date.parse(docData.approvedDate))
                .locale("id")
                .format("ll LT")
            : "Not Approved",
        },
        {
          label: `Checker Gudang: `,
          value: docData.gudangUser ? docData.gudangUser : "-",
          overlay: docData.approvedDate
            ? moment(Date.parse(docData.approvedDate))
                .locale("id")
                .format("ll LT")
            : "Not Approved",
        },
      ],
    },
    {
      title: "Transport",
      icon: <FaTruck />,
      items: [
        {
          label: `Driver: `,
          value: docData.driverName ? docData.driverName : "-",
          overlay: "Driver",
        },
        {
          label: `Date: `,
          value: docData.transportedDate
            ? moment(Date.parse(docData.transportedDate))
                .locale("id")
                .format("ll LT")
            : "-",
          overlay: "Transport Date",
        },
      ],
    },
    {
      title: "Receiving",
      icon: <FaTruckRampBox />,
      items: [
        {
          label: `User: `,
          value: docData.inboundUser ? docData.inboundUser : "-",
          overlay: "Petugas Inbound",
        },
        {
          label: `Date: `,
          value: docData.receivedDate
            ? moment(Date.parse(docData.receivedDate))
                .locale("id")
                .format("ll LT")
            : "-",
          overlay: "Received Date",
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
                          {item.overlay}
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
                            {item.overlay}
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
};

export default MidMileDocInfo;
