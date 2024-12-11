/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "./../../index.css";
import moment from "moment";
import "moment/dist/locale/id";
import { useEffect, useState } from "react";
import { Placeholder, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../../config/authContext";

function DocListTable(props) {
  const navigate = useNavigate();
  const auth = UseAuth();
  const [datalist, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  const navToDetail = (key, origin, destination) => {
    navigate(`/vendor/doc/${key}`);
    // if (auth.origin == destination) {
    //   navigate(`/vendor/doc/${key}`);
    // } else {
    //   navigate("/find");
    // }
  };

  useEffect(() => {
    setDataList(props.data);
  }, [props.data]);

  return (
    <div>
      <Table responsive hover id="tableData">
        <thead id="stickyHead">
          <tr>
            <th>No. Surat</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Koli</th>
            <th>Weight</th>
            <th>Waktu Keberangkatan</th>
            <th>Waktu Kedatangan</th>
            <th>Durasi Perjalanan</th>
            <th>No. Polisi</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={10}>
                <Placeholder animation="wave">
                  <Placeholder xs={12} bg="secondary" size="lg" />
                </Placeholder>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {datalist.length == 0 ? (
              <>
                <tr>
                  <td colSpan={10} align="center">
                    <i>Data tidak ditemukan</i>
                  </td>
                </tr>
              </>
            ) : (
              <>
                {datalist
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
                        {item.bagList
                          .reduce((prev, next) => {
                            return prev + parseInt(next.koli);
                          }, 0)
                          .toString()}
                      </td>
                      <td>
                        {item.bagList.reduce((prev, next) => {
                          return prev + parseInt(next.kg);
                        }, 0) + " kg"}
                      </td>
                      <td>
                        {item.departureDate == ""
                          ? "-"
                          : `${moment(item.departureDate)
                              .locale("id")
                              .format("LL")} ${item.departureTime}`}
                      </td>
                      <td>
                        {item.arrivalDate != ""
                          ? `${moment(item.arrivalDate)
                              .locale("id")
                              .format("LL")} ${item.arrivalTime}`
                          : "-"}
                      </td>
                      <td>{item.durasi == undefined ? "-" : item.durasi}</td>
                      <td>{item.noPolisi}</td>
                    </tr>
                  ))
                  .reverse()}
              </>
            )}
          </tbody>
        )}
      </Table>
    </div>
  );
}

export default DocListTable;
