import moment from "moment";
import { utils, writeFile } from "xlsx";
import firebase from "./../../../../config/firebase";
import { cabangList } from "../../../../components/data/branchList";

export const getDocNumber = ({ document, setDocument, setLoading, auth }) => {
  const database = firebase.database().ref();

  try {
    setLoading(true);

    database.child("status").on("value", (snapshot) => {
      let count = parseInt(snapshot.child("eMTSInboundLength").val());
      let zerofilled = ("00000" + (count + 1)).slice(-5);

      let d = new Date();
      let year = d.getFullYear().toString().substring(2, 4);

      setDocument({
        ...document,
        noSurat: `AMI/MTM/${year}/${zerofilled}`,
        origin: auth.origin,
        approveUser: auth.name,
      });
    });
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const handleAdd = ({ e, form, bags, setBags, setForm }) => {
  e.preventDefault();
  if (!form.manifestNo) {
    alert("No. Manifest kosong");
    return;
  } else if (!form.koli) {
    alert("Koli invalid");
    return;
  } else if (!form.pcs) {
    alert("Pcs invalid");
    return;
  } else if (!form.weight) {
    alert("Berat invalid");
    return;
  }

  const isExist = bags.some((bag) => bag.manifestNo === form.manifestNo);

  if (!isExist) {
    setBags((prev) => [
      ...prev,
      {
        ...form,
        manifestNo: form.manifestNo.trim(),
        status: "Standby",
        mtsDate: moment().format("YYYY-MM-DD HH:mm"),
      },
    ]);
    setForm({ manifestNo: "", koli: 1, pcs: 1, weight: 1, remark: "" });
  } else {
    alert(`Bag ${form.manifestNo} sudah di manifest`);
    return;
  }
};

export const handlePaste = ({ e, setBags }) => {
  e.preventDefault();
  const text = e.clipboardData.getData("text");
  const rows = text.split("\n").filter((row) => row.trim() !== "");

  const newData = rows.map((row) => {
    const cols = row.split("\t");
    return {
      manifestNo: (cols[0] || "").trim(),
      koli: Number(cols[1]) || 1,
      pcs: Number(cols[2]) || 1,
      weight: Number(cols[3]) || 1,
      remark: cols[4] || "",
      status: "Standby",
      mtsDate: moment().format("YYYY-MM-DD HH:mm"),
    };
  });

  setBags((prev) => [...prev, ...newData]);
};

export const handleRemove = ({ manifestNo, setBags }) => {
  setBags((current) =>
    current.filter((number) => {
      return number.manifestNo !== manifestNo;
    })
  );
};

export const approveDoc = async ({ document, bags, setLoading, route }) => {
  if (confirm("Konfirmasi Approve")) {
    if (!bags.length) {
      alert("Tidak ada data manifest terbaca");
      return;
    } else if (!document.origin || !document.approveUser) {
      alert("User tidak terbaca, silahkan refresh halaman atau login kembali");
      return;
    } else if (!document.destination) {
      alert("Destination belum dipilih");
      return;
    } else {
      // eslint-disable-next-line no-unused-vars
      const database = firebase.database().ref();
      const keyReference = database.child("eMTS/documents").push().key;

      try {
        await Promise.all([
          setLoading(true),
          ...bags.map((bag) => {
            return database.child("eMTS/bags").push({
              ...bag,
              docId: keyReference,
            });
          }),
          database.child(`eMTS/documents/${keyReference}`).set({
            ...document,
            status: "Standby",
            approved: moment().format("YYYY-MM-DD HH:mm"),
            totalPcs: bags.reduce((prev, next) => {
              return prev + parseInt(next.pcs);
            }, 0),
            totalWeight: bags.reduce((prev, next) => {
              return prev + parseInt(next.weight);
            }, 0),
            count: 0,
          }),
          database.child("status/eMTSInboundLength").transaction((current) => {
            if (current === null) {
              return 1;
            } else {
              return current + 1;
            }
          }),
          route("/"),
          alert("Proses MTS berhasil"),
        ]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  } else {
    return;
  }
};

export const handleDownloadTemplate = () => {
  const headers = [["Manifest Number", "Koli", "Pcs", "Kg / Weight", "Remark"]];
  const workbook = utils.book_new();

  cabangList.forEach((cabang) => {
    const worksheet = utils.aoa_to_sheet(headers);

    utils.book_append_sheet(workbook, worksheet, cabang.name);
  });

  writeFile(workbook, "Template Import Data E-MTS.xlsx");
};
