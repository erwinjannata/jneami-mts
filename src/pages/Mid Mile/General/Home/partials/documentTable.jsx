import moment from "moment";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NotFound from "../../../../../components/partials/notFound";
import LoadingAnimation from "./../../../../../components/partials/loading";
import { UseAuth } from "../../../../../config/authContext";

/* eslint-disable react/prop-types */
const DocumentTable = ({ documents, loading }) => {
  const auth = UseAuth();
  const navigate = useNavigate();
  const tableHeader = [
    { name: "Document No." },
    { name: "Pcs" },
    { name: "Weight" },
    { name: "Status" },
    { name: "Submit Date" },
    { name: "Transport Date" },
    { name: "Receiving Date" },
  ];

  const routing = (key) => {
    if (auth.origin === "BANDARA") {
      navigate(`/mm/a/d/${key}`);
    } else {
      navigate(`/mm/i/d/${key}`);
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div>
          {documents.length === 0 ? (
            <NotFound />
          ) : (
            <Table responsive hover>
              <thead id="stickyHead">
                <tr>
                  {tableHeader.map((header, index) => (
                    <th key={index}>{header.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents
                  .map((document, index) => {
                    return (
                      <tr key={index} onClick={() => routing(document.key)}>
                        <td>{document.documentNumber}</td>
                        <td>{`${document.totalPcs}`}</td>
                        <td>{`${document.totalWeight} kg`}</td>
                        <td>{document.status}</td>
                        <td>
                          {moment(Date.parse(document.submittedDate))
                            .locale("en-sg")
                            .format("LLL")}
                        </td>
                        <td>
                          {document.transportedDate === undefined
                            ? "-"
                            : moment(Date.parse(document.transportedDate))
                                .locale("en-sg")
                                .format("LLL")}
                        </td>
                        <td>
                          {document.receivedDate === undefined
                            ? "-"
                            : moment(Date.parse(document.receivedDate))
                                .locale("en-sg")
                                .format("LLL")}
                        </td>
                      </tr>
                    );
                  })
                  .reverse()}
              </tbody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentTable;
