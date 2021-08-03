import React, { useContext, useState } from "react";
import { firebaseDB, firebaseStorage } from "../config/firebase";
import { AuthContext } from "../context/AuthProvider";
import CloudUpload from "@material-ui/icons/CloudUpload";
import { Link } from "react-router-dom";
import logo from "../logo.png";
import {
  TextField,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  CardMedia,
  Typography,
  makeStyles,
} from "@material-ui/core";

const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const { signUp } = useContext(AuthContext);

  const handleFileSubmit = (event) => {
    let fileObject = event.target.files[0];
    setProfileImage(fileObject);
  };

  const handleSignUp = async () => {
    try {
      let response = await signUp(email, password);
      let uid = response.user.uid;

      const uploadPhotoObject = firebaseStorage
        .ref(`/profilePhotos/${uid}/image.jpg`)
        .put(profileImage);
      uploadPhotoObject.on("state_changed", fun1, fun2, fun3);
      function fun1(snapshot) {
        // let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log(progress);
      }
      function fun2(error) {
        console.log(error);
      }
      async function fun3() {
        let profileImageUrl =
          await uploadPhotoObject.snapshot.ref.getDownloadURL();
          firebaseDB.collection("users").doc(uid).set({
          email: email,
          userId: uid,
          username: username,
          profileImageUrl: profileImageUrl,
          postsCreated:[]
        });
        props.history.push("/");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  let useStyles = makeStyles({
    centerDivs: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      width: "100vw",
    },
    carousal: { height: "10rem", backgroundColor: "lightgray" },
    fullWidth: {
      width: "100%",
    },
    centerElements: {
      display: "flex",
      flexDirection: "column",
    },
    mb: {
      marginBottom: "1rem",
    },
    padding: {
      paddingTop: "1rem",
      paddingBottom: "1rem",
    },
    alignCenter: {
      justifyContent: "center",
    },
    mt:{
      marginTop: "0.7rem",
    },
  });
  
  let classes = useStyles();

  return (
    <div>
      <Container>
        <Grid container spacing={2} style={{justifyContent:"space-around" , marginTop:"4.5rem"}}>
          <Grid item sm={4}>
            <Card variant="outlined" className={classes.mb}>
              <CardMedia
                image={logo}
                style={{ height: "5rem", backgroundSize: "contain" }}
              ></CardMedia>
              <Typography style={{ textAlign: "center", color: '#718093'}} variant='subtitle1'>
                Sign up to see photos and videos from your friends.
              </Typography>
              <CardContent className={classes.centerElements}>
              <TextField
                  label="Username"
                  type="text"
                  variant="outlined"
                  value={username}
                  size="small"
                  onChange={(e) => setUsername(e.target.value)}
                  className = {classes.mb}
                ></TextField>
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  size="small"
                  onChange={(e) => setEmail(e.target.value)}
                  className = {classes.mb}
                ></TextField>
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  size="small"
                  onChange={(e) => setPassword(e.target.value)}
                  className = {classes.mb}
                ></TextField>
          <Button
              variant="outlined"
              color="secondary"
              component="label"
              startIcon={<CloudUpload/>}
          >
          Upload Profile Image
          <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {handleFileSubmit(e)}}
          />
          </Button>
            </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSignUp}
                  className={classes.fullWidth}
                >
                  Sign Up
                </Button>
              </CardActions>
              <Typography style={{ textAlign: "center", color: '#718093'}} variant='subtitle1'>
                By signing up, you agree to our Terms, Data Policy and Cookies Policy.
              </Typography>
            </Card>
            <Card variant="outlined" className={classes.padding}>
              <Typography style={{ textAlign: "center" }}>
                Have an account?
                <br/>
                <Button variant="contained" color="primary" className={classes.mt}>
                  <Link style={{ color: "white" }} to="/login">
                    Login
                  </Link>
                </Button>
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {message  &&
        <h2 style={{ color: "red" , display:"flex" , justifyContent:"center"}}>{message}</h2>
      }
    </div>
  );
};

export default Signup;