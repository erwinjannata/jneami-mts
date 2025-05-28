/* eslint-disable react/prop-types */

import { Button } from "react-bootstrap";
import { handleAction, handleEdit } from "./functions";
import { FaCheck, FaPen } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const TableButtons = ({
  data,
  bag,
  index,
  setShow,
  setCurrentFocus,
  setRemark,
}) => {
  return (
    <>
      {data.status === "Received" ? (
        <td></td>
      ) : (
        <td>
          {bag.statusBag === "Submitted" || bag.statusBag === "Unreceived" ? (
            <>
              <Button
                variant="outline-primary"
                className="mx-2"
                onClick={() =>
                  handleAction({
                    bag: bag,
                    doc: data,
                    statusBag: "Standby",
                  })
                }
              >
                <FaCheck />
              </Button>
              <Button
                variant="warning"
                className="mx-2"
                onClick={() =>
                  handleEdit({
                    index: index,
                    setShow: setShow,
                    setRemark: setRemark,
                    setCurrentFocus: setCurrentFocus,
                  })
                }
              >
                <FaPen />
              </Button>
              <Button
                variant="outline-dark"
                className="mx-2"
                onClick={() =>
                  handleAction({
                    bag: bag,
                    doc: data,
                    statusBag: "Missing",
                  })
                }
              >
                <FaXmark />
              </Button>
            </>
          ) : null}
        </td>
      )}
    </>
  );
};

export default TableButtons;
