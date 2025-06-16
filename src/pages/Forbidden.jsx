import { Box, Heading, Text, Button, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Forbidden = () => {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.400", "gray.600");

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      color={textColor}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <Heading fontSize="5xl" mb={4} borderBottom="2px solid" borderColor={borderColor}>
        403 - Forbidden
      </Heading>
      <Text fontSize="lg" mb={6}>
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </Text>
      <Button
        as={Link}
        to="/"
        variant="outline"
        colorScheme="gray"
        borderColor={borderColor}
        _hover={{
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
      >
        Kembali ke Beranda
      </Button>
    </Box>
  );
};

export default Forbidden;
