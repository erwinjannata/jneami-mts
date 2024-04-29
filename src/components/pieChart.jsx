/* eslint-disable no-unused-vars */
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = (data) => {
  let type = data.type;
  let dataList = data.data;

  const randomBetween = (min, max) =>
    min + Math.floor(Math.random() * (max - min + 1));
  const r = randomBetween(0, 255);
  const g = randomBetween(0, 255);
  const b = randomBetween(0, 255);
  const rgba = `rgba(${r},${g},${b}), 0.8`;

  let statusList = [
    { name: "Received", color: "rgba(33, 37, 41, 0.8)" },
    { name: "Sampai Tujuan", color: "rgba(13, 110, 253, 0.8)" },
    { name: "Dalam Perjalanan", color: "rgba(255, 193, 7, 0.8)" },
    { name: "Menunggu Vendor", color: "rgba(220, 53, 69, 0.8)" },
  ];

  let cabangList = [
    { id: "0", name: "ALAS", color: "#3B71CA" },
    { id: "1", name: "BIMA", color: "#9FA6B2" },
    { id: "2", name: "BOLO", color: "#14A44D" },
    { id: "3", name: "DOMPU", color: "#DC4C64" },
    { id: "4", name: "EMPANG", color: "#E4A11B" },
    { id: "5", name: "MANGGELEWA", color: "#cddc35" },
    { id: "6", name: "MATARAM", color: "#84ffff" },
    { id: "7", name: "PADOLO", color: "#332D2D" },
    { id: "8", name: "PLAMPANG", color: "#c8e6c9" },
    { id: "9", name: "PRAYA", color: "#c5e1a5" },
    { id: "10", name: "SELONG", color: "#76ff03" },
    { id: "11", name: "SUMBAWA", color: "#d32f2f" },
    { id: "12", name: "TALIWANG", color: "#ffd600" },
    { id: "13", name: "TANJUNG", color: "#fff3e0" },
    { id: "14", name: "UTAN", color: "#ff5722" },
  ];

  let statusData = [
    dataList.reduce(
      (counter, obj) =>
        obj.status == "Received" || obj.status == "Received*"
          ? (counter += 1)
          : counter,
      0
    ),
    dataList.reduce(
      (counter, obj) =>
        obj.status == "Sampai Tujuan" ? (counter += 1) : counter,
      0
    ),
    dataList.reduce(
      (counter, obj) =>
        obj.status == "Dalam Perjalanan" ? (counter += 1) : counter,
      0
    ),
    dataList.reduce(
      (counter, obj) =>
        obj.status == "Menunggu Vendor" ? (counter += 1) : counter,
      0
    ),
  ];

  let cabangData = cabangList.map((item) => {
    return [
      dataList.reduce(
        (counter, obj) =>
          obj.destination == item.name ? (counter += 1) : counter,
        0
      ),
    ];
  });

  const chartData = {
    labels:
      type == "status"
        ? statusList.map((item) => item.name)
        : cabangList.map((item) => item.name),
    datasets: [
      {
        label: " Surat Manifest",
        data: type == "status" ? statusData : cabangData,
        backgroundColor:
          type == "status"
            ? statusList.map((item) => item.color)
            : cabangList.map((item) => item.color),
        borderColor: "white",
        borderWidth: 3,
      },
    ],
  };
  return (
    <Pie
      data={chartData}
      options={{
        type: "pie",
        responsive: true,
        plugins: {
          title: {
            display: true,
            text:
              type == "status"
                ? "Status Surat Manifest"
                : "Surat Manifest per Destinasi",
          },
          legend: {
            position: "bottom",
            align: "start",
          },
        },
      }}
    />
  );
};

export default PieChart;
