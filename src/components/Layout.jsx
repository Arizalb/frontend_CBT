import { Outlet } from "react-router-dom";
import { Box, Container } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Container as="main" maxW="6xl" flex="1">
        <Outlet />
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Layout;
