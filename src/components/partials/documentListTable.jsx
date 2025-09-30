/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import "./../../index.css";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "./loading";
import moment from "moment";
import "moment/dist/locale/id";
import NotFound from "./notFound";

function DocListTable({ data, loading }) {
  const navigate = useNavigate();

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
                    <th className="w-25">No. Surat</th>
                    <th className="w-auto">Origin</th>
                    <th className="w-auto">Destination</th>
                    <th className="w-25">Status</th>
                    <th className="w-auto">Koli</th>
                    <th className="w-auto">Weight</th>
                    <th className="w-25">Approved</th>
                    <th className="w-auto">No. Polisi</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => navigate(`/d/${item.key}`)}
                        className="position-relative user-select-none"
                      >
                        <td>{item.noSurat}</td>
                        <td>{item.origin}</td>
                        <td>{item.destination}</td>
                        <td>{item.status}</td>
                        <td>{item.totalPcs}</td>
                        <td>{item.totalWeight} kg</td>
                        <td>
                          {item.approved === ""
                            ? "-"
                            : `${moment(item.approved)
                                .locale("id")
                                .format("ll LT")}`}
                        </td>
                        <td>{item.noPolisi || "-"}</td>
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
