import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import "./myquestions.css";
import Posts from "./Posts";
import Pagination from "./Pagination";

export default function MyQuestions() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    tags: "",
  });

  const onChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState([]);

  const [postPerPage] = useState(4);
  const [currentPage, setcurrentPage] = useState(1);

  // const fetchMemberQuestions = async () => {
  //   let mQuestions = [];
  //   const response = await fetch(
  //     `http://localhost:5000/api/question/fetchquestions`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   ).then((response) => {
  //     return response.json();
  //   }).then((data) => {
  //     if (data.length > 0) {
  //       for (let member of data) {
  //         if (member.members.length > 0) {
  //           if (user && member.members.indexOf(user._id) != -1) {
  //             mQuestions.push(member);
  //           }
  //         } 
  //       }
  //       setQuestions(mQuestions);
  //     }
  //   });
  // };

  const getUser = async () => {
    const currentUser = await fetch(
      `http://localhost:5000/api/auth/user/${localStorage.getItem("username")}`)
      .then((response) => {
        return response.json();
      })
      .then((user) => setUser(user));
  };

  const fetchAllFilteredQuestions = async () => {
    const response = await fetch(
      `http://localhost:5000/api/question/fetchUserFilteredQuestions/${localStorage.getItem("username")}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: filters.startDate,
          endDate: filters.endDate,
          tags: filters.tags,
        }),
      }
    ).then((response) => {
        return response.json();
      }).then((data) => setQuestions(data));
  };

  const [usedTags, setUsedTags] = useState([]);
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/question/usedtags/${localStorage.getItem(
        "username"
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => setUsedTags(data));
  }, []);

  useEffect(() => {
    fetchAllFilteredQuestions();
  }, [filters]);

  // useEffect(() => {
  //   getUser();
  //   if (user) {
  //     fetchMemberQuestions();
  //   }
  // }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/question/fetchUserQuestions/${localStorage.getItem("username")}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
        return response.json();
      }).then((data) => setQuestions(data));
  }, []);

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = questions.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNum) => setcurrentPage(pageNum);

  return (
    <div
      className="container"
      Style="height:100vh;margin-top:13vh; z-index:1; background-color:white"
    >
      <ProfileSidebar />
      <div className="header_and_content" Style="width:100%;">
        <ProfileHeader />

        <div className="filters_menu">
          <strong Style="display:inline">Find your questions between : </strong>
          <input type="date" name="startDate" onChange={onChange} />
          <strong Style="display:inline">To</strong>
          <input type="date" name="endDate" onChange={onChange} />
          {/* <strong Style="display:inline">and in tag:</strong>
          <select name="tags" onChange={onChange}>
            <option value="none" selected disabled hidden>
              select a tag
            </option>
            {usedTags.map((tag) => (
              <option value={tag}>{tag}</option>
            ))}
          </select> */}
        </div>
{/* 
        <div className="link-tag">
          <button onClick={() => fetchMemberQuestions()} className="btn btn-primary mr-2">Manage Member Questions</button>
        </div> */}

        <div className="questions">
          <div className="question">
            <Posts posts={currentPosts} />
          </div>
        </div>
        <div className="container">
          <Pagination
            postsPerPage={postPerPage}
            totalPosts={questions.length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
}
