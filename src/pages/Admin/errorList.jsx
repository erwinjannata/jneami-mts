import { useState } from "react";
import firebase from "./../../config/firebase";
import NavMenu from "../../components/partials/navbarMenu";
import { Container } from "react-bootstrap";
import DocListTable from "../../components/partials/documentListTable";

const ErrorListPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useState(() => {
    setLoading(true);
    const database = firebase.database().ref();

    database
      .child("manifestTransit")
      .orderByChild("destination")
      .equalTo("")
      .limitToLast(50000)
      .on("value", (snapshot) => {
        setData([]);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            setData((prev) => [
              ...prev,
              {
                key: childSnapshot.key,
                ...childSnapshot.val(),
              },
            ]);
          });
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
