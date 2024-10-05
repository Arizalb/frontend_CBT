import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Heading,
} from "@chakra-ui/react";
import ManageUsers from "../components/ManageUsers";
import ManageExams from "../components/ManageExams";

const Manage = () => {
  return (
    <Box p={4}>
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Admin Management
      </Heading>
      <Tabs isFitted variant="enclosed" colorScheme="teal">
        <TabList mb="1em">
          <Tab>Manage Users</Tab>
          <Tab>Manage Exams</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ManageUsers />
          </TabPanel>
          <TabPanel>
            <ManageExams />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Manage;
