// Fetch Data from database
export const fetchData = ({
  dbRef,
  limit,
  setData,
  setShowData,
  setLoading,
}) => {
  dbRef
    .orderByChild("submittedDate")
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
