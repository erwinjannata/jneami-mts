/* eslint-disable react/prop-types */
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NotFound from "@/components/partials/notFound";

const BagTable = ({ bags }) => {
  const navigate = useNavigate();
  const tableHeader = [
    { name: "No. Manifest" },
    { name: "Koli" },
    { name: "Weight" },
    { name: "Status Bag" },
    { name: "Remark" },
    { name: "SM#" },
  ];

  return (
    <div>
      {bags.length === 0 ? (
        <NotFound />
      ) : (
        <div className="rounded border p-4">
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
                  onClick={() => navigate(`/mm/d/${bag.documentId}`)}
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
        </div>
      )}
    </div>
  );
};

export default BagTable;
