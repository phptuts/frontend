import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { NavLink,  useNavigate, useSearchParams } from "react-router-dom";
import { collection, getDocs, getFirestore, limit, orderBy, query, startAfter, startAt, where } from "firebase/firestore";

const Videos = () => {
  const { isLoggedIn, isFirebaseActive, user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn && isFirebaseActive) {
      navigate("/");
    }
  }, [isLoggedIn, isFirebaseActive]);

  let [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +searchParams.get('page') || 1;
  const itemsPerPage = 1;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(null);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!isFirebaseActive || !user) return;

      const db = getFirestore();
      
      const q = currentPage <= 1 ? query(
        collection(db, "videos"),
        where('status', '==', 'completed'),
        where('userId', '==', user.uid),
        orderBy('created_at', 'desc'),
        limit(itemsPerPage)
      ) : query(
        collection(db, "videos"),
        where('status', '==', 'completed'),
        where('userId', '==', user.uid),
        orderBy('created_at', 'desc'),
        startAfter(offset),
        limit(itemsPerPage)
      );
      const docs = await getDocs(q);
      const newOffset = docs.docs[docs.docs.length - 1];
      setOffset(newOffset);

      
      const videos = docs.docChanges().map(docChange => {
        return {
          id: docChange.doc.id,
          ...docChange.doc.data(),
        }
      });


      const nextPageQuery = query(
        collection(db, "videos"),
        where('status', '==', 'completed'),
        where('userId', '==', user.uid),
        orderBy('created_at', 'desc'),
        startAfter(newOffset),
        limit(itemsPerPage)
      );
      const nextQueryResult = await getDocs(nextPageQuery)
      setHasNext(!nextQueryResult.empty);
      setVideos(videos);
      setLoading(false);
    };

    fetchData();
  }, [currentPage, isFirebaseActive, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
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
              <th scope="row">{index + 1 + (currentPage - 1) * itemsPerPage}</th>
              <td>{item.title}</td>
              <td>{item.created_at.toDate().toLocaleString('en-US', { timeZoneName: 'short' })}</td>
              <td><NavLink to={`/videos/${item.id}`}>Completed Video</NavLink></td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <NavLink className="page-link" to={`/videos?page=${currentPage - 1}`}>Previous</NavLink>
          </li>
          <li className={`page-item ${hasNext ? '' : 'disabled'}`}>
            <NavLink className="page-link" to={`/videos?page=${currentPage + 1}`}>Next</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Videos;
