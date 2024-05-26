import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  getFirestore,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { toast } from "react-toastify";

const Upload = () => {
  const { isLoggedIn, isFirebaseActive, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pageStatus, setPageStatus] = useState('pre_submit');
  useEffect(() => {
    if (!isLoggedIn && isFirebaseActive) {
      navigate("/");
    }
  }, [isLoggedIn, isFirebaseActive]);


  const [formData, setFormData] = useState({
    file: null,
    title: "",
    questions: [{ id: 1, text: "" }],
  });

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleTitleChane = (e) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleQuestionChange = (id, value) => {
    const updatedQuestions = formData.questions.map((question) =>
      question.id === id ? { ...question, text: value } : question
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: formData.questions[formData.questions.length - 1].id + 1,
      text: "",
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  const removeQuestion = (id) => {
    const updatedQuestions = formData.questions.filter(
      (question) => question.id !== id
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    setPageStatus('submitting');
    e.preventDefault();
    // Handle form submission logic here
    const storage = getStorage();
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "videos"), {
      questions: formData.questions,
      title: formData.title,
      userId: user.uid,
      status: 'created',
      created_at: serverTimestamp()
    });
    const firelocation = ref(storage, `videos/${user.uid}/${docRef.id}`);
    const destination = await uploadBytes(firelocation, formData.file);
    await updateDoc(docRef, { videoPath: destination.metadata.fullPath, status: 'uploaded' });
    setFormData({
      file: null,
      title: "",
      questions: [{ id: 1, text: "" }],
    });
    toast('🦄 Your video is being processed! Feel free to submit another one.', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setPageStatus('pre_submit');
  };

  if (pageStatus == 'submitting')
  {
    return <>
      <div className="row">
        <div className="col mt-3">
        <h1>Upload Video</h1>
        </div>
      </div>
      <div className="row">
        <div className="col mt-3">
          <h2 className="text-center">Your video is being upload to our site, please do not leave the page...</h2>
        </div>
      </div>
    </>
  }

  return (
    <>
      <div className="row">
      <div className="col mt-3">
        <h1>Upload Video</h1>
        </div>
      </div>
      <div className="row">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              onChange={handleTitleChane}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="formFile" className="form-label">
              Upload Video
            </label>
            <input
              type="file"
              className="form-control"
              id="formFile"
              accept="video/*"
              onChange={handleFileChange}
            />
          </div>

          {formData.questions.map((question, index) => (
            <div key={question.id} className="mb-3">
              <label
                htmlFor={`formQuestion${question.id}`}
                className="form-label"
              >
                Question {index + 1}
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id={`formQuestion${question.id}`}
                  placeholder="Enter your answer"
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionChange(question.id, e.target.value)
                  }
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeQuestion(question.id)}
                  disabled={formData.questions.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mb-3">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={addQuestion}
            >
              Add Question
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Upload;
