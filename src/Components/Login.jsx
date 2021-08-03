import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
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

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  let { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    try {
      await login(email, password);
      props.history.push("/");
    } catch (err) {
      setMessage(err.message);
      setEmail("");
      setPassword("");
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
      <Grid container spacing={2} style={{justifyContent:"space-around", marginTop:"6.5rem"}}>
          <Grid item sm={3}>
            <Card variant="outlined" className={classes.mb}>
              <CardMedia
                image={logo}
                style={{ height: "7rem", backgroundSize: "contain" }}
              ></CardMedia>
              <CardContent className={classes.centerElements}>
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
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
                  className={classes.fullWidth}
                >
                  Login
                </Button>
              </CardActions>
            </Card>
            <Card variant="outlined" className={classes.padding}>
              <Typography style={{ textAlign: "center" }}>
                Don't have an account ?
                <br/>
                <Button variant="contained" color="primary" className={classes.mt}>
                  <Link style={{ color: "white" }} to="/signup">
                    SignUp
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

export default Login;