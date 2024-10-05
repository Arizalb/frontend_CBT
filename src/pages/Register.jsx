import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../services/authService";
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

// Define validation schema
const schema = yup.object().shape({
  name: yup.string().required("Nama wajib diisi"),
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
});

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Set role to "student" automatically
    const userData = {
      ...data,
      role: "student", // Set role to student
    };

    try {
      await registerUser(userData);
      navigate("/login");
    } catch (error) {
      console.error("Registrasi gagal", error);
    }
  };

  const bgColor = useColorModeValue("gray.100", "gray.900");
  const inputBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  return (
    <Box
      p={6}
      maxW="400px"
      mx="auto"
      mt={12}
      bg={bgColor}
      color={textColor}
      borderRadius="md"
      minH={"100vh"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name} mb={4}>
          <FormLabel>Nama</FormLabel>
          <Input type="text" {...register("name")} bg={inputBgColor} />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.email} mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" {...register("email")} bg={inputBgColor} />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.password} mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" {...register("password")} bg={inputBgColor} />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>

        {/* Removed role selection since it's now fixed */}

        <Button colorScheme="teal" type="submit" width="full">
          Register
        </Button>
      </form>
    </Box>
  );
}

export default Register;
