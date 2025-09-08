/* eslint-disable react/prop-types */
import LoadingAnimation from "../../../../components/partials/loading";
import NotFound from "../../../../components/partials/notFound";
import { Table } from "react-bootstrap";
import moment from "moment";

function MTSBagTable({ loading, awbList }) {
  return (
    <div>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div>
          {awbList.length == 0 ? (
            <NotFound />
          ) : (
            <div>
              <Table responsive hover id="tableData">
                <thead id="stickyHead">
                  <tr>
                    <th className="w-25">AWB</th>
                    <th className="w-25">Quantity</th>
                    <th className="w-50">MTS Date</th>
                    <th className="w-50">MTI Date</th>
                  </tr>
                </thead>
                <tbody>
                  {awbList.map((item, id) => {
                    return (
                      <tr key={id}>
                        <td>{item.awb}</td>
                        <td>{item.quantity}</td>
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
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MTSBagTable;
