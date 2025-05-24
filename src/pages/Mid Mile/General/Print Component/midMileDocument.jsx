/* eslint-disable react/prop-types */
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import moment from "moment";

const MidMileDocument = ({ data, bagList }) => {
  const d = new Date();
  const today = moment(d).locale("id-ID").format("llll");

  const itemsPerPage = 5;
  const groupedBags = bagList.reduce((acc, bag) => {
    if (!acc[bag.sm]) {
      acc[bag.sm] = {
        bagNumbers: [],
        totalKoli: 0,
      };
    }

    for (let index = 0; index < bag.koli; index++) {
      acc[bag.sm].bagNumbers.push(`${bag.bagNumber}/${bag.weight}`);
    }
    acc[bag.sm].totalKoli += parseInt(bag.koli);
    return acc;
  }, {});

  const smus = Object.keys(groupedBags);
  let totalPage = Math.ceil(smus.length / itemsPerPage);

  return (
    <Document>
      {[...Array(totalPage)].map((_, pageNumber) => (
        <Page size="A4" key={pageNumber} style={styles.page}>
          <View style={styles.section}>
            <Text style={[styles.title, styles.bold]}>
              CEKLIST JNE INBOUND BANDARA
            </Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.row, styles.noBorder]}>
              <View style={[styles.rowB, styles.noBorder]}>
                <Text style={styles.dataRowA}>No. Dokumen</Text>
                <Text style={styles.dataRowB}>: {data.documentNumber}</Text>
                <Text style={styles.dataRowA}>Hari / Tanggal</Text>
                <Text style={styles.dataRowB}>: {today}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.noBorder]}>
              <View style={[styles.rowB, styles.noBorder]}>
                <Text style={styles.dataRowA}></Text>
                <Text style={styles.dataRowB}></Text>
                <Text style={styles.dataRowA}>Pengambilan</Text>
                <Text style={styles.dataRowB}>:</Text>
              </View>
            </View>
            <View style={[styles.table, styles.smaller]}>
              <View style={[styles.row, styles.header]}>
                <Text style={[styles.row1, styles.bold]}>SMU</Text>
                <Text style={[styles.row2, styles.bold]}>Total Koli</Text>
                <Text style={[styles.row3, styles.bold]}>Master Bag</Text>
              </View>
              {smus
                .slice(
                  pageNumber * itemsPerPage,
                  (pageNumber + 1) * itemsPerPage
                )
                .map((smu, id) => (
                  <View style={styles.row} key={id}>
                    <Text style={styles.row1}>{smu}</Text>
                    <Text style={styles.row2}>
                      {groupedBags[smu].totalKoli}
                    </Text>
                    <Text style={[styles.row3, styles.bags]}>
                      {groupedBags[smu].bagNumbers.join(" + ")}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

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
    width: "10%",
  },
  row2: {
    width: "30%",
  },
  row3: {
    width: "60%",
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
  hidden: {
    visibility: "hidden",
  },
  bags: {
    textAlign: "left",
    lineHeight: 2,
  },
});

export default MidMileDocument;
