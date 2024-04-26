import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart(data) {
  let dataList = data.data;

  let showedData = [
    (dataList.reduce(
      (counter, obj) =>
        obj.status == "Received" || obj.status == "Received*"
          ? (counter += 1)
          : counter,
      0
    ) /
      dataList.length) *
      100,
    (dataList.reduce(
      (counter, obj) =>
        obj.status == "Sampai Tujuan" ? (counter += 1) : counter,
      0
    ) /
      dataList.length) *
      100,
    (dataList.reduce(
      (counter, obj) =>
        obj.status == "Dalam Perjalanan" ? (counter += 1) : counter,
      0
    ) /
      dataList.length) *
      100,
    (dataList.reduce(
      (counter, obj) =>
        obj.status == "Menunggu Vendor" ? (counter += 1) : counter,
      0
    ) /
      dataList.length) *
      100,
  ];

  const chartData = {
    labels: [
      "Received",
      "Sampai Tujuan",
      "Dalam Perjalanan",
      "Menunggu Vendor",
    ],
    datasets: [
      {
        label: "% Total",
        data: showedData,
        backgroundColor: [
          "rgba(33, 37, 41, 0.8)",
          "rgba(13, 110, 253, 0.8)",
          "rgba(255, 193, 7, 0.8)",
          "rgba(220, 53, 69, 0.8)",
        ],
        borderColor: "white",
        borderWidth: 3,
      },
    ],
  };
  return (
    <Pie
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            position: "top",
            text: "Status Surat Manifest",
          },
        },
      }}
    />
  );
}
