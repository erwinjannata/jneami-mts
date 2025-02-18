/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { MdPersonAddAlt1 } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Button, Table } from "react-bootstrap";

const AWBTable = ({
  awbList,
  setAwbList,
  setShowSelectModal,
  setCurrentFocus,
}) => {
  const handleClear = ({ index }) => {
    setAwbList(
      awbList.map((awb, idx) => {
        if (idx === index) {
          return {
            ...awb,
            customer: "",
            customerId: "",
            customerName: "",
            amount: 0,
          };
        } else {
          return awb;
        }
      })
    );
  };

  return awbList.length === 0 ? null : (
    <Table responsive striped id="tableData">
      <thead id="stickyHead">
        <tr>
          <th className="w-auto">No.</th>
          <th className="w-25">AWB</th>
          <th className="w-auto">Pcs</th>
          <th className="w-auto">Weight</th>
          <th className="w-auto">Status</th>
          <th className="w-25">Amount</th>
          <th className="w-auto">Customer</th>
          <th className="w-75"></th>
        </tr>
      </thead>
      <tbody>
        {awbList.map((awb, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{awb.awb}</td>
            <td>{awb.pcs}</td>
            <td>{awb.weight}</td>
            <td>{awb.status.toUpperCase()}</td>
            <td>{`Rp. ${Intl.NumberFormat().format(awb.amount)}`}</td>
            <td>
              {awb.customer === "" ? (
                <Button
                  variant="outline-dark"
                  onClick={() => {
                    setShowSelectModal(true);
                    setCurrentFocus(index);
                  }}
                >
                  <MdPersonAddAlt1 />
                </Button>
              ) : (
                <div>
                  <p>{awb.customer}</p>
                </div>
              )}
            </td>
            <td>
              {awb.customer === "" ? null : (
                <Button
                  variant="danger"
                  onClick={() => handleClear({ index: index })}
                >
                  <RxCross2 />
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AWBTable;
