import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Button } from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { firebaseDB, firebaseStorage, timeStamp } from "../config/firebase";
import { uuid } from "uuidv4";
import VideoPost from "./VideoPost";
import Header from './Header';
import CircularProgress from '@material-ui/core/CircularProgress';

const Feeds = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [ progress, setProgress ] = useState(0);
  const [posts, setPosts] = useState([]);
  const [uploadVideoError, setUploadVideoError] = useState("");
  const { currentUser } = useContext(AuthContext);

  const handleInputFile = (e) => {
    let file = e.target.files[0];
    setVideoFile(file);
  };

  const handleUploadFile = async () => {
    try {
      if (videoFile.size / 1000000 > 20) {
        setUploadVideoError("Selected File Exceeds 20MB cannot upload !");
        return;
      }

      // upload video in firebase storage
      let uid = currentUser.uid;
      const uploadVideoObject = firebaseStorage
        .ref(`/profilePhotos/${uid}/${Date.now()}.mp4`)
        .put(videoFile);
      uploadVideoObject.on("state_changed", fun1, fun2, fun3);
      function fun1(snapshot) {
        let uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      }
      function fun2(error) {
        console.log(error);
      }
      async function fun3() {
        let videoUrl = await uploadVideoObject.snapshot.ref.getDownloadURL(); 
        let pid = uuid();
        await firebaseDB.collection("posts").doc(pid).set({
          pid: pid,
          uid: uid,
          comments: [],
          likes: [],
          videoLink: videoUrl,
          createdAt: timeStamp(),
        });
       
        let doc = await firebaseDB.collection("users").doc(uid).get();
        let document = doc.data();
        document.postsCreated.push(pid);
        await firebaseDB.collection("users").doc(uid).set(document);
        setUploadVideoError("");
        setProgress(0);
      }
    } catch (err) {}
  };

  //Intersetion Observer Settings
  let conditionObject = {
    root: null, 
    threshold: "0.8",
  };

  function cb(entries) {
    entries.forEach((entry) => {
      let child = entry.target.children[0];

      child.play().then(function () {
        if (entry.isIntersecting === false) {
          child.pause();
        }
      })
      .catch(error => {
        // console.log(error);
    })
    });
  }

  useEffect(() => {
    let observerObject = new IntersectionObserver(cb, conditionObject);
    let elements = document.querySelectorAll(".video-container");

    elements.forEach((el) => {
      observerObject.observe(el);
    });
  }, [posts]);

  useEffect(() => {
    //GET ALL THE POSTS FROM THE COLLECTION AND SAVE IT IN A VARIABLE
    firebaseDB
      .collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        let allPosts = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setPosts(allPosts);
      });
  }, []);

  return (
    <div>
      <Header/>
      <div className="uploadVideo">
        <div>
        <div style={{ display:"flex" , justifyContent:"center" , marginLeft:"5rem"}}>
          <label>
          <input
              type="file"
              onChange={handleInputFile}/>
            <br/>
            <Button
              onClick={handleUploadFile}
              variant="contained"
              color="secondary"
              component="label"
              style={{marginTop:"0.5rem"}}
              startIcon={<PhotoCamera></PhotoCamera>}
            >
              Upload Video 
            </Button>
          </label>
        </div>
        </div>
        <p>{uploadVideoError}</p>
      </div>
      <div className="feeds-video-list" style={{ margin: "auto" }}>
      { 
      progress ? 
      (
        <div style={{ display:"flex" , justifyContent:"center"}}>
          <CircularProgress variant="determinate" value={progress} /> 
        </div>
      )
      : 
      (
        posts.map((postObj) => {
          return <VideoPost key={postObj.pid} postObj={postObj}></VideoPost>;
        })
      )
       }
      </div>
    </div>
  );
};

export default Feeds;