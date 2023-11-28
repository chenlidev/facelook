import {Box, useMediaQuery} from "@mui/material";
import {useSelector} from "react-redux";
import Navbar from "scenes/navbar";
import UserProfile from "components/UserProfile";
import MyPost from "components/MyPost";
import Posts from "components/Posts";
import Ad from "components/Ad";
import FriendList from "components/FriendList";

const HomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const {_id, picturePath} = useSelector((state) => state.user);
    return (
        <Box>
            <Navbar/>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserProfile userId={_id} picturePath={picturePath}/>
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <MyPost picturePath={picturePath}/>
                    <Posts userId={_id}/>
                </Box>
                {isNonMobileScreens && (
                    <Box flexBasis="26%">
                        <Ad/>
                        <Box m="2rem 0"/>
                        <FriendList userId={_id}/>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default HomePage;
