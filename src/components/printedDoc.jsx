import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
  },
  table: {
    width: "100%",
    fontSize: 10,
    padding: 20,
    textAlign: "center",
  },
  header: {
    borderTop: "none",
  },
  row: {
    borderTop: "1px solid #EEE",
    display: "flex",
    flexDirection: "row",
    margin: "auto",
    paddingTop: 5,
    paddingBottom: 5,
  },
  rowB: {
    borderTop: "1px solid #EEE",
    display: "flex",
    flexDirection: "row",
    margin: "auto",
  },
  title: {
    fontSize: 18,
    padding: 20,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  row1: {
    width: "5%",
  },
  row2: {
    width: "35%",
  },
  row3: {
    width: "5%",
  },
  row4: {
    width: "5%",
  },
  row5: {
    width: "50%",
  },
  dataRow: {
    width: "50%",
  },
  dataRowA: {
    width: "15%",
  },
  dataRowB: {
    width: "35%",
  },
  signRow: {
    width: "30%",
    textAlign: "center",
    marginTop: "20px",
  },
  signRow2: {
    display: "flex",
    flexDirection: "column",
  },
  signatures: {
    marginTop: "5px",
    marginBottom: "5px",
    width: "30%",
    height: "50px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  noBorder: {
    border: "none",
    textAlign: "left",
  },
  smaller: {
    fontSize: "10",
  },
});
const Print = ({
  data,
  noSurat,
  noRef,
  date1,
  date2,
  origin,
  destination,
  sumKoli,
  sumWeight,
  checkerSign,
  vendorSign,
  receiverSign,
  checkerName,
  receiverName,
  driverName,
  status,
  noPolisi,
}) => {
  let totalPage = Math.ceil(data.length / 20);

  return (
    <Document>
      {[...Array(totalPage)].map((e, i) => (
        <Page size="A4" style={styles.page} key={i}>
          <View style={styles.section}>
            <Text style={[styles.title, styles.bold]}>
              MANIFEST TRANSIT SUB AGEN
            </Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.row, styles.noBorder]}>
              <View style={[styles.rowB, styles.noBorder]}>
                <Text style={styles.dataRowA}>No. Surat</Text>
                <Text style={styles.dataRowB}>: {noSurat}</Text>
                <Text style={styles.dataRowA}>No. Ref Vendor</Text>
                <Text style={styles.dataRowB}>: {noRef}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.noBorder]}>
              <View style={[styles.rowB, styles.noBorder]}>
                <Text style={styles.dataRowA}>Status</Text>
                <Text style={styles.dataRowB}>: {status}</Text>
                <Text style={styles.dataRowA}>No. Polisi</Text>
                <Text style={styles.dataRowB}>: {noPolisi}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.noBorder]}>
              <View style={[styles.rowB, styles.noBorder]}>
                <Text style={styles.dataRowA}>Approved at</Text>
                <Text style={styles.dataRowB}>: {date1}</Text>
                <Text style={styles.dataRowA}>Received at</Text>
                <Text style={styles.dataRowB}>: {date2}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.noBorder]}>
              <View style={[styles.rowB, styles.noBorder]}>
                <Text style={styles.dataRowA}>Origin</Text>
                <Text style={styles.dataRowB}>: {origin}</Text>
                <Text style={styles.dataRowA}>Destination</Text>
                <Text style={styles.dataRowB}>: {destination}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.noBorder]}>
              <View style={[styles.rowB, styles.noBorder]}>
                <Text style={styles.dataRowA}>Total Koli</Text>
                <Text style={styles.dataRowB}>: {`${sumKoli} pcs`}</Text>
                <Text style={styles.dataRowA}>Total Weight</Text>
                <Text style={styles.dataRowB}>: {`${sumWeight} kg`}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.table, styles.smaller]}>
            <View style={[styles.row, styles.header, styles.bold]}>
              <Text style={styles.row1}>No. </Text>
              <Text style={styles.row2}>Manifest No.</Text>
              <Text style={styles.row3}>Pcs</Text>
              <Text style={styles.row4}>Kg</Text>
              <Text style={styles.row5}>Remark</Text>
            </View>
            {data.slice(i * 20, (i + 1) * 20).map((item, id) => (
              <View style={styles.row} key={id}>
                <Text style={styles.row1}>{id + 1}</Text>
                <Text style={styles.row2}>{item.manifestNo}</Text>
                <Text style={styles.row3}>{item.pcs}</Text>
                <Text style={styles.row4}>{item.kg}</Text>
                <Text style={styles.row5}>{item.remark}</Text>
              </View>
            ))}
            <View style={[styles.row, styles.header, styles.bold]}>
              <View style={styles.signRow}>
                <View style={styles.signRow2}>
                  <Text>Prepared by</Text>
                </View>
                <View style={styles.signRow2}>
                  <Image source={checkerSign} style={styles.signatures} />
                </View>
                <View style={styles.signRow2}>
                  <Text>{checkerName}</Text>
                </View>
              </View>
              <View style={styles.signRow}>
                <View style={styles.signRow2}>
                  <Text>Received by</Text>
                </View>
                {vendorSign == "" ? null : (
                  <View style={styles.signRow2}>
                    <Image source={vendorSign} style={styles.signatures} />
                  </View>
                )}
                {vendorSign == "" ? null : (
                  <View style={styles.signRow2}>
                    <Text>{driverName}</Text>
                  </View>
                )}
              </View>
              <View style={styles.signRow}>
                <View style={styles.signRow2}>
                  <Text>Received by</Text>
                </View>
                {receiverSign == "" ? null : (
                  <View style={styles.signRow2}>
                    <Image source={receiverSign} style={styles.signatures} />
                  </View>
                )}
                {receiverSign == "" ? null : (
                  <View style={styles.signRow2}>
                    <Text>{receiverName}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

Print.propTypes = {
  data: PropTypes.array,
  noSurat: PropTypes.string,
  noRef: PropTypes.string,
  date1: PropTypes.string,
  date2: PropTypes.string,
  origin: PropTypes.string,
  destination: PropTypes.string,
  sumKoli: PropTypes.number,
  sumWeight: PropTypes.number,
  checkerSign: PropTypes.string,
  vendorSign: PropTypes.string,
  receiverSign: PropTypes.string,
  checkerName: PropTypes.string,
  receiverName: PropTypes.string,
  driverName: PropTypes.string,
  status: PropTypes.string,
  noPolisi: PropTypes.string,
};

export default Print;
