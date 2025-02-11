/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Button } from "react-bootstrap";
import {
  handleCancel,
  handleMissing,
  handleReceived,
  handleRemark,
  handleRemoveNewBag,
} from "./functions";
import { FaCheck, FaPen, FaTrashAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const TableButtons = ({
  data,
  bag,
  index,
  bagList,
  setBagList,
  oldBagList,
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
                  handleReceived({
                    index: index,
                    bagList: bagList,
                    setBagList: setBagList,
                  })
                }
              >
                <FaCheck />
              </Button>
              <Button
                variant="warning"
                className="mx-2"
                onClick={() =>
                  handleRemark({
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
                  handleMissing({
                    index: index,
                    bagList: bagList,
                    setBagList: setBagList,
                  })
                }
              >
                <FaXmark />
              </Button>
            </>
          ) : (
            <>
              {oldBagList[index].statusBag === "Submitted" ||
              oldBagList[index].statusBag === "Unreceived" ? (
                <Button
                  variant="danger"
                  className="mx-2"
                  onClick={() =>
                    handleCancel({
                      index: index,
                      bagList: bagList,
                      setBagList: setBagList,
                      oldBagList: oldBagList,
                    })
                  }
                >
                  Batal
                </Button>
              ) : null}
              {bag.key === undefined ? (
                <Button
                  variant="danger"
                  className="mx-2"
                  onClick={() =>
                    handleRemoveNewBag({
                      bagNo: bag.bagNumber,
                      setBagList: setBagList,
                    })
                  }
                >
                  <FaTrashAlt />
                </Button>
              ) : null}
            </>
          )}
        </td>
      )}
    </>
  );
};

export default TableButtons;
