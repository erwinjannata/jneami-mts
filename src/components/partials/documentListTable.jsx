/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "./../../index.css";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../../config/authContext";
import LoadingAnimation from "./loading";
import moment from "moment";
import "moment/dist/locale/id";
import NotFound from "./notFound";

function DocListTable({ data, loading }) {
  const navigate = useNavigate();
  const auth = UseAuth();

  const navToDetail = (key, origin, destination) => {
    if (auth.origin === "VENDOR") {
      navigate(`/v/d/${key}`);
    } else {
      if (auth.origin === origin) {
        navigate(`/or/d/${key}`);
      } else if (auth.origin === destination) {
        navigate(`/ds/d/${key}`);
      } else {
        navigate(`/d/${key}`);
      }
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div>
          {data.length == 0 ? (
            <NotFound />
          ) : (
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
                <tbody>
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
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DocListTable;
