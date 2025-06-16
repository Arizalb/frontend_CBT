import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useColorModeValue,
  Spinner,
  Heading,
  Text,
  Link,
  Stack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { FaUserCircle } from "react-icons/fa";

const schema = yup.object().shape({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await loginUser(data);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: "Selamat datang, " + localStorage.getItem("name"),
          confirmButtonText: "Oke",
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Login!",
          text: "Periksa email dan password Anda!",
          confirmButtonText: "Oke",
        });
      }
    } catch (error) {
      console.error("Login gagal:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Login!",
        text: error?.response?.data?.message || "Terjadi kesalahan.",
        confirmButtonText: "Oke",
      });
    } finally {
      setLoading(false);
    }
  };

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.700");
  const inputBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const accent = useColorModeValue("purple.400", "purple.300");

  return (
    <Box p={6} maxW="1000px" mx="auto" mt={12} minH={"100vh"}>
      <Box
        p={8}
        maxW="400px"
        mx="auto"
        bg={cardBg}
        color={textColor}
        borderRadius="xl"
        boxShadow="lg"
        border={`1px solid ${useColorModeValue("gray.200", "gray.600")}`}
        mt={12}
      >
        <Stack
          direction="row"
          align="center"
          justify="center"
          mb={4}
          spacing={2}
        >
          <Icon as={FaUserCircle} color={accent} boxSize={7} />
          <Badge
            colorScheme="teal"
            fontSize="1em"
            px={3}
            py={1}
            borderRadius="full"
          >
            Login
          </Badge>
        </Stack>
        <Heading
          as="h2"
          size="lg"
          mb={2}
          color={useColorModeValue("teal.600", "teal.300")}
          fontWeight="extrabold"
          letterSpacing="tight"
          lineHeight="shorter"
          textAlign="center"
        >
          Selamat Datang!
        </Heading>
        <Text fontSize="md" color={textColor} mb={6} textAlign="center">
          Silakan login untuk melanjutkan ke dashboard CBT.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email} mb={4}>
            <FormLabel>Email</FormLabel>
            <Input type="email" {...register("email")} bg={inputBgColor} />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password} mb={6}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password")}
              bg={inputBgColor}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="teal"
            type="submit"
            width="full"
            isDisabled={loading}
            size="lg"
            fontWeight="bold"
            mb={2}
          >
            {loading ? <Spinner size="sm" /> : "Login"}
          </Button>
        </form>
        <Text mt={4} textAlign="center">
          Belum punya akun?{" "}
          <Link color="teal.500" onClick={() => navigate("/register")}>
            Registrasi
          </Link>
        </Text>
      </Box>
    </Box>
  );
}

export default Login;
