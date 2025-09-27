/* eslint-disable react/prop-types */
import { Button, Table } from "react-bootstrap";
import { ImCross } from "react-icons/im";
import { removeBag } from "./functions";

const BagTable = ({ bagList, setBagList }) => {
  const header = [
    { name: "No.", className: "w-auto" },
    { name: "Bag No.", className: "w-50" },
    { name: "Koli", className: "w-auto" },
    { name: "Weight", className: "w-25" },
    { name: "SM#", className: "w-25" },
    { name: "", className: "w-auto" },
  ];

  return bagList.length === 0 ? null : (
    <div className="rounded border p-2">
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
            : bagList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.bagNumber}</td>
                  <td>{item.koli}</td>
                  <td>{item.weight} kg</td>
                  <td>{item.sm}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      onClick={() =>
                        removeBag({
                          bagNumber: item.bagNumber,
                          setBagList: setBagList,
                        })
                      }
                    >
                      <ImCross />
                    </Button>
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BagTable;
