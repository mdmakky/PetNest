import React, { useState, useEffect } from "react";
import { Button, TextField, IconButton, CircularProgress, Typography, Box, Switch, FormControlLabel } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import PetsIcon from "@mui/icons-material/Pets";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./QuestionAnswer.css";

const QuestionAnswer = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showMyQuestions, setShowMyQuestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const questionsPerPage = 10;

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, showMyQuestions]);

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, showMyQuestions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (showMyQuestions && !token) {
        toast.error("You must be logged in to view your questions.");
        setLoading(false);
        return;
      }
      const url = showMyQuestions
        ? `http://localhost:3000/api/qa/getMyQuestions`
        : "http://localhost:3000/api/qa/getQuestions";
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setQuestions(Array.isArray(data) ? data : []); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]); 
      setLoading(false);
    }
  };
  

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;
    if (!localStorage.getItem("token")) {
      toast.error("Please login first");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/qa/addQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ question: newQuestion }),
      });
      if (response.ok) {
        setNewQuestion("");
        fetchQuestions();
      } else {
        console.error("Error adding question");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAddAnswer = async (questionId, answerText) => {
    if (!localStorage.getItem("token")) {
      toast.error("Please login first");
      return;
    }
    if (!answerText.trim()) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/qa/${questionId}/answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ answerText }),
        }
      );
      if (response.ok) {
        setAnswers({ ...answers, [questionId]: "" });
        fetchQuestions();
      } else {
        console.error("Error adding answer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLike = async (questionId, answerId) => {
    if (!localStorage.getItem("token")) {
      toast.error("Please login first");
      return;
    }
    const updatedAnswers = questions.map((question) =>
      question._id === questionId
        ? {
            ...question,
            answers: question.answers.map((answer) =>
              answer._id === answerId
                ? {
                    ...answer,
                    likes: isLiked(answer)
                      ? answer.likes - 1
                      : answer.likes + 1,
                    likedBy: isLiked(answer)
                      ? answer.likedBy.filter(
                          (id) => id !== localStorage.getItem("userId")
                        )
                      : [...answer.likedBy, localStorage.getItem("userId")],
                    dislikes: isDisliked(answer)
                      ? answer.dislikes - 1
                      : answer.dislikes,
                    dislikedBy: isDisliked(answer)
                      ? answer.dislikedBy.filter(
                          (id) => id !== localStorage.getItem("userId")
                        )
                      : answer.dislikedBy,
                  }
                : answer
            ),
          }
        : question
    );
    setQuestions(updatedAnswers);

    try {
      const response = await fetch(
        `http://localhost:3000/api/qa/${questionId}/${answerId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like the answer");
      }
    } catch (error) {
      console.error("Error adding like:", error);
      setQuestions(questions);
    }
  };

  const handleDislike = async (questionId, answerId) => {
    if (!localStorage.getItem("token")) {
      toast.error("Please login first");
      return;
    }
    const updatedAnswers = questions.map((question) =>
      question._id === questionId
        ? {
            ...question,
            answers: question.answers.map((answer) =>
              answer._id === answerId
                ? {
                    ...answer,
                    dislikes: isDisliked(answer)
                      ? answer.dislikes - 1
                      : answer.dislikes + 1,
                    dislikedBy: isDisliked(answer)
                      ? answer.dislikedBy.filter(
                          (id) => id !== localStorage.getItem("userId")
                        )
                      : [...answer.dislikedBy, localStorage.getItem("userId")],
                    likes: isLiked(answer) ? answer.likes - 1 : answer.likes,
                    likedBy: isLiked(answer)
                      ? answer.likedBy.filter(
                          (id) => id !== localStorage.getItem("userId")
                        )
                      : answer.likedBy,
                  }
                : answer
            ),
          }
        : question
    );
    setQuestions(updatedAnswers);

    try {
      const response = await fetch(
        `http://localhost:3000/api/qa/${questionId}/${answerId}/dislike`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to dislike the answer");
      }
    } catch (error) {
      console.error("Error adding dislike:", error);
      setQuestions(questions);
    }
  };

  const isLiked = (answer) => {
    console.log(localStorage.getItem("userId"));
    return answer.likedBy.includes(localStorage.getItem("userId"));
  };

  const isDisliked = (answer) => {
    return answer.dislikedBy.includes(localStorage.getItem("userId"));
  };

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  return (
    <div>
      <NavBar />
      <div className="qa-page">
        <div className="ask-question-section">
        <FormControlLabel
          control={
            <Switch
              checked={showMyQuestions}
              onChange={() => setShowMyQuestions(!showMyQuestions)}
              color="primary"
            />
          }
          label={showMyQuestions ? "My Questions" : "All Questions"}
          className="toggleLable"
        />
          <TextField
            fullWidth
            label="Any Question?"
            variant="outlined"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAskQuestion}
            endIcon={<QuestionAnswerIcon />}
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 500
            }}
          >
            Ask
          </Button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <CircularProgress />
          </div>
        ) : (
          <div className="questions-list">
            {currentQuestions.map((question) => (
              <div key={question._id} className="question-container">
                <p className="head">Question</p>
                <div className="question-header">
                  <img
                    src={question.userId?.profileImage || "default-avatar.jpg"}
                    alt={question.userId?.name || "Anonymous"}
                    className="user-avatar"
                  />
                  <span>{question.userId?.name || "Anonymous"}</span>
                  <span className="timestamp">
                    {new Date(question.createdAt).toLocaleString()}
                  </span>
                </div>
                <h2>{question.question}</h2>
                <div className="answers-list">
                  <p className="head">Answers</p>
                  {question.answers.length > 0 ? (
                    <>
                      {question.answers
                        .slice(
                          0,
                          question.showMore ? question.answers.length : 5
                        )
                        .map((answer) => (
                          <div key={answer._id} className="answer-container">
                            <div className="answer-header">
                              <img
                                src={
                                  answer.userId?.profileImage ||
                                  "default-avatar.jpg"
                                }
                                alt={answer.userId?.name || "Anonymous"}
                                className="user-avatar"
                              />
                              <span>{answer.userId?.name || "Anonymous"}</span>
                              <span className="timestamp">
                                {new Date(answer.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p>{answer.answerText}</p>
                            <div className="qa-actions">
                              <IconButton
                                color={isLiked(answer) ? "primary" : "default"}
                                onClick={() =>
                                  handleLike(question._id, answer._id)
                                }
                                disableRipple
                                sx={{
                                  transition:
                                    "transform 0.2s ease, background-color 0.2s ease",
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                    transform: "scale(1.2)",
                                  },
                                }}
                              >
                                <ThumbUpIcon /> {answer.likes || 0}
                              </IconButton>

                              <IconButton
                                color={
                                  isDisliked(answer) ? "secondary" : "default"
                                }
                                onClick={() =>
                                  handleDislike(question._id, answer._id)
                                }
                                disableRipple
                                sx={{
                                  transition:
                                    "transform 0.2s ease, background-color 0.2s ease",
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                    transform: "scale(1.2)",
                                  },
                                }}
                              >
                                <ThumbDownIcon /> {answer.dislikes || 0}
                              </IconButton>
                            </div>
                          </div>
                        ))}
                      {question.answers.length > 5 && !question.showMore && (
                        <Button
                          variant="text"
                          onClick={() =>
                            setQuestions((prevQuestions) =>
                              prevQuestions.map((q) =>
                                q._id === question._id
                                  ? { ...q, showMore: true }
                                  : q
                              )
                            )
                          }
                        >
                          See More
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="no-answers">No answers yet.</p>
                  )}
                </div>
                <div className="add-answer-section">
                  <TextField
                    fullWidth
                    label="Add an answer"
                    variant="outlined"
                    value={answers[question._id] || ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [question._id]: e.target.value })
                    }
                    required
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleAddAnswer(question._id, answers[question._id] || "")
                    }
                    endIcon={<QuestionAnswerIcon />}
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500
                    }}
                  >
                    Give Answer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pagination">
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            startIcon={<PetsIcon />}
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 500
            }}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            endIcon={<PetsIcon />}
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 500
            }}
          >
            Next
          </Button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default QuestionAnswer;