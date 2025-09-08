/* eslint-disable react/prop-types */
import { Table } from "react-bootstrap";
import LoadingAnimation from "../../../../components/partials/loading";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function MtsDocTable({ data, loading }) {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div>
          {data.length == 0 ? null : (
            <div>
              <Table responsive hover id="tableData">
                <thead id="stickyHead">
                  <tr>
                    <th className="w-25">No. MTS</th>
                    <th className="w-25">ORIGIN</th>
                    <th className="w-25">DESTINATION</th>
                    <th className="w-25">MTS</th>
                    <th className="w-50">MTI</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .map((item, id) => {
                      return (
                        <tr
                          key={id}
                          onClick={() => navigate(`/mts/d/${item.id}`)}
                        >
                          <td>{item.mtsNo}</td>
                          <td>{item.origin}</td>
                          <td>{item.destination}</td>
                          <td>
                            {moment(Date.parse(item.mtsDate))
                              .locale("en-sg")
                              .format("LLL")}
                          </td>
                          <td>
                            {item.mtiDate
                              ? `${moment(Date.parse(item.mtiDate))
                                  .locale("en-sg")
                                  .format("LLL")}`
                              : "-"}
                          </td>
                        </tr>
                      );
                    })
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
