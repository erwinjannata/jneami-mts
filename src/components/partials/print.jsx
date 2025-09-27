/* eslint-disable react/prop-types */
import moment from "moment";
import Print from "./printedDoc";

function PrintFn(props) {
  return (
    <Print
      data={props.bagList}
      noSurat={props.data.noSurat}
      noRef={props.data.noRef}
      date1={`${moment(props.data.approved).locale("en-sg").format("LLL")}`}
      date2={
        props.data.receivedDate == ""
          ? "-"
          : `${moment(props.data.received).locale("en-sg").format("LLL")}`
      }
      origin={props.data.origin}
      destination={props.data.destination}
      checkerName={props.data.preparedBy}
      receiverName={props.data.receivedBy}
      driverName={props.data.driver}
      status={props.data.status}
      noPolisi={props.data.noPolisi}
    />
  );
}

export default PrintFn;
