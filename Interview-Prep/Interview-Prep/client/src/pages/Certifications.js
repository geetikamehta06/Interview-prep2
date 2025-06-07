import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Progress,
  Badge,
  Card,
  CardBody,
  Divider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  Flex,
} from '@chakra-ui/react';
import { FaDownload, FaSave } from 'react-icons/fa';

const mcqQuestions = [
  {
    id: 1,
    question: "What is React's Virtual DOM?",
    options: [
      "A direct copy of the actual DOM",
      "A lightweight copy of the actual DOM",
      "A programming language",
      "A web browser feature"
    ],
    correctAnswer: 1, // Index of correct answer
  },
  {
    id: 2,
    question: "Which hook is used for side effects in React?",
    options: [
      "useState",
      "useEffect",
      "useContext",
      "useReducer"
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is the purpose of useState hook?",
    options: [
      "To make HTTP requests",
      "To manage component state",
      "To handle routing",
      "To optimize performance"
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "What is JSX?",
    options: [
      "A database",
      "A styling framework",
      "A JavaScript extension for React",
      "A testing library"
    ],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "Which method is used to prevent default form submission in React?",
    options: [
      "preventDefault()",
      "stopPropagation()",
      "stopDefault()",
      "cancelSubmit()"
    ],
    correctAnswer: 0,
  }
];

const Certificate = ({ score, date }) => {
  return (
    <Box
      w="100%"
      p={8}
      borderWidth="2px"
      borderColor="gold"
      borderRadius="lg"
      bg="white"
      color="black"
      position="relative"
      backgroundImage="linear-gradient(45deg, #f3f3f3 25%, transparent 25%, transparent 75%, #f3f3f3 75%, #f3f3f3), linear-gradient(45deg, #f3f3f3 25%, transparent 25%, transparent 75%, #f3f3f3 75%, #f3f3f3)"
      backgroundSize="20px 20px"
      backgroundPosition="0 0, 10px 10px"
    >
      <VStack spacing={6}>
        <Box textAlign="center">
          <Text fontSize="sm" color="gray.500">Certificate of Completion</Text>
          <Heading size="lg" color="blue.600" mt={2}>React Development Certification</Heading>
        </Box>

        <Box textAlign="center" py={4}>
          <Text fontSize="md">This is to certify that you have successfully completed</Text>
          <Text fontSize="md">the React Development Assessment with a score of</Text>
          <Heading size="xl" color="green.500" mt={4}>
            {score.toFixed(2)}%
          </Heading>
        </Box>

        <Divider borderColor="gray.300" />

        <Box textAlign="center" w="100%">
          <Text fontSize="sm" color="gray.600">Date of Completion</Text>
          <Text fontSize="md" fontWeight="bold">{date}</Text>
        </Box>

        <Box position="absolute" bottom="4" right="4">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
            alt="React Logo"
            boxSize="50px"
            opacity={0.2}
          />
        </Box>
      </VStack>
    </Box>
  );
};

const Certifications = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [certificateScore, setCertificateScore] = useState(0);
  const [completionDate, setCompletionDate] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const certificateRef = useRef(null);

  const handleAnswerSelect = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion]: parseInt(value)
    });
  };

  const handleNext = () => {
    if (currentQuestion < mcqQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    Object.keys(answers).forEach(questionIndex => {
      if (answers[questionIndex] === mcqQuestions[questionIndex].correctAnswer) {
        correct++;
      }
    });
    return (correct / mcqQuestions.length) * 100;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    setCertificateScore(score);
    setCompletionDate(currentDate);
    setShowResults(true);
    onOpen();
    
    // Save certificate data to localStorage
    const certificateData = {
      score,
      date: currentDate,
      answers,
      questions: mcqQuestions
    };
    localStorage.setItem('reactCertificate', JSON.stringify(certificateData));
    
    toast({
      title: "Test Submitted!",
      description: `Your score: ${score.toFixed(2)}%`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSaveCertificate = () => {
    const certificateData = {
      score: certificateScore,
      date: completionDate,
      answers,
      questions: mcqQuestions
    };
    
    // Create a download link for the certificate data
    const dataStr = JSON.stringify(certificateData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `react-certificate-${completionDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Certificate Saved!",
      description: "Your certificate has been downloaded successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setCertificateScore(0);
    onClose();
  };

  return (
    <Container maxW="container.md" py={8}>
      {!showResults ? (
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={2}>React Certification Test</Heading>
            <Text color="gray.500">Complete all questions to get certified</Text>
          </Box>

          <Progress value={(Object.keys(answers).length / mcqQuestions.length) * 100} colorScheme="blue" mb={4} />

          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="lg" fontWeight="bold">
                  Question {currentQuestion + 1} of {mcqQuestions.length}
                </Text>
                <Text>{mcqQuestions[currentQuestion].question}</Text>

                <RadioGroup
                  onChange={handleAnswerSelect}
                  value={answers[currentQuestion]}
                >
                  <Stack spacing={3}>
                    {mcqQuestions[currentQuestion].options.map((option, index) => (
                      <Radio key={index} value={index}>
                        {option}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </VStack>
            </CardBody>
          </Card>

          <Stack direction="row" spacing={4} justify="space-between">
            <Button
              onClick={handlePrevious}
              isDisabled={currentQuestion === 0}
              colorScheme="gray"
            >
              Previous
            </Button>
            {currentQuestion === mcqQuestions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                colorScheme="green"
                isDisabled={Object.keys(answers).length !== mcqQuestions.length}
              >
                Submit Test
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                colorScheme="blue"
                isDisabled={!answers.hasOwnProperty(currentQuestion)}
              >
                Next
              </Button>
            )}
          </Stack>
        </VStack>
      ) : (
        <VStack spacing={8} align="stretch">
          <Box ref={certificateRef}>
            <Certificate score={certificateScore} date={completionDate} />
          </Box>
          
          <Flex justify="center" gap={4}>
            <Button
              leftIcon={<FaSave />}
              colorScheme="blue"
              onClick={handleSaveCertificate}
            >
              Save Certificate
            </Button>
            <Button
              colorScheme="gray"
              onClick={handleRetake}
            >
              Retake Test
            </Button>
          </Flex>
        </VStack>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Certification Results</ModalHeader>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Heading size="lg" mb={2}>
                  Your Score: {certificateScore.toFixed(2)}%
                </Heading>
                <Badge
                  colorScheme={certificateScore >= 70 ? "green" : "red"}
                  fontSize="lg"
                  p={2}
                >
                  {certificateScore >= 70 ? "PASSED" : "FAILED"}
                </Badge>
              </Box>

              <Divider />

              <VStack spacing={4} align="stretch">
                {mcqQuestions.map((q, index) => (
                  <Box key={q.id} p={4} borderWidth="1px" borderRadius="md">
                    <Text fontWeight="bold" mb={2}>
                      {index + 1}. {q.question}
                    </Text>
                    <Text color={answers[index] === q.correctAnswer ? "green.500" : "red.500"}>
                      Your Answer: {q.options[answers[index]]}
                    </Text>
                    <Text color="green.500">
                      Correct Answer: {q.options[q.correctAnswer]}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              View Certificate
            </Button>
            <Button variant="ghost" onClick={handleRetake}>
              Retake Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Certifications;