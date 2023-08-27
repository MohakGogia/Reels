import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { firebaseDB, firebaseStorage, timeStamp } from "../config/firebase";
import { v4 as uuid } from "uuid";
import VideoPost from "./VideoPost";
import Header from './Header';

const Feeds = () => {
  const MAX_FILE_SIZE_LIMIT_IN_MB = 20;
  const [videoFile, setVideoFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [posts, setPosts] = useState([]);
  const [uploadVideoError, setUploadVideoError] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);

  const handleInputFile = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleUploadFile = async () => {
    try {
      if (videoFile.size / 1000000 > MAX_FILE_SIZE_LIMIT_IN_MB) {
        setUploadVideoError("File too large! Please choose a smaller video file.");
        return;
      }
      else if (!isValidVideoFile(videoFile)) {
        setUploadVideoError("Invalid file format. Please select a valid video file.");
        return;
      }

      const uid = currentUser.uid;
      const uploadVideoObject = firebaseStorage
        .ref(`/profilePhotos/${uid}/${Date.now()}.mp4`)
        .put(videoFile);

      uploadVideoObject.on("state_changed", fun1, fun2, fun3);
      closeUploadModal();

      function fun1(snapshot) {
        const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      }

      function fun2(error) {
        console.log(error);
      }

      async function fun3() {
        const videoUrl = await uploadVideoObject.snapshot.ref.getDownloadURL();
        const pid = uuid();

        await firebaseDB.collection("posts").doc(pid).set({
          pid,
          uid,
          comments: [],
          likes: [],
          videoLink: videoUrl,
          createdAt: timeStamp(),
        });

        const doc = await firebaseDB.collection("users").doc(uid).get();
        const document = doc.data();
        document.postsCreated.push(pid);
        await firebaseDB.collection("users").doc(uid).set(document);

        setUploadVideoError("");
        setProgress(0);
      }
    } catch (err) {}
  };

  const isValidVideoFile = (file) => {
    const allowedExtensions = ["mp4", "avi", "mov"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const openUploadModal = () => {
    setVideoFile(null);
    setUploadVideoError("");
    setOpenModal(true);
  };
  
  const closeUploadModal = () => {
    setOpenModal(false);
  }; 

  //Intersetion Observer Settings
  let conditionObject = {
    root: null, 
    threshold: "0.8",
  };

  function videoInteractionCallback(entries) {
    entries.forEach((entry) => {
      let child = entry.target.children[0];

      child.play().then(function () {
        if (entry.isIntersecting === false) {
          child.pause();
        }
      })
      .catch(error => {
        console.log(error);
    })
    });
  }

  useEffect(() => {
    const observerObject = new IntersectionObserver(videoInteractionCallback, conditionObject);
    const elements = document.querySelectorAll(".video-container");

    elements.forEach((el) => {
      observerObject.observe(el);
    });
  }, [posts]);

  useEffect(() => {
    firebaseDB
      .collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const allPosts = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setPosts(allPosts);
      });
  }, []);

  return (
    <div>
      <Header/>
      <div className="uploadVideo">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={openUploadModal}
            startIcon={<PhotoCamera />}
            disabled={progress > 0}
          >
            Upload Video
          </Button>
          <Dialog open={openModal} onClose={closeUploadModal}>
            <DialogTitle>Select a video file</DialogTitle>
            <DialogContent>
              <input type="file" onChange={handleInputFile} />
            </DialogContent>
            <div style={{ textAlign: "center", color: "red", fontSize: "10pt", marginTop: "1rem" }}>
              {uploadVideoError}
            </div>
            <DialogActions>
              <Button onClick={closeUploadModal} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleUploadFile} color="secondary" disabled={!videoFile}>
                Upload
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <div className="feeds-video-list" style={{ margin: "auto" }}>
        {progress ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress variant="determinate" value={progress} />
          </div>
        ) : (
          posts.map((postObj) => {
            return <VideoPost key={postObj.pid} postObj={postObj} />;
          })
        )}
      </div>
    </div>
  );
};

export default Feeds;
