/* eslint-disable react/prop-types */
import { Button, Table } from "react-bootstrap";
import { MdPersonAddAlt1 } from "react-icons/md";

const AWBTable = ({ awbList }) => {
  return (
    <Table responsive striped id="tableData">
      <thead id="stickyHead">
        <tr>
          <th className="w-auto">No.</th>
          <th className="w-25">AWB</th>
          <th className="w-auto">Pcs</th>
          <th className="w-auto">Weight</th>
          <th className="w-auto">Status</th>
          {/* <th className="w-auto">Amount</th> */}
          <th className="w-75">Customer</th>
        </tr>
      </thead>
      <tbody>
        {awbList.map((awb, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{awb["No AWB"]}</td>
            <td>{awb["Pieces"]}</td>
            <td>{awb["Chw"]}</td>
            <td>{awb["Status"].toUpperCase()}</td>
            {/* <td>{`Rp. ${Intl.NumberFormat().format(awb["Amount"])}`}</td> */}
            <td>
              <Button variant="outline-secondary">
                <MdPersonAddAlt1 />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AWBTable;
