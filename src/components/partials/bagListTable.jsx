/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function BagListTable(props) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
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
    setData(props.data);

    let processedData = [];
    data.map((row, idx) => {
      for (let i = 0; i < data[idx].bagList.length; i++) {
        if (data[idx].bagList[i].statusBag == "Unreceived") {
          const { bagList, ...rest } = row;
          processedData.push({
            noManifest: data[idx].bagList[i].manifestNo,
            koli:
              data[idx].bagList[i].koli == undefined
                ? "-"
                : parseFloat(data[idx].bagList[i].koli),
            pcs: parseFloat(data[idx].bagList[i].pcs),
            kg: parseFloat(data[idx].bagList[i].kg),
            remark: data[idx].bagList[i].remark,
            statusBag: data[idx].bagList[i].statusBag,
            ...rest,
          });
        }
      }
    });
    setBagList(processedData);
  }, [data, props.data]);

  return (
    <div>
      <Table responsive striped hover id="tableData">
        <thead id="stickyHead">
          <tr>
            <th>No. Manifest</th>
            <th>Origin</th>
            <th>Destination</th>
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
          {data.length == 0 ? (
            <>
              <tr>
                <td colSpan={10} align="center">
                  <i>Data tidak ditemukan</i>
                </td>
              </tr>
            </>
          ) : (
            <>
              {bagList
                .map((item, key) => (
                  <tr
                    key={key}
                    onClick={() =>
                      navToDetail(item.key, item.origin, item.destination)
                    }
                    className="position-relative user-select-none"
                  >
                    <td>{item.noManifest}</td>
                    <td>{item.origin}</td>
                    <td>{item.destination}</td>
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
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default BagListTable;
