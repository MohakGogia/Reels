import React, { useEffect, useState, useContext} from 'react';
import Header from './Header';
import { AuthContext } from "../context/AuthProvider";
import { firebaseDB } from "../config/firebase";
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  size: {
    width: theme.spacing(18),
    height: theme.spacing(20),
    alignItems: 'center',
    justifyContent: 'center',
	},

}));

const Profile = () => {
    let [ user, setUser ]= useState(null);
    const { currentUser } = useContext(AuthContext);

    let classes = useStyles();


    useEffect(async () => {
        let doc = await firebaseDB.collection("users").doc(currentUser.uid).get();
        let userData = doc.data();
        setUser(userData);
        // console.log(userData);
      }, []); 


    return( 
    <>
    <Header/>
    {user && (
        <Card style={{  marginTop:"3rem" , marginLeft:"33rem" , width:"500px" , height:"200px" , backgroundColor:"#40E0D0"}}>
            <CardContent style={ { display:"flex" }}>
                <Avatar src={user.profileImageUrl} className={classes.size}/>
                <Typography  variant="h3" style={{ marginLeft:"3.5rem" }}>
                    {user.username}
                </Typography>
                {/* <Typography  variant="b1"  style={ { align:"right"}}>
                    Posts Created : {user.postsCreated.length}
                </Typography> */}
            </CardContent>
        </Card>
    )
    }
    </>
    );
}
 
export default Profile;