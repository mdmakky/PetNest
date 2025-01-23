const QA = require('../models/QA');

exports.getQuestions = async (req, res) => {
  try {
    const questions = await QA.find()
      .populate('userId', 'name profileImage') 
      .populate('answers.userId', 'name profileImage') 
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.addQuestion = async (req, res) => {
    try {
      const { question } = req.body;
      const userId = req.user.id;
      const newQuestion = new QA({ question, userId });
      const savedQuestion = await newQuestion.save();
      res.status(201).json(savedQuestion);
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ message: 'Server Error' });
    }
};

exports.addAnswer = async (req, res) => {
    try {
      const { questionId } = req.params;
      const { answerText } = req.body;
      const userId = req.user.id;
  
      const question = await QA.findById(questionId);
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      const answer = { userId, answerText };
      question.answers.push(answer);
      await question.save();
  
      res.status(201).json({ message: 'Answer added successfully', question });
    } catch (error) {
      console.error('Error adding answer:', error);
      res.status(500).json({ message: 'Server Error' });
    }
};

exports.like = async (req, res) => {
    const { questionId, answerId } = req.params;

    try {
      const question = await QA.findById(questionId);
      if (!question) return res.status(404).json({ error: 'Question not found' });
  
      const answer = question.answers.id(answerId);
      if (!answer) return res.status(404).json({ error: 'Answer not found' });
  
      answer.likes += 1;
      await question.save();
  
      res.status(200).json({ message: 'Like added', answer });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
}

exports.dislike = async (req, res) => {
    const { questionId, answerId } = req.params;

    try {
      const question = await QA.findById(questionId);
      if (!question) return res.status(404).json({ error: 'Question not found' });
  
      const answer = question.answers.id(answerId);
      if (!answer) return res.status(404).json({ error: 'Answer not found' });
  
      answer.dislikes += 1;
      await question.save();
  
      res.status(200).json({ message: 'Dislike added', answer });
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
}

  
  