/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Table } from "react-bootstrap";
import { ImCross } from "react-icons/im";
import { removeBag } from "./functions";

const BagTable = ({ bagList, setBagList, loading }) => {
  const header = [
    { name: "No.", className: "w-auto" },
    { name: "Bag No.", className: "w-auto" },
    { name: "Koli", className: "w-auto" },
    { name: "Kg", className: "w-auto" },
    { name: "SM#", className: "w-auto" },
  ];

  return bagList.length === 0 ? null : (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      <Table responsive striped hover>
        <thead>
          <tr>
            {header.map((item, index) => (
              <th key={index} className={item.className}>
                {item.name}
              </th>
            ))}
            <th></th>
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
                  <td>{item.weight}</td>
                  <td>{item.sm}</td>
                  <td><Button variant='outline-danger' onClick={() => removeBag({bagNumber: item.bagNumber, setBagList: setBagList})}><ImCross /></Button></td>
                </tr>
              ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BagTable;
