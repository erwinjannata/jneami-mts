/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function PenarikanListTable(props) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

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
  }, [props.data]);

  return (
    <div>
      <Table responsive striped hover id="tableData">
        <thead id="stickyHead">
          <tr>
            <th>No. Surat</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Koli</th>
            <th>Weight</th>
            <th>Approved Date</th>
            <th>Departure Date</th>
            <th>Arrival Date</th>
            <th>Received Date</th>
            <th>Durasi Perjalanan</th>
            <th>Status Waktu</th>
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
              {data
                .map((item, key) => (
                  <tr
                    key={key}
                    onClick={() =>
                      navToDetail(item.key, item.origin, item.destination)
                    }
                    className="position-relative user-select-none"
                  >
                    <td>{item.noSurat}</td>
                    <td>{item.origin}</td>
                    <td>{item.destination}</td>
                    <td>{item.status}</td>
                    <td>
                      {item.bagList.reduce((prev, next) => {
                        return prev + parseInt(next.koli);
                      }, 0) + " koli"}
                    </td>
                    <td>
                      {item.bagList.reduce((prev, next) => {
                        return prev + parseInt(next.kg);
                      }, 0) + " kg"}
                    </td>
                    <td>{`${item.approvedDate} ${item.approvedTime}`}</td>
                    <td>
                      {item.departureDateDate == ""
                        ? "-"
                        : `${item.departureDate} ${item.departureTime}`}
                    </td>
                    <td>
                      {item.arrivalDate == ""
                        ? "-"
                        : `${item.arrivalDate} ${item.arrivalTime}`}
                    </td>
                    <td>
                      {item.receivedDate == ""
                        ? "-"
                        : `${item.receivedDate} ${item.receivedTime}`}
                    </td>
                    <td>{item.durasi}</td>
                    <td>{item.statusWaktu}</td>
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

export default PenarikanListTable;
