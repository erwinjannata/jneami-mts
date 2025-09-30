import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import { cabangList } from "../data/branchList";
import { Col } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = (data) => {
  let dataList = data.data;

  let statusList = [
    { name: "Received", color: "rgba(33, 37, 41, 0.8)" },
    { name: "Dalam Perjalanan", color: "rgba(13, 110, 253, 0.8)" },
    { name: "Standby", color: "rgba(255, 193, 7, 0.8)" },
    { name: "Unreceived", color: "rgba(220, 53, 69, 0.8)" },
  ];

  // let waktuList = [
  //   { name: "Tepat Waktu", color: "rgba(13, 110, 253, 0.8)" },
  //   { name: "Terlambat", color: "rgba(220, 53, 69, 0.8)" },
  //   { name: "Lebih Awal", color: "rgba(25, 135, 84, 0.8)" },
  // ];

  const statusData = statusList.map((status) => {
    return dataList.reduce(
      (counter, obj) => (obj.status === status.name ? counter + 1 : counter),
      0
    );
  });

  const filteredStatusList = statusList.filter(
    (_, index) => statusData[index] > 0
  );
  const filteredStatusData = statusData.filter((count) => count > 0);

  const cabangDataWithLabels = cabangList
    .map((item) => ({
      name: item.name,
      color: item.color,
      count: dataList.reduce(
        (counter, obj) =>
          obj.destination === item.name ? counter + 1 : counter,
        0
      ),
    }))
    .filter((item) => item.count > 0);

  // let waktuData = waktuList.map((item) => {
  //   return [
  //     (
  //       (dataList.reduce(
  //         (counter, obj) =>
  //           obj.statusWaktu == item.name ? (counter += 1) : counter,
  //         0
  //       ) /
  //         dataList.length) *
  //       100
  //     ).toFixed(2),
  //   ];
  // });

  let charts = [
    {
      label: "Status Surat Manifest",
      data: {
        labels: filteredStatusList.map((item) => item.name),
        datasets: [
          {
            label: "Surat Manifest",
            data: filteredStatusData,
            backgroundColor: filteredStatusList.map((item) => item.color),
            borderColor: "white",
            borderWidth: 3,
          },
        ],
      },
    },
    // {
    //   label: "Persentase Ketepatan Waktu",
    //   data: {
    //     labels: waktuList.map((item) => item.name),
    //     datasets: [
    //       {
    //         label: "%",
    //         data: statusData,
    //         backgroundColor: waktuList.map((item) => item.color),
    //         borderColor: "white",
    //         borderWidth: 3,
    //       },
    //     ],
    //   },
    // },
    {
      label: "Surat Manifest per Destinasi",
      data: {
        labels: cabangDataWithLabels.map((item) => item.name),
        datasets: [
          {
            label: "Surat Manifest",
            data: cabangDataWithLabels.map((item) => item.count),
            backgroundColor: cabangDataWithLabels.map((item) => item.color),
            borderColor: "white",
            borderWidth: 3,
          },
        ],
      },
    },
  ];

  return charts.map((chart, index) => (
    <Col key={index} sm={12} md={6} lg={4} className="mb-4">
      <Pie
        data={chart.data}
        options={{
          type: "pie",
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: chart.label,
            },
            legend: {
              position: "bottom",
              align: "start",
            },
          },
        }}
      />
    </Col>
  ));
};

export default PieChart;
