import { useState } from "react";
import firebase from "./../../config/firebase";
import NavMenu from "../../components/partials/navbarMenu";
import { Container } from "react-bootstrap";
import DocListTable from "../../components/partials/documentListTable";

const ErrorListPage = () => {
  // Initialize Database Reference
  const dbRef = firebase.database().ref("manifestTransit");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useState(() => {
    setLoading(true);
    dbRef
      .orderByChild("destination")
      .equalTo("")
      .limitToLast(50000)
      .on("value", (snapshot) => {
        let data = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            data.push({
              key: childSnapshot.key,
              ...childSnapshot.val(),
            });
          });
          setData(data);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>No Destination Docs</h2>
        <hr />
        <DocListTable data={data} loading={loading} />
      </Container>
    </div>
  );
};

export default ErrorListPage;
