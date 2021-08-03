import React, { useEffect, useState, useContext } from 'react';
import { AppBar, Toolbar, makeStyles, Button } from "@material-ui/core";
import { AuthContext } from "../context/AuthProvider";
import { NavLink } from "react-router-dom";
import { firebaseDB } from "../config/firebase";
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import Fab from '@material-ui/core/Fab';
import AddIcon from "@material-ui/icons/Add";
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
	},
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  }, 
  fab: {
    margin: theme.spacing(2),
  },
  // fabButton: {
	// 	position: "absolute",
	// 	zIndex: 1,
	// 	left: 0,
	// 	right: 0,
	// 	margin: "0 auto",
	// },
}));

const Header = () => {
  const { signOut, currentUser } = useContext(AuthContext);

  let [profilePic, setprofilePic] = useState(null);

  let classes = useStyles();

  const handleLogout = async (props) => {
    try {
      await signOut();
      props.history.push("/login");
    } catch (err) {
      // console.log(err);
    }
  };


  useEffect(async () => {
    let doc = await firebaseDB.collection("users").doc(currentUser.uid).get();
    let user = doc.data();
    try{
      setprofilePic(user.profileImageUrl);
    }
    catch{
      setprofilePic(null);
    }
  }, []); 

    return (
      <AppBar id="header" position="sticky" style={{ background: '#04CAC3' , marginBottom:"1rem"}}>
        <Toolbar>
        <Typography variant="body">Reels App</Typography>
          {/* {currentUser != null ? (
					<div className="upload-Video">
						<label>
              <Tooltip title="Upload" aria-label="Upload">
                <Fab color="primary" className={classes.fabButton}>
                  <AddIcon/>
                </Fab>
              </Tooltip>
						</label>
					</div>
				) : null} */}
        <div className={classes.grow} />
        <NavLink to="/"  style={ {marginRight:"1rem"} } exact>
          <HomeIcon style={{ fontSize: 33 , color:"black" , marginTop:"5px"}} />
        </NavLink>
        <NavLink to="/profile" exact>
          {profilePic ?
            <Avatar src={profilePic} style={ {marginRight:"1rem"} } className={classes.small}/> :
            <Avatar src="/broken-image.jpg" style={ {marginRight:"1rem"} } className={classes.small}/>
          }
        </NavLink>
          <Button onClick={handleLogout} color="secondary" variant="contained">
            Logout
          </Button>
        </Toolbar>
		</AppBar>
     );
}
 
export default Header;