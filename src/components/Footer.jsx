import {
  Box,
  Text,
  Link,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
  Divider,
  Stack,
  chakra,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  const bg = useColorModeValue("whiteAlpha.400", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const accent = useColorModeValue("teal.500", "teal.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Playful gradient for brand
  const Brand = chakra("span", {
    baseStyle: {
      bgGradient: "linear(to-r, teal.400, purple.400)",
      bgClip: "text",
      fontWeight: "extrabold",
      fontSize: "lg",
      letterSpacing: "tight",
      transition: "all 0.2s",
      _hover: { filter: "brightness(1.2)" },
      cursor: "pointer",
    },
  });

  return (
    <Box
      as="footer"
      bg={bg}
      color={textColor}
      borderTop={`1.5px solid ${borderColor}`}
      py={{ base: 8, md: 10 }}
      px={{ base: 4, md: 8 }}
      mt={16}
      mb={4}
      opacity={0.98}
    >
      <VStack spacing={4} w="full">
        <Brand>OnTest - CBT App</Brand>

        <Text fontSize="xs" textAlign="center" opacity={0.8}>
          © {new Date().getFullYear()} Rizal Baihaqi. All rights reserved.
        </Text>
        <Text fontSize="xs" textAlign="center" opacity={0.8}>
          Made with{" "}
          <span style={{ color: "#ff5a5f", fontWeight: "bold" }}>❤️</span> by
          RzlBaihaqi
        </Text>

        <Divider borderColor={borderColor} my={2} />

        {/* Tautan Sosial */}
        <Text fontSize="sm" fontWeight="bold" color={accent} mt={2}>
          Follow Me
        </Text>
        <HStack spacing={6}>
          <Link href="https://facebook.com" isExternal aria-label="Facebook">
            <Icon
              as={FaFacebook}
              w={7}
              h={7}
              transition="all 0.2s"
              _hover={{
                color: "#1877f3",
                transform: "rotate(-10deg) scale(1.18)",
                filter: "drop-shadow(0 0 4px #1877f3aa)",
              }}
            />
          </Link>
          <Link
            href="https://instagram.com/rzlbaihaqi"
            isExternal
            aria-label="Instagram"
          >
            <Icon
              as={FaInstagram}
              w={7}
              h={7}
              transition="all 0.2s"
              _hover={{
                color: "#e1306c",
                transform: "rotate(8deg) scale(1.18)",
                filter: "drop-shadow(0 0 4px #e1306c99)",
              }}
            />
          </Link>
          <Link href="https://twitter.com" isExternal aria-label="Twitter">
            <Icon
              as={FaTwitter}
              w={7}
              h={7}
              transition="all 0.2s"
              _hover={{
                color: "#1da1f2",
                transform: "rotate(-6deg) scale(1.18)",
                filter: "drop-shadow(0 0 4px #1da1f299)",
              }}
            />
          </Link>
        </HStack>

        <Divider borderColor={borderColor} my={2} />

        {/* Tautan GitHub */}
        <Text fontSize="sm" fontWeight="bold" color={accent} mt={2}>
          Contribute on GitHub
        </Text>
        <Link
          href="https://github.com/Arizalb"
          isExternal
          fontWeight="medium"
          display="flex"
          alignItems="center"
          color={textColor}
          _hover={{
            color: accent,
            textDecoration: "underline",
            transform: "scale(1.08) rotate(-3deg)",
          }}
          transition="all 0.2s"
        >
          <Icon as={FaGithub} w={7} h={7} mr={2} /> GitHub
        </Link>
      </VStack>
    </Box>
  );
};

export default Footer;
