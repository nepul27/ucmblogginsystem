import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";

export default function Content(props) {
  const navigate = useNavigate();
  const editor = useRef(null);
  const params = useParams();
  const [value, setValue] = useState("");
  const [question, setQuestion] = useState([]);
  const [html, setHtml] = useState("");
  const [state, setState] = useState(false);
  const [answers, setAnswer] = useState([]);
  const [vote, setVotes] = useState({});
  const [voteStatus, setVoteStatus] = useState({});
  const [loginstatus, setloginstatus] = useState(false);
  const [quevoteStatus, setqueVoteStatus] = useState({});
  const [qvStatus, setQvStatus] = useState(false);
  const [avStatus, setAvStatus] = useState(false);
  const [cantVoteStatus, setCantVoteStatus] = useState(false);
  const [queVote, setQueVote] = useState();
  const [show, setShow] = useState(false);
  const [comments, setComment] = useState({});
  const [commentState, setCommentState] = useState(false);

  const config = useMemo(
    () => ({
      buttons: [
        "bold",
        "italic",
        "link",
        "unlink",
        "ul",
        "ol",
        "underline",
        "image",
        "font",
        "fontsize",
        "brush",
        "redo",
        "undo",
        "eraser",
        "table",
      ],
    }),
    []
  );

  const isLoggedIn = () => {
    if (localStorage.getItem("username") !== null) {
      setloginstatus(true);
    }
  };
  const fetchQuestion = async (id) => {
    await fetch(`http://localhost:5000/api/question/fetchQueById/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setQuestion(data);
        setHtml(parse(data.question));
      });
  };

  const fetchAnswers = async (id) => {
    await fetch(`http://localhost:5000/api/answer/fetchanswer/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAnswer(data);
      });
  };

  const getValue = (newvalue) => {
    setValue(newvalue);
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:5000/api/answer/addanswer/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ answer: value }),
      }
    );

    const json = await response.json();

    if (json["status"] === true) {
      setState(true);
      setValue("");
      window.scrollTo(0, 0);
    }
  };

  const upvoteQue = async (e, id) => {
    if (localStorage.getItem("username") !== null) {
      e.preventDefault();
      // document.getElementById("quedownvotbtn").disabled = false;
      // document.getElementById("queupvotebtn").disabled = true;

      const response = await fetch(
        `http://localhost:5000/api/question/vote/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: localStorage.getItem("username"),
            direction: 'up'
          }),
        }
      );

      let json = await response.json();
      setqueVoteStatus(json);
      if (json.status === 'voted') {
        setQvStatus(true);
        window.scrollTo(0,0);
      } else if (json.status === 'already_voted') {
        setCantVoteStatus(true);
        window.scrollTo(0,0);
      }
    } else {
      navigate("/login");
    }
  };

  const downvoteQue = async (e, id) => {
    if (localStorage.getItem("username") !== null) {
      e.preventDefault();
      // document.getElementById("quedownvotbtn").disabled = true;
      // document.getElementById("queupvotebtn").disabled = false;

      const response = await fetch(
        `http://localhost:5000/api/question/vote/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: localStorage.getItem("username"),
            direction: 'down'
          }),
        }
      );

      let json = await response.json();

      setqueVoteStatus(json);
      if (json.status === 'voted') {
        setQvStatus(true);
        window.scrollTo(0,0);
      } else if (json.status === 'already_voted') {
        setCantVoteStatus(true);
        window.scrollTo(0,0);
      }
    } else {
      navigate("/login");
    }
  };

  const upvote = async (e, id) => {
    if (localStorage.getItem("username") !== null) {
      e.preventDefault();
      // document.getElementById("ansdownvotebtn" + id).disabled = false;
      // document.getElementById("ansupvotebtn" + id).disabled = true;

      const response = await fetch(
        `http://localhost:5000/api/answer/vote/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: localStorage.getItem("username"),
            direction: 'up'
          }),
        }
      );

      let json = await response.json();

      setVoteStatus(json);
      console.log(json.status);
      if (json.status === 'voted') {
        setAvStatus(true);
        window.scrollTo(0,0);
      } else if (json.status === 'already_voted') {
        setCantVoteStatus(true);
        window.scrollTo(0,0);
      }
    } else {
      navigate("/login");
    }
  };

  const downvote = async (e, id) => {
    if (localStorage.getItem("username") !== null) {
      e.preventDefault();

      // document.getElementById("ansdownvotebtn" + id).disabled = true;
      // document.getElementById("ansupvotebtn" + id).disabled = false;

      const response = await fetch(
        `http://localhost:5000/api/answer/vote/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: localStorage.getItem("username"),
            direction: 'down'
          }),
        }
      );

      let json = await response.json();

      setVoteStatus(json);
      if (json.status === 'voted') {
        setAvStatus(true);
        window.scrollTo(0,0);
      } else if (json.status === 'already_voted') {
        setCantVoteStatus(true);
        window.scrollTo(0,0);
      }
    } else {
      navigate("/login");
    }
  };

  const fetchVotes = async () => {
    const response = await fetch(
      `http://localhost:5000/api/answer/fetchVotes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let json = await response.json();

    setVotes(json);
  };

  const fetchQueVotes = async (id) => {
    const response = await fetch(
      `http://localhost:5000/api/question/fetchVotes/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let json = await response.json();

    setQueVote(json.upvotesCount - json.downvotesCount);
  };

  const onChange = (e) => {
    setComment({ ...comments, [e.target.name]: e.target.value });
  };

  const addComment = async (e, id) => {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:5000/api/comment/addcomment/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: comments.comment, qid: question._id }),
      }
    );

    const json = await response.json();

    if (json["status"] === true) {
      setCommentState(true);
      setShow(false);
      window.scrollTo(0, 0);
    }
  };

  const fetchComments = async (id) => {
    await fetch(`http://localhost:5000/api/comment/fetchComments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ qid: question._id, ansid: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setComment((prevCommentsByAnswer) => ({
          ...prevCommentsByAnswer,
          [id]: data,
        }));
      });
  };

  const fetchCommentsForAllAnswers = async () => {
    for (const answer of answers) {
      await fetchComments(answer._id);
    }
  };

  useEffect(() => {
    isLoggedIn();
    fetchQuestion(params.type);
    fetchAnswers(params.type);
    fetchVotes();
    fetchQueVotes(params.type);
    fetchCommentsForAllAnswers();
  }, [state, voteStatus, quevoteStatus, question, cantVoteStatus]);

  return (
    <div Style="height:100vh; margin-top:13vh; z-index:1; background-color:white">
      {(() => {
        if (state === true) {
          return (
            <>
              <div
                className="alert alert-success alert-dismissible"
                role="alert"
              >
                Your Answer is Posted <strong>Successfully</strong>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </>
          );
        }
      })()}

      {(() => {
        if (qvStatus === true) {
          return (
            <>
              <div
                className="alert alert-success alert-dismissible"
                role="alert"
              >
                You Voted for Question <strong>Successfully</strong>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </>
          );
        }
      })()}

      {(() => {
        if (avStatus === true) {
          return (
            <>
              <div
                className="alert alert-success alert-dismissible"
                role="alert"
              >
                You Voted for Answer <strong>Successfully</strong>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </>
          );
        }
      })()}

      {(() => {
        if (cantVoteStatus === true) {
          return (
            <>
              <div
                className="alert alert-warning alert-dismissible"
                role="alert"
              >
                You can't vote again!
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </>
          );
        }
      })()}

      {(() => {
        if (commentState === true) {
          return (
            <>
              <div
                className="alert alert-success alert-dismissible"
                role="alert"
              >
                Your Comment is Posted <strong>Successfully</strong>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </>
          );
        }
      })()}
      <div
        className="container"
        Style="height:100vh;width:70%;display:block; margin:auto;"
      >
        <div className="d-flex flex-row">
          <div className="d-flex flex-column col-md-0 mt-0 mx-0">
            <button
              className="btn btn-white"
              id="queupvotebtn"
              onClick={(e) => upvoteQue(e, question._id)}
              Style="width:15px; border:none;"
            >
              <i className="fa fa-caret-up" Style="font-size: 35px;"></i>
            </button>
            <div className="mx-3">{queVote}</div>
            <button
              className="btn btn-white"
              id="quedownvotbtn"
              onClick={(e) => downvoteQue(e, question._id)}
              Style="width:15px; border:none;"
            >
              <i className="fa fa-caret-down" Style="font-size: 35px;"></i>
            </button>
          </div>
          <div className="d-flex flex-column flex-shrink-0 col-md-9 mx-0">
            <h1>{question.title}</h1>
            <div className="mt-5">{html}</div>
          </div>
        </div>
        <hr
          Style={{
            background: "black",
            height: "2px",
            border: "none",
          }}
        />
        <hr />

        <h4>{answers.length} Answers</h4>
        {answers.length > 0 && (
          <div className="mt-5">
            {answers.map((ans) => (
              <div className="">
                <div className="d-flex flex-row">
                  <div className="d-flex flex-column col-md-0 mt-0 mx-0">
                    <button
                      className="btn btn-white"
                      id={"ansupvotebtn" + ans._id}
                      onClick={(e) => upvote(e, ans._id)}
                      Style="width:15px; border:none;"
                    >
                      <i
                        className="fa fa-caret-up"
                        Style="font-size: 35px;"
                      ></i>
                    </button>
                    <div className="mx-3">{vote[ans._id]}</div>
                    <button
                      className="btn btn-white"
                      id={"ansdownvotebtn" + ans._id}
                      onClick={(e) => downvote(e, ans._id)}
                      Style="width:15px; border:none;"
                    >
                      <i
                        className="fa fa-caret-down"
                        Style="font-size: 35px;"
                      ></i>
                    </button>
                    {(() => {
                      if (ans.status === "Accepted") {
                        return (
                          <>
                            <button className="btn btn-white">
                              <i
                                className="fa fa-check"
                                Style="font-size:25px;color:lightgreen;"
                              ></i>
                            </button>
                          </>
                        );
                      }
                    })()}
                  </div>
                  <div className="d-flex flex-column flex-shrink-0 col-md-9 mx-0">
                    <p>{parse(ans.answer)}</p>

                    <small className="d-flex flex-row-reverse">
                      Posted By : {ans.postedBy}
                    </small>

                    <hr
                      Style={{
                        background: "#959595",
                        height: "2px",
                        border: "none",
                      }}
                    />
                    <div
                      className="comments"
                      Style="display:relative; bottom:0px;"
                    >
                      {comments[ans._id]?.map((comment) => (
                        <div className="comment">
                          <p>
                            {comment.comment}
                            <span> -- {comment.postedBy}</span>
                            <small>
                              {" "}
                              {comment.date.slice(0, 10)} at{" "}
                              {comment.date.slice(12, 16)}
                            </small>
                          </p>
                        </div>
                      ))}
                      {loginstatus === true ? (
                        <p onClick={() => setShow(!show)}>Add a comment</p>
                      ) : (
                        <p onClick={() => navigate("/login")}>Add a comment</p>
                      )}
                      {show && (
                        <div className="title">
                          <form
                            method="POST"
                            onSubmit={(e) => addComment(e, ans._id)}
                          >
                            <textarea
                              type="text"
                              placeholder="Add Your comment.."
                              rows={5}
                              cols={100}
                              name="comment"
                              onChange={onChange}
                            ></textarea>
                            <br></br>
                            <button type="submit" className="btn btn-primary">
                              Add comment
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <hr
                  Style={{
                    background: "#959595",
                    height: "2px",
                    border: "none",
                  }}
                />
                <hr />
              </div>
            ))}
          </div>
        )}
        {loginstatus === true ? <h4>Your Answer</h4> : <></>}
        <form onSubmit={(e) => handleSubmit(e, question._id)} method="POST">
          {loginstatus === true ? (
            <JoditEditor
              ref={editor}
              config={config}
              tabIndex={1}
              value={value}
              onChange={(newContent) => getValue(newContent)}
            />
          ) : (
            <></>
          )}

          {loginstatus === true ? (
            <button type="submit" className="btn btn-primary mt-5 mb-3">
              Post Your Answer
            </button>
          ) : (
            <></>
          )}
        </form>
      </div>
    </div>
  );
}
