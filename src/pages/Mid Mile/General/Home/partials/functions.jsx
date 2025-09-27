import firebase from "./../../../../../config/firebase";

// Fetch Data from database
export const fetchData = ({ limit, setData, setShowData, setLoading }) => {
  const database = firebase.database().ref();

  database
    .child("midMile/documents")
    .limitToLast(parseInt(limit))
    .on("value", (snapshot) => {
      let data = [];
      snapshot.forEach((childSnapshot) => {
        data.push({
          key: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setData(data);
      setShowData(data);
      setLoading(false);
    });
};

// Handle click on category cards
export const handleFilter = ({
  status,
  state,
  data,
  setState,
  setShowList,
}) => {
  if (state.filtered === true && state.currentFilter === status) {
    setShowList(data);
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
    setShowList(data.filter((datalist) => datalist.status.includes(status)));
  }
};

// Handle change in search input field
export const handleFind = ({ e, documentList, setShowData }) => {
  e.preventDefault();
  const value = e.target.value;
  let searchResult = [];

  if (e.target.value === "") {
    setShowData(documentList);
  } else {
    documentList.forEach((doc) => {
      if (doc.documentNumber.includes(value)) {
        searchResult.push(doc);
      }
    });
    setShowData(searchResult);
  }
};
