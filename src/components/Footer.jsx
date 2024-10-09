import {
  Box,
  Flex,
  Text,
  Link,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  const bg = useColorModeValue("gray.800", "gray.700");
  return (
    <Box bg={bg} color="gray.300" py={10} px={4}>
      <VStack spacing={4}>
        <Text fontSize="sm" fontWeight="bold">
          RZL Baihaqi CBT App
        </Text>

        {/* Informasi Kontak */}
        <Text fontSize="xs" textAlign="center">
          2023 RZL Baihaqi. All rights reserved.
        </Text>
        <Text fontSize="xs" textAlign="center">
          Made with <span style={{ color: "red" }}>❤️</span> by RzlBaihaqi
        </Text>

        {/* Tautan Sosial */}
        <Text fontSize="sm" fontWeight="bold" mt={4}>
          Follow Us
        </Text>
        <HStack spacing={6}>
          <Link href="https://facebook.com" isExternal>
            <Icon
              as={FaFacebook}
              w={6}
              h={6}
              transition="0.2s"
              _hover={{ color: "blue.400" }}
            />
          </Link>

          <Link href="https://instagram.com/rzlbaihaqi" isExternal>
            <Icon
              as={FaInstagram}
              w={6}
              h={6}
              transition="0.2s"
              _hover={{ color: "pink.400" }}
            />
          </Link>
          <Link href="https://twitter.com" isExternal>
            <Icon
              as={FaTwitter}
              w={6}
              h={6}
              transition="0.2s"
              _hover={{ color: "blue.300" }}
            />
          </Link>
        </HStack>

        {/* Tautan GitHub */}
        <Text fontSize="sm" fontWeight="bold" mt={6}>
          Contribute on GitHub
        </Text>
        <Link
          href="https://github.com/Arizalb"
          isExternal
          color="white"
          fontWeight="medium"
        >
          <Icon as={FaGithub} w={6} h={6} mr={2} /> GitHub
        </Link>
      </VStack>
    </Box>
  );
};

export default Footer;
