/* eslint-disable react/prop-types */
import { Button, Table } from "react-bootstrap";
import { FaRegTrashAlt } from "react-icons/fa";
import { handleRemove } from "./functions";

const BagItemTable = ({ bagList, setBagList, loading }) => {
  const header = [
    { name: "No.", className: "w-auto" },
    { name: "Manifest No.", className: "w-25" },
    { name: "Koli", className: "w-auto" },
    { name: "Pcs", className: "w-auto" },
    { name: "Kg", className: "w-auto" },
    { name: "Status Bag", className: "w-25" },
    { name: "Remark", className: "w-25" },
    { name: "", className: "w-75" },
  ];

  return (
    <div>
      <Table responsive striped hover id="tableData">
        <thead id="stickyHead">
          <tr>
            {header.map((item, index) => (
              <th key={index} className={item.className}>
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bagList == undefined
            ? null
            : bagList
                .map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.manifestNo}</td>
                    <td>{item.koli}</td>
                    <td>{item.pcs}</td>
                    <td>{item.kg}</td>
                    <td>{item.statusBag}</td>
                    <td>{item.remark}</td>
                    <td>
                      <Button
                        variant="danger"
                        disabled={loading}
                        onClick={() =>
                          handleRemove({
                            index: index,
                            manifestNo: item.manifestNo,
                            setBagList: setBagList,
                          })
                        }
                      >
                        <FaRegTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))
                .reverse()}
        </tbody>
      </Table>
    </div>
  );
};

export default BagItemTable;
