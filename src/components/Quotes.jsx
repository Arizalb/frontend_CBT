import { Box, Text, Icon, Stack } from "@chakra-ui/react";
import { FaQuoteLeft } from "react-icons/fa";

const quotes = [
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
];

export default function Quotes() {
  const random = Math.floor(Math.random() * quotes.length);
  const quote = quotes[random];
  return (
    <Box
      bg="teal.50"
      borderRadius="xl"
      p={6}
      mt={8}
      shadow="md"
      maxW="lg"
      mx="auto"
    >
      <Stack direction="row" align="flex-start" spacing={3}>
        <Icon as={FaQuoteLeft} color="teal.400" boxSize={6} mt={1} />
        <Box>
          <Text fontSize="lg" fontStyle="italic" color="teal.800">
            "{quote.text}"
          </Text>
          <Text fontWeight="bold" color="teal.600" mt={2}>
            — {quote.author}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
