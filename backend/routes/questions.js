const express = require("express");
const Question = require("../models/Question");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Answer = require("../models/Answer");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

const fetchuser = require("../middleware/fetchuser");
const router = express.Router();

router.post("/addquestion", fetchuser, async (req, res) => {
  const userMembers = [];
  if (req.body.members != null && req.body.members.length > 0) {
    let members = req.body.members.split(',');
    for (member in members) {
      let user = await User.findOne({ username: members[member] });
      if (user != null) {
        userMembers.push(user._id);
      }
    }
  }

  try {
    let question = await Question.create({
      user: req.user.id,
      title: req.body.title,
      question: req.body.question,
      tags: req.body.tags,
      members: userMembers,
      postedBy: req.user.username,
      votes: [],
    });

    res.json({ Success: "Added Query Successfully", status: true });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/fetchquestions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions.reverse());
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

router.post("/fetchQueByHigherVotes", async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ votes: -1 });
    res.json(questions);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal server error");
  }
});

router.post("/fetchQueById/:id", async (req, res) => {
  try {
    let question = await Question.findOne({ _id: req.params.id });
    if (!question) {
      return res.status(404).send("Question not Found");
    }
    res.json(question);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/updateque/:id", async (req, res) => {
  try {
    const { title, question, tags } = req.body;
    const newquestion = {};

    newquestion.title = title;
    newquestion.question = question;
    newquestion.tags = tags;

    let fetchquestion = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: newquestion },
      { new: true }
    );
    if (!fetchquestion) {
      return res.status(404).send("Question not Found to update!");
    }
    res.json({ status: "updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/deleteque/:id", async (req, res) => {
  try {
    let deletequestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletequestion) {
      return res.status(404).send("Question not Found to delete!");
    }

    await Answer.deleteMany({ questionid: req.params.id });
    res.json({ status: "deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchUserQuestions/:username", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });

    const questions = await Question.find({ user: user._id });

    if (!questions) {
      return res.status(404).send("Question not Found");
    }
    res.json(questions);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchUserFilteredQuestions/:username", async (req, res) => {
  try {
    let user = "";
    if (localStorage.getItem("username") == "admin") {
      user = await Admin.findOne({ username: req.params.username });
    } else {
      user = await User.findOne({ username: req.params.username });
    }

    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const tags = req.body.tags;

    const questions = await Question.find({
      user: user._id,
    });

    if (!questions) {
      return res.status(404).send("Question not Found");
    }

    const afterDateapplied = [];
    questions.map((que) => {
      const year = que.date.getUTCFullYear();
      var month = que.date.getUTCMonth() + 1;
      var day = que.date.getUTCDate();

      if (month >= "0" && month <= "9") month = "0" + month;
      if (day >= "0" && day <= "9") day = "0" + day;

      const date = year + "-" + month + "-" + day;

      if (date >= startDate && date <= endDate) {
        afterDateapplied.push(que);
      }
    });

    const afterTagsapplied = [];
    if (tags) {
      afterDateapplied.map((que) => {
        if (que.tags.split(" ").includes(tags)) {
          afterTagsapplied.push(que);
        }
      });
      res.json(afterTagsapplied);
    } else {
      res.json(afterDateapplied);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchUserFilteredQuestions", async (req, res) => {
  try {
    let user = await User.find();

    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const tags = req.body.tags;

    const questions = await Question.find();

    if (!questions) {
      return res.status(404).send("Question not Found");
    }

    const afterDateapplied = [];
    questions.map((que) => {
      const year = que.date.getUTCFullYear();
      var month = que.date.getUTCMonth() + 1;
      var day = que.date.getUTCDate();

      if (month >= "0" && month <= "9") month = "0" + month;
      if (day >= "0" && day <= "9") day = "0" + day;

      const date = year + "-" + month + "-" + day;

      if (date >= startDate && date <= endDate) {
        afterDateapplied.push(que);
      }
    });

    const afterTagsapplied = [];
    if (tags) {
      afterDateapplied.map((que) => {
        if (que.tags.split(" ").includes(tags)) {
          afterTagsapplied.push(que);
        }
      });
      res.json(afterTagsapplied);
    } else {
      res.json(afterDateapplied);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/usedtags", async (req, res) => {
  try {
    let user = await User.find();
    const questions = await Question.find();

    const tags = [];

    questions.map((que) => {
      que.tags.split(" ").map((tag) => {
        if (tags.indexOf(tag) == -1) tags.push(tag);
      });
    });

    res.json(tags);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/usedtags/:username", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    const questions = await Question.find({
      user: user._id,
    });

    const tags = [];

    questions.map((que) => {
      que.tags.split(" ").map((tag) => {
        if (tags.indexOf(tag) == -1) tags.push(tag);
      });
    });

    res.json(tags);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/vote/:id", async (req, res) => {
  try {
    let user = await User.findOne({username: req.body.username});
    if (!user) {
      user = await Admin.findOne({username: req.body.username});
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ status: "question_not_found" });
    }

    const existingVoteIndex = question.votes.findIndex(vote => (vote.user.equals(user._id) && vote.direction === req.body.direction));
    if (existingVoteIndex !== -1) {
      return res.status(400).json({ status: "already_voted", message: "User has already voted on this question." });
    } else {
      question.votes.push({ user: user._id, direction: req.body.direction }); 
    }

    const updatedQuestion = await question.save();
    res.json({ status: "voted", updatedQuestion });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/fetchVotes/:id", async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({ status: "question_not_found" });
  }

  let upvotesCount = 0;
  let downvotesCount = 0;

  question.votes.forEach(vote => {
    if (vote.direction === 'up') {
      upvotesCount++;
    } else if (vote.direction === 'down') {
      downvotesCount++;
    }
  });

  res.json({ upvotesCount, downvotesCount });
});

router.post("/fetchallVotes", async (req, res) => {
  const allQuestion = await Question.find();
  const obj = {};

  allQuestion.map((que) => {
    let upvotesCount = 0;
    let downvotesCount = 0;

    que.votes.forEach(vote => {
      if (vote.direction === 'up') {
        upvotesCount++;
      } else if (vote.direction === 'down') {
        downvotesCount++;
      }
    });
    
    obj[que._id] = upvotesCount - downvotesCount;
  });
  res.json(obj);
});

router.post("/fetchQuePertag/:name", async (req, res) => {
  const questions = await Question.find();
  const questionsPertag = [];

  questions.map((que) => {
    que.tags.split(" ").map((tag) => {
      if (tag.toLowerCase() === req.params.name) {
        questionsPertag.push(que);
      }
    });
  });
  res.json(questionsPertag);
});

router.post("/answeredQue", async (req, res) => {
  const answers = await Answer.find();
  const questions = await Question.find();

  let ansobj = {};

  answers.map((ans) => {
    if (ansobj[ans.questionid] == null) {
      ansobj[ans.questionid] = 1;
    }
  });
  const answeredQuestion = [];

  questions.map((que) => {
    if (ansobj[que._id] === 1) {
      answeredQuestion.push(que);
    }
  });

  res.json(answeredQuestion);
});

router.post("/unansweredQue", async (req, res) => {
  const answers = await Answer.find();
  const questions = await Question.find();

  let ansobj = {};

  answers.map((ans) => {
    if (ansobj[ans.questionid] == null) {
      ansobj[ans.questionid] = 1;
    }
  });
  const unansweredQuestion = [];

  questions.map((que) => {
    if (ansobj[que._id] == null) {
      unansweredQuestion.push(que);
    }
  });

  res.json(unansweredQuestion);
});

router.post("/search", async (req, res) => {
  try {
    const keywords = req.query.keyword.split(',').map(keyword => new RegExp(keyword.trim(), 'i'));
    let questions = await Question.find({
      title: { $in: keywords },
    });

    if (questions && questions.length <= 0) {
      questions = await Question.find({
        tags: { $in: keywords },
      });
    }

    res.json(questions);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});


router.post("/search/:tag", async (req, res) => {
  try {
    const tag = new RegExp(req.params.tag.trim());

    let questions = await Question.find({
      tags: { $in: tag },
    });

    res.json(questions);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
