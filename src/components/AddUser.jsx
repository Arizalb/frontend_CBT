import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { registerUser } from "../services/authService"; // Pastikan path ini benar
import { h3 } from "framer-motion/client";

// Define validation schema
const schema = yup.object().shape({
  name: yup.string().required("Nama wajib diisi"),
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
  role: yup.string().required("Role wajib dipilih"),
});

const AddUser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data); // Kirim data langsung
      onClose(); // Tutup modal setelah pendaftaran berhasil
    } catch (error) {
      console.error("Registrasi gagal", error);
    }
  };

  return (
    <Box my={6} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as={"h3"} size={"md"} mb={4}>
          Add User
        </Heading>
        <Button colorScheme="teal" size={"sm"} onClick={onOpen}>
          Add User
        </Button>

        {/* Modal for User Registration */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Register New User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.name} mb={4}>
                  <FormLabel>Nama</FormLabel>
                  <Input type="text" {...register("name")} />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.email} mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...register("email")} />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password} mb={4}>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...register("password")} />
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.role} mb={4}>
                  <FormLabel>Role</FormLabel>
                  <Select placeholder="Pilih role" {...register("role")}>
                    <option value="admin">Admin</option>
                    <option value="examiner">Examiner</option>
                    <option value="student">Student</option>
                  </Select>
                  <FormErrorMessage>
                    {errors.role && errors.role.message}
                  </FormErrorMessage>
                </FormControl>

                <ModalFooter>
                  <Button colorScheme="teal" type="submit">
                    Register
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  );
};

export default AddUser;
