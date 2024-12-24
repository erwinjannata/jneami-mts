/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function BagListTable(props) {
  const navigate = useNavigate();
  const [bagList, setBagList] = useState([]);

  const navToDetail = (key, origin, destination) => {
    navigate(`/doc/${key}`);
    // if (auth.origin == destination) {
    //   navigate(`/vendor/doc/${key}`);
    // } else {
    //   navigate("/find");
    // }
  };

  useEffect(() => {
    setBagList(props.bagList);
  }, [props.bagList]);

  return bagList.length == 0 ? (
    <strong>
      <i>Data tidak ditemukan</i>
    </strong>
  ) : (
    <div>
      <Table responsive striped hover id="tableData">
        <thead id="stickyHead">
          <tr>
            <th>No. Manifest</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Status Bag</th>
            <th>Koli</th>
            <th>Pcs</th>
            <th>Weight</th>
            <th>Remarks</th>
            <th>No. Surat</th>
            <th>Received date</th>
            <th>Approved by</th>
            <th>Received by</th>
          </tr>
        </thead>
        <tbody>
          {bagList
            .map((item, key) => (
              <tr
                key={key}
                onClick={() =>
                  navToDetail(item.key, item.origin, item.destination)
                }
                className="position-relative user-select-none"
              >
                <td>{item.manifestNo}</td>
                <td>{item.origin}</td>
                <td>{item.destination}</td>
                <td>{item.statusBag}</td>
                <td>{item.koli}</td>
                <td>{item.pcs}</td>
                <td>{`${item.kg} kg`}</td>
                <td>{item.remark}</td>
                <td>{item.noSurat}</td>
                <td>{`${item.receivedDate} ${item.receivedTime}`}</td>
                <td>{item.preparedBy}</td>
                <td>{item.receivedBy}</td>
              </tr>
            ))
            .reverse()}
        </tbody>
      </Table>
    </div>
  );
}

export default BagListTable;
