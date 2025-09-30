import { filterByRoute } from "../../../../components/functions/functions";
import firebase from "./../../../../config/firebase";

// Fetch Data from database on mount
export const fetchData = ({
  route,
  userOrigin,
  state,
  setLoading,
  setDocumentList,
  setShowList,
}) => {
  // Route to MidMile page if loggen in user is from BANDARA
  if (userOrigin === "BANDARA") {
    route("/mm");
  }
  const database = firebase.database().ref();

  database
    .child("eMTS/documents")
    .limitToLast(parseInt(state.limit))
    .on("value", (snapshot) => {
      let data = [];

      snapshot.forEach((childSnapshot) => {
        if (userOrigin === "MATARAM" || userOrigin === "VENDOR") {
          data.push({
            key: childSnapshot.key,
            ...childSnapshot.val(),
          });
        } else {
          if (
            childSnapshot.val().origin == userOrigin ||
            childSnapshot.val().destination == userOrigin
          ) {
            data.push({
              key: childSnapshot.key,
              ...childSnapshot.val(),
            });
          }
        }
      });

      const result = filterByRoute({ data: data, state: state });

      setDocumentList(result);
      setShowList(result);
      setLoading(false);
    });
};

// Search No. Surat
export const handleSearch = ({
  e,
  search,
  documents,
  oldDocuments,
  setShowList,
}) => {
  e.preventDefault();
  let searchResult = [];

  if (search === "") {
    setShowList(oldDocuments);
  } else {
    documents.forEach((item) => {
      let find = item.noSurat.toUpperCase().replace(/ /g, "");
      if (find.includes(search.toUpperCase().replace(/ /g, ""))) {
        searchResult.push(item);
      }
    });
    setShowList(searchResult);
  }
};

// Handle Cards filter
export const handleFilter = ({
  status,
  state,
  documentList,
  setShowList,
  setState,
}) => {
  if (state.filtered == true && state.currentFilter == status) {
    setShowList(documentList);
    setState({
      ...state,
      filtered: false,
      currentFilter: "",
    });
  } else {
    setState({
      ...state,
      filtered: true,
      currentFilter: status,
    });
    setShowList(
      documentList.filter((datalist) => datalist.status.includes(status))
    );
  }
};
