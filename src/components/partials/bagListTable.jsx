/* eslint-disable react/prop-types */
import moment from "moment";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function BagListTable({ bagList }) {
  const navigate = useNavigate();

  return bagList.length == 0 ? (
    <strong>
      <i>Data tidak ditemukan</i>
    </strong>
  ) : (
    <div className="rounded border p-2">
      <Table responsive striped hover id="tableData">
        <thead id="stickyHead">
          <tr>
            <th className="w-25">Manifest</th>
            <th className="w-auto">Koli</th>
            <th className="w-auto">Pcs</th>
            <th className="w-auto">Weight</th>
            <th className="w-auto">Status</th>
            <th className="w-50">MTS Date</th>
            <th className="w-50">Receiving Date</th>
          </tr>
        </thead>
        <tbody>
          {bagList
            .map((item, key) => (
              <tr
                key={key}
                onClick={() => navigate(`/d/${item.docId}`)}
                className="position-relative user-select-none"
              >
                <td>{item.manifestNo}</td>
                <td>{item.koli}</td>
                <td>{item.pcs}</td>
                <td>{`${item.weight} kg`}</td>
                <td>{item.status}</td>
                <td>{moment(item.mtsDate).locale("id").format("ll LT")}</td>
                <td>
                  {item.received === undefined ||
                  item.received === undefined ||
                  item.received === " "
                    ? "-"
                    : `${moment(item.received).locale("id").format("ll LT")}`}
                </td>
              </tr>
            ))
            .reverse()}
        </tbody>
      </Table>
    </div>
  );
}

export default BagListTable;
