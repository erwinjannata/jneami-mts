/* eslint-disable react/prop-types */
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NotFound from "../../../../../components/partials/notFound";
import { UseAuth } from "../../../../../config/authContext";

const BagTable = ({ bags }) => {
  const auth = UseAuth();
  const navigate = useNavigate();
  const tableHeader = [
    { name: "No. Manifest" },
    { name: "Koli" },
    { name: "Weight" },
    { name: "Status Bag" },
    { name: "Remark" },
    { name: "SM#" },
  ];

  const navigator = ({ docId }) => {
    if (auth.origin === "BANDARA") {
      navigate(`/mm/a/d/${docId}`);
    } else {
      navigate(`/mm/i/d/${docId}`);
    }
  };

  return (
    <div>
      {bags.length === 0 ? (
        <NotFound />
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              {tableHeader.map((header, index) => (
                <th key={index}>{header.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bags.map((bag, index) => (
              <tr
                key={index}
                onClick={() => navigator({ docId: bag.documentId })}
              >
                <td>{bag.bagNumber}</td>
                <td>{bag.koli}</td>
                <td>{`${bag.weight} kg`}</td>
                <td>{bag.statusBag}</td>
                <td>{bag.remark}</td>
                <td>{bag.sm}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default BagTable;
