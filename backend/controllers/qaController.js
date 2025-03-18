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
  const userId = req.user.id;

  try {
    const question = await QA.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ error: 'Answer not found' });

    const likedIndex = answer.likedBy.indexOf(userId);
    const dislikedIndex = answer.dislikedBy.indexOf(userId);

    if (likedIndex !== -1) {
      answer.likedBy.splice(likedIndex, 1);
      answer.likes -= 1;
    } else {
      answer.likedBy.push(userId);
      answer.likes += 1;

      if (dislikedIndex !== -1) {
        answer.dislikedBy.splice(dislikedIndex, 1);
        answer.dislikes -= 1;
      }
    }

    await question.save();
    res.status(200).json({ message: 'Like toggled', answer });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

exports.dislike = async (req, res) => {
  const { questionId, answerId } = req.params;
  const userId = req.user.id;

  try {
    const question = await QA.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ error: 'Answer not found' });

    const dislikedIndex = answer.dislikedBy.indexOf(userId);
    const likedIndex = answer.likedBy.indexOf(userId);

    if (dislikedIndex !== -1) {
      answer.dislikedBy.splice(dislikedIndex, 1);
      answer.dislikes -= 1;
    } else {
      answer.dislikedBy.push(userId);
      answer.dislikes += 1;

      if (likedIndex !== -1) {
        answer.likedBy.splice(likedIndex, 1);
        answer.likes -= 1;
      }
    }

    await question.save();
    res.status(200).json({ message: 'Dislike toggled', answer });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

exports.getMyQuestions = async (req, res) => {
  try {
    const userId = req.user.id; 

    const myQuestions = await QA.find({ userId })
      .populate('userId', 'name profileImage')
      .populate('answers.userId', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(myQuestions);
  } catch (error) {
    console.error('Error fetching user questions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
