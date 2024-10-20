import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import { getAllExams } from "../services/examService";
import { Box, Heading, Flex, useColorModeValue } from "@chakra-ui/react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
Chart.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

function Statistics() {
  const [userData, setUserData] = useState([]);
  const [examData, setExamData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await getAllUsers();
        const exams = await getAllExams();
        setUserData(users);
        setExamData(exams);
      } catch (error) {
        // Error handling can be improved with error boundaries
      }
    }
    fetchData();
  }, []);

  // Data for bar chart (Exams created over time)
  const examChartData = {
    labels: examData.map((exam) => exam.title), // Titles are mapped here for hover
    datasets: [
      {
        label: "Exams Created",
        data: examData.map((exam) => exam.questions.length),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data for pie chart (User role distribution)
  const userRoleDistribution = userData.reduce(
    (acc, user) => {
      if (user.role === "admin") acc.admin++;
      if (user.role === "examiner") acc.examiner++;
      if (user.role === "student") acc.student++;
      return acc;
    },
    { admin: 0, examiner: 0, student: 0 }
  );

  const userChartData = {
    labels: ["Admin", "Examiner", "Student"],
    datasets: [
      {
        label: "Users by Role",
        data: [
          userRoleDistribution.admin,
          userRoleDistribution.examiner,
          userRoleDistribution.student,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Options for bar chart tooltips and layout
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to be more responsive
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            return tooltipItems[0].label; // Show exam title on hover
          },
          label: function (tooltipItem) {
            return `Questions: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true, // Hide x-axis labels (exam titles)
      },
    },
  };

  // Options for pie chart tooltips and layout
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to be more responsive
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const role = tooltipItem.label;
            const count = tooltipItem.raw;
            return `${role}: ${count} users`;
          },
        },
      },
    },
  };

  return (
    <Box p={6} mt={12}>
      <Heading mb={6}>Dashboard Statistics</Heading>
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        {/* Bar Chart for Exam Statistics */}
        <Box
          flex="3" // Takes 3/4 of the width
          bg={useColorModeValue("white", "gray.700")}
          p={4}
          borderRadius="lg"
          shadow="md"
          height={{ base: "300px", md: "400px" }} // Adjust height for Bar chart
          width="100%"
        >
          <Heading as="h3" size="md" mb={4}>
            Exam Statistics
          </Heading>
          <Box height="75%" overflow="hidden">
            <Bar data={examChartData} options={barOptions} />
          </Box>
        </Box>

        {/* Pie Chart for User Role Distribution */}
        <Box
          flex="1" // Takes 1/4 of the width
          bg={useColorModeValue("white", "gray.700")}
          p={4}
          borderRadius="lg"
          shadow="md"
          height={{ base: " 300px", md: "400px" }} // Adjust height to match Bar chart
          width="100%"
        >
          <Heading as="h3" size="md" mb={4}>
            User Role Distribution
          </Heading>
          <Box height="75%" overflow="hidden">
            <Pie data={userChartData} options={pieOptions} />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default Statistics;
