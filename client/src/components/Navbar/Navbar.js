import React, { useState, useEffect } from "react";
import { AppBar, Avatar, Button, Toolbar, Typography } from "@material-ui/core";
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from "react-redux";
import decode from 'jwt-decode'

import * as api from "../../api";
import useStyles from "./styles";
import studying from "../../images/studying.png";

const Navbar = () => {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  const logout = async () => {
    try {
      await api.logOut();
    } catch (error) {
      console.log(error);
    }
    dispatch({ type: 'LOGOUT' })

    history.push('/') 

    setUser(null)
  }

  useEffect(() => {
    const token = user?.token

    if (token) {
      const decodedToken = decode(token)
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.brandContainer}>
        <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">
          HOCVUI
        </Typography>

        <img
          className={classes.image}
          src={studying}
          alt="studying"
          height="60"
        />
      </div>

      <Toolbar className={classes.toolbar}>
        {user ? (
            <div className={classes.profile}>
                <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>
                    {user.result.name.charAt(0)}
                </Avatar>

                <Typography className={classes.userNamer} variant="h6">{user.result.name}</Typography>
                <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>
                    Đăng xuất
                </Button>
            </div>
        ) : (
            <Button component={Link} to="/auth" variant="contained" color="primary">
                Đăng nhập
            </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
