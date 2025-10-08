import moment from "moment";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NotFound from "@/components/partials/notFound";
import LoadingAnimation from "@/components/partials/loading";

/* eslint-disable react/prop-types */
const DocumentTable = ({ documents, loading }) => {
  const navigate = useNavigate();
  const tableHeader = [
    { name: "Document No.", cn: "w-25" },
    { name: "Pcs", cn: "w-auto" },
    { name: "Weight", cn: "w-auto" },
    { name: "Status", cn: "w-25" },
    { name: "Submit Date", cn: "w-25" },
    { name: "Transport Date", cn: "w-25" },
    { name: "Received Date", cn: "w-25" },
  ];

  return (
    <div>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="rounded border p-2">
          {documents.length === 0 ? (
            <NotFound />
          ) : (
            <Table responsive hover id="tableData">
              <thead id="stickyHead">
                <tr>
                  {tableHeader.map((header, index) => (
                    <th key={index} className={header.cn}>
                      {header.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents
                  .map((document, index) => {
                    return (
                      <tr
                        key={index}
                        onClick={() => navigate(`/mm/d/${document.key}`)}
                      >
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
