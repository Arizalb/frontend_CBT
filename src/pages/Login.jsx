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
} from "@chakra-ui/react";

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

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      if (response.success) {
        console.log("Login berhasil, role:", localStorage.getItem("role"));
        console.log("Login berhasil, name:", localStorage.getItem("name"));
        navigate("/"); // Redirect ke home setelah login berhasil
      } else {
        console.error("Login gagal:", response.message);
      }
    } catch (error) {
      console.error("Login gagal:", error);
    }
  };

  // Menggunakan useColorModeValue untuk menyesuaikan warna dengan mode (light/dark)
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const inputBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  return (
    <Box minH={"100vh"}>
      <Box
        p={6}
        maxW="400px"
        mx="auto"
        mt={12}
        bg={bgColor}
        color={textColor}
        borderRadius="md"
        boxShadow="lg"
      >
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

          <Button colorScheme="teal" type="submit" width="full">
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
