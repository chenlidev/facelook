import {Box, useMediaQuery} from "@mui/material";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendList from "components/FriendList";
import MyPost from "components/MyPost";
import Posts from "components/Posts";
import UserProfile from "components/UserProfile";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const {userId} = useParams();
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const loggedInUserId = useSelector((state) => state.user._id);

    useEffect(() => {
        const getUser = async () => {
            const response = await fetch(`${process.env.REACT_APP_API}/users/${userId}`, {
                method: "GET",
                headers: {Authorization: `Bearer ${token}`},
            });
            const data = await response.json();
            setUser(data);
        };

        getUser();
    }, [userId, token]);


    if (!user) return null;

    return (
        <Box>
            <Navbar/>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="2rem"
                justifyContent="center"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserProfile userId={userId} picturePath={user.picturePath}/>
                    <Box m="2rem 0"/>
                    <FriendList userId={userId}/>
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    {loggedInUserId === userId && (
                    <MyPost picturePath={user.picturePath}/>
                        )}
                    <Box m="2rem 0"/>
                    <Posts userId={userId} isProfile/>
                </Box>
            </Box>
        </Box>
    );
};

export default ProfilePage;
