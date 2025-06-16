import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export default function InfoCBT() {
  const infoCBTBg = useColorModeValue("purple.50", "gray.700");
  const headingColor = useColorModeValue("purple.700", "purple.200");
  const textColor = useColorModeValue("purple.800", "purple.100");
  const subHeadingColor = useColorModeValue("purple.600", "purple.300");
  const listColor = useColorModeValue("purple.700", "purple.100");

  return (
    <Box
      bg={infoCBTBg}
      color={textColor}
      borderRadius="xl"
      p={6}
      shadow="md"
      mb={8}
    >
      <Heading size="md" color={headingColor} mb={2}>
        Apa itu Computer Based Test (CBT)?
      </Heading>
      <Text color={textColor} mb={3}>
        CBT adalah sistem ujian berbasis komputer yang memudahkan pelaksanaan,
        penilaian, dan pengelolaan ujian secara digital.
      </Text>
      <Heading size="sm" color={subHeadingColor} mb={2}>
        Keunggulan CBT:
      </Heading>
      <List spacing={2} color={listColor}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="teal.400" />
          Praktis dan efisien, tanpa kertas.
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="teal.400" />
          Penilaian otomatis dan cepat.
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="teal.400" />
          Data hasil ujian tersimpan rapi dan aman.
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="teal.400" />
          Dapat diakses dari mana saja.
        </ListItem>
      </List>
    </Box>
  );
}
