import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  IconButton,
  useToast,
  VStack,
  Box,
  Heading,
  Center,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import { getAllUsers, deleteUser } from "../services/userService";
import AddUser from "./AddUser";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = (userId) => {
    setSelectedUserId(userId);
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUserId);
      setUsers(users.filter((user) => user._id !== selectedUserId));
      toast({
        title: "User deleted",
        description: "User has been successfully deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsOpen(false);
      setSelectedUserId(null);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={6} maxW="1000px" mx="auto" mt={12}>
      <Heading as="h2" mb={6}>
        Manage Users
      </Heading>
      <VStack spacing={4}>
        <TableContainer>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user, index) => (
                <Tr key={user._id}>
                  <Td>{index + 1}</Td> {/* Kolom nomor */}
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <IconButton
                      aria-label="Delete user"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => confirmDelete(user._id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
      <AddUser onUserAdded={fetchUsers} />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ManageUsers;
