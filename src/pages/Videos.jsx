import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { NavLink,  useNavigate } from "react-router-dom";
import { collection, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, where } from "firebase/firestore";

const Videos = () => {
  const { isLoggedIn, isFirebaseActive, user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const itemsPerPage = 100;

  useEffect(() => {
    if (!isLoggedIn && isFirebaseActive) {
      navigate("/");
    }
  }, [isLoggedIn, isFirebaseActive]);


  
  useEffect(() => {
    if (!isFirebaseActive || !user) return;
    const getMoreVideos = async () => {
      setLoading(true);
      const db = getFirestore();
      const q = query(
        collection(db, "videos"),
        where('status', '==', 'completed'),
        where('userId', '==', user.uid),
        orderBy('created_at', 'desc'),
        limit(itemsPerPage)
      );
      const docs = await getDocs(q);
      const videos = docs.docChanges().map(docChange => {
        return {
          id: docChange.doc.id,
          ...docChange.doc.data(),
        }
      });
      setVideos(videos);
      setLoading(false);
    };
    getMoreVideos();
  }, [isFirebaseActive, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <h1 className="mt-3 mb-3 text-center">Your Videos</h1>
        </div>
      </div>
        <div className="row">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Created Date</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {videos.map((item, index) => (
            <tr key={item.id}>
              <th scope="row">{index + 1}</th>
              <td>{item.title}</td>
              <td>{item.created_at.toDate().toLocaleString('en-US', { timeZoneName: 'short' })}</td>
              <td><NavLink to={`/videos/${item.id}`}>Completed Video</NavLink></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </>
  );
};

export default Videos;
