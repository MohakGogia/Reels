import React, { useContext, useEffect, useState } from "react";
import { firebaseDB, timeStamp } from "../config/firebase";
import { AuthContext } from "../context/AuthProvider";
import {
  Card,
  Button,
  makeStyles,
  Typography,
  TextField,
  Avatar,
  Container,
} from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import Box from '@material-ui/core/Box';

const VideoPost = (props) => {
  let [user, setUser] = useState(null);
  let [comment, setComment] = useState("");
  let [commentList, setCommentList] = useState([]);
  let [likesCount, setLikesCount] = useState(null);
  let [isLiked, setIsLiked] = useState(false); 

  let { currentUser } = useContext(AuthContext);

  const useStyles = makeStyles({
    videoContainerSize: {
      // height: "100%",
    },
  });

  let classes = useStyles();

  const addCommentToCommentList = async (e) => {
    let profilePic;
    if (currentUser.uid == user.userId) {
      profilePic = user.profileImageUrl;
    } 
    else {
      let doc = await firebaseDB.collection("users").doc(currentUser.uid).get();
      let user = doc.data();
      profilePic = user.profileImageUrl;
    }
    let newCommentList = [
      ...commentList,
      {
        profilePic: profilePic,
        comment: comment,
      },
    ];

    // add comments in firebase
    let postObject = props.postObj;
    postObject.comments.push({ uid: currentUser.uid, comment: comment });
    await firebaseDB.collection("posts").doc(postObject.pid).set(postObject);
    setCommentList(newCommentList);
    setComment("");
  };

  const toggleLikeIcon = async () =>{
    if(isLiked){
      let postDoc = props.postObj;
      let filteredLikes = postDoc.likes.filter( uid =>{
        if(uid === currentUser.uid){
          return false;
        }
        else{
          return true;
        }
      });
      postDoc.likes = filteredLikes;
      await firebaseDB.collection("posts").doc(postDoc.pid).set(postDoc);
      setIsLiked(false);
      likesCount === 1 ? setLikesCount(null) : setLikesCount(likesCount-1);
    }
    else{
      let postDoc = props.postObj;
      postDoc.likes.push(currentUser.uid);
      await firebaseDB.collection("posts").doc(postDoc.pid).set(postDoc);
      setIsLiked(true);
      likesCount == null ? setLikesCount(1) : setLikesCount(likesCount+1);
    }
  }

  useEffect(async () => {
    let uid = props.postObj.uid;
    let doc = await firebaseDB.collection("users").doc(uid).get();
    let user = doc.data();
    let commentList = props.postObj.comments;
    let likes = props.postObj.likes;

    let updatedCommentList = [];

    for (let i = 0; i < commentList.length; i++) {
      let commentObj = commentList[i];
      let doc = await firebaseDB.collection("users").doc(commentObj.uid).get();
      let commentUserPic = doc.data().profileImageUrl;
      updatedCommentList.push({
        profilePic: commentUserPic,
        comment: commentObj.comment,
      });
    }

    if (likes.includes(currentUser.uid)) {
      setIsLiked(true);
      setLikesCount(likes.length);
    } else {
      if(likes.length){
        setLikesCount(likes.length);
      }
    }
    setUser(user);
    setCommentList(updatedCommentList);
  }, []); 

  return (
    <Container>
      <Card
        style={{
          width: "350px",
          margin: "auto",
          padding: "10px",
          marginBottom: "20px",
          backgroundColor:"#effbef",
        }}
      >
        <div style={{display:"flex" }}>
          <Avatar style={{ marginBottom:"0.7rem" }} src={ user ? user.profileImageUrl : ""} />
          <Typography style={{ marginLeft:"0.2rem" }}>
            <Box fontWeight="fontWeightBold" m={1}>
              {user ? user.username : ""}
            </Box>
          </Typography>
        </div>

        <div className="video-container">
          <Video
            className={classes.videoContainerSize}
            src={props.postObj.videoLink} 
          ></Video>
        </div>
        <div>
        {isLiked ? (
            <Favorite
              onClick={() => toggleLikeIcon()}
              style={{ color: "red" }}
            ></Favorite>
          ) : (
            <FavoriteBorder onClick={() => toggleLikeIcon()}></FavoriteBorder>
          )}
        </div>

        {likesCount && (
          <div>
            <Typography variant="subtitle1">Liked by {likesCount} others </Typography>
          </div>
        )}
        <Typography variant="subtitle1">Comments</Typography>
        <TextField
          variant="outlined"
          label="Add a comment"
          size="small"
          style = {{ width:"100%", marginTop:"0.5rem" }}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        ></TextField>
        <Button
          variant="contained"
          color="secondary"
          onClick={addCommentToCommentList}
          disabled={comment.trim().length === 0}
          style={{ marginTop:"1rem" }}
        >
          Post
        </Button>

        {commentList.map((commentObj) => {
          return (
            <div style={{display:"flex" }}>
              <Avatar src={commentObj.profilePic} style={{marginTop:"1rem"}}></Avatar>
              <Typography variant="subtitle1" style={{ marginLeft:"0.5rem" , marginTop:"1.2rem"}}>{commentObj.comment}</Typography>
            </div>
          );
        })}
      </Card>
    </Container>
  );
};


function Video(props) {
  const handleAutoScroll = (e) => {
      // // console.log(e);
      // let next = ReactDOM.findDOMNode(e.target).parentNode.parentNode.parentNode
      //   .nextSibling;
      // // console.log(next);
      // if (next) {
      //   next.scrollIntoView({ behaviour: "smooth" });
      //   e.target.muted = "true";
      // }
  };

  return(
      <video
        style={{
          height: "100%",
          width: "100%",
          scrollSnapAlign: "start",
        }}
        muted={true}
        loop={true}
        controls
        onEnded={handleAutoScroll}
        onClick={(e) => {
          console.log(timeStamp());
        }}
      >
        <source src={props.src} type="video/mp4"></source>
      </video>
  );
}

export default VideoPost;