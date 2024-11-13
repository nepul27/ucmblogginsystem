const express = require("express");

const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const Admin = require("../models/Admin");

const Answer = require("../models/Answer");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

const Question = require("../models/Question");
const router = express.Router();

router.post("/addanswer/:id", fetchuser, async (req, res) => {
  try {
    let newanswer = await Answer.create({
      questionid: req.params.id,
      answer: req.body.answer,
      postedId: req.user.id,
      postedBy: req.user.username,
      votes: [],
    });

    res.json({ Success: "Added Answer Successfully", status: true });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/fetchanswer", async (req, res) => {
  try {
    const answers = await Answer.find();
    res.json(answers);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/fetchanswer/:id", async (req, res) => {
  try {
    const answers = await Answer.find({ questionid: req.params.id });
    res.json(answers);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/userAnstoUpdate/:id", async (req, res) => {
  try {
    const answer = await Answer.findOne({ _id: req.params.id });
    res.json(answer);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/updateans/:id", async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(req.params.id, {
        $set: { answer: req.body.answer },
    });

    res.json({ status: "updated" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/fetchUserAnswers", async (req, res) => {
  try {
    const answers = await Answer.find();

    if (!answers) {
      return res.status(404).send("Question not Found");
    }
    res.json(answers);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchUserAnswers/:username", async (req, res) => {
  try {
    const answers = await Answer.find({ postedBy: req.params.username });

    if (!answers) {
      return res.status(404).send("Question not Found");
    }
    res.json(answers);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchUserFilteredAnswers/:username", async (req, res) => {
  try {
    const answers = await Answer.find({ postedBy: req.params.username });

    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const tags = req.body.tags;
    const status = req.body.status;

    if (!answers) {
      return res.status(404).send("Answers not Found");
    }

    const afterDateapplied = [];
    answers.map((ans) => {
      const year = ans.date.getUTCFullYear();
      var month = ans.date.getUTCMonth() + 1;
      var day = ans.date.getUTCDate();

      if (month >= "0" && month <= "9") month = "0" + month;
      if (day >= "0" && day <= "9") day = "0" + day;

      const date = year + "-" + month + "-" + day;

      if (date >= startDate && date <= endDate) {
        afterDateapplied.push(ans);
      }
    });

    const afterTagsapplied = [];
    var tagAppiled = false;
    if (tags) {
      for (i in afterDateapplied) {
        const que = await Question.find({
          _id: afterDateapplied[i].questionid,
        });
        if (que[0].tags.split(" ").includes(tags)) {
          afterTagsapplied.push(afterDateapplied[i]);
        }
      }
      tagAppiled = true;
    }

    const afterStatusApplied = [];
    var statusAppiled = false;
    if (status) {
      if (tagAppiled) {
        afterTagsapplied.map((ans) => {
          if (ans.status === status) {
            afterStatusApplied.push(ans);
          }
        });
      } else {
        afterDateapplied.map((ans) => {
          if ((ans.status = status)) {
            afterStatusApplied.push(ans);
          }
        });
      }
      statusAppiled = true;
    }

    if (statusAppiled) res.json(afterStatusApplied);
    else if (tagAppiled) res.json(afterTagsapplied);
    else {
      res.json(afterDateapplied);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchAllFilteredAnswers", async (req, res) => {
  try {
    const answers = await Answer.find();

    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const tags = req.body.tags;
    const status = req.body.status;

    if (!answers) {
      return res.status(404).send("Answers not Found");
    }

    const afterDateapplied = [];
    answers.map((ans) => {
      const year = ans.date.getUTCFullYear();
      var month = ans.date.getUTCMonth() + 1;
      var day = ans.date.getUTCDate();

      if (month >= "0" && month <= "9") month = "0" + month;
      if (day >= "0" && day <= "9") day = "0" + day;

      const date = year + "-" + month + "-" + day;

      if (date >= startDate && date <= endDate) {
        afterDateapplied.push(ans);
      }
    });

    const afterTagsapplied = [];
    var tagAppiled = false;
    if (tags) {
      for (i in afterDateapplied) {
        const que = await Question.find({
          _id: afterDateapplied[i].questionid,
        });
        if (que[0].tags.split(" ").includes(tags)) {
          afterTagsapplied.push(afterDateapplied[i]);
        }
      }
      tagAppiled = true;
    }

    const afterStatusApplied = [];
    var statusAppiled = false;
    if (status) {
      if (tagAppiled) {
        afterTagsapplied.map((ans) => {
          if (ans.status === status) {
            afterStatusApplied.push(ans);
          }
        });
      } else {
        afterDateapplied.map((ans) => {
          if ((ans.status = status)) {
            afterStatusApplied.push(ans);
          }
        });
      }
      statusAppiled = true;
    }

    if (statusAppiled) res.json(afterStatusApplied);
    else if (tagAppiled) res.json(afterTagsapplied);
    else {
      res.json(afterDateapplied);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/givenAllAnswersTags", async (req, res) => {
  try {
    const answers = await Answer.find();

    const questions = [];

    for (i in answers) {
      const question = await Question.find({ _id: answers[i].questionid });
      questions.push(question);
    }
    const tags = [];

    questions.map((que) => {
      que[0].tags.split(" ").map((tag) => {
        if (tags.indexOf(tag) == -1) tags.push(tag);
      });
    });

    res.json(tags);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/givenAnswersTags/:username", async (req, res) => {
  try {
    const answers = await Answer.find({ postedBy: req.params.username });

    const questions = [];

    for (i in answers) {
      const question = await Question.find({ _id: answers[i].questionid });
      questions.push(question);
    }
    const tags = [];

    questions.map((que) => {
      que[0].tags.split(" ").map((tag) => {
        if (tags.indexOf(tag) == -1) tags.push(tag);
      });
    });

    res.json(tags);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/fetchUserAnsweredQuestions/:username", async (req, res) => {
  try {
    const answers = await Answer.find({ postedBy: req.params.username });

    const questions = [];

    for (i in answers) {
      const question = await Question.find({ _id: answers[i].questionid });
      questions.push(question);
    }

    if (!questions) {
      return res.status(404).send("Question not Found");
    }

    res.json(questions);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/fetchUserAcceptedAnsweredQuestions/:username",
  async (req, res) => {
    try {
      const answers = await Answer.find({
        $and: [{ postedBy: req.params.username }, { status: "Accepted" }],
      });

      const questions = [];

      for (i in answers) {
        const question = await Question.find({ _id: answers[i].questionid });
        questions.push(question);
      }

      if (!questions) {
        return res.status(404).send("Question not Found");
      }

      res.json(questions);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/findNumberOfAns", async (req, res) => {
  try {
    const answers = await Answer.find();

    let obj = {};

    answers.map((answer) => {
      if (obj[answer.questionid] == null) {
        obj[answer.questionid] = 1;
      } else {
        obj[answer.questionid] += 1;
      }
    });

    res.json(obj);
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

    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ status: "answer_not_found" });
    }

    const existingVoteIndex = answer.votes.findIndex(vote => (vote.user.equals(user._id) && vote.direction === req.body.direction));
    console.log(existingVoteIndex);
    if (existingVoteIndex == 0) {
      return res.status(400).json({ status: "already_voted", message: "User has already voted on this answer." });
    } else {
      answer.votes.push({ user: user._id, direction: req.body.direction }); 
    }

    const updatedAnswer = await answer.save();
    res.json({ status: "voted", updatedAnswer });

  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/fetchVotes", async (req, res) => {
  const allAnswers = await Answer.find();
  const obj = {};

  allAnswers.map((ans) => {
    let upvotesCount = 0;
    let downvotesCount = 0;

    ans.votes.forEach(vote => {
      if (vote.direction === 'up') {
        upvotesCount++;
      } else if (vote.direction === 'down') {
        downvotesCount++;
      }
    });

    obj[ans._id] = upvotesCount - downvotesCount;
  });
  res.json(obj);
});

router.post("/acceptanswer/:id", async (req, res) => {
  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, {
      $set: { status: "Accepted" },
    });
    res.json({ status: "Accepted" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server error");
  }
});

router.post("/points", async (req, res) => {
  try {
    let username = localStorage.getItem("username");

    let answers = await Answer.find({
      $and: [{ postedBy: username }, { status: "Accepted" }],
    });

    res.json({ points: answers.length * 5 });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

router.post("/deleteans/:id", async (req, res) => {
  try {
    await Answer.deleteOne({ _id: req.params.id });

    res.json({ status: "deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Internal Server Error");
  }
});

module.exports = router;
