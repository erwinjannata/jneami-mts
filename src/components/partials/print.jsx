/* eslint-disable react/prop-types */
import moment from "moment";
import Print from "./printedDoc";

function PrintFn(props) {
  return (
    <Print
      data={props.bagList}
      noSurat={props.data.noSurat}
      noRef={props.data.noRef}
      date1={`${moment(props.data.approvedDate).locale("id").format("LL")} ${
        props.data.approvedTime
      }`}
      date2={
        props.data.receivedDate == ""
          ? "-"
          : `${moment(props.data.receivedDate).locale("id").format("LL")} ${
              props.data.receivedTime
            }`
      }
      origin={props.data.origin}
      destination={props.data.destination}
      checkerSign={props.data.checkerSign}
      vendorSign={props.data.vendorSign}
      receiverSign={props.data.receiverSign}
      checkerName={props.data.preparedBy}
      receiverName={props.data.receivedBy}
      driverName={props.data.driver}
      status={props.data.status}
      noPolisi={props.data.noPolisi}
    />
  );
}

export default PrintFn;
