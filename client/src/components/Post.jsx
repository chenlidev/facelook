import {
    DeleteOutline,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import {IconButton, Typography, useTheme} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import Wrapper from "components/Wrapper";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {removePost, setPost} from "state";
import ShareDialog from "./ShareDialog";

const Post = ({
                        postId,
                        postUserId,
                        name,
                        description,
                        location,
                        picturePath,
                        userPicturePath,
                        videoPath,
                        audioPath,
                        likes,
                        createdAt
                    }) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;

    const {palette} = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const [open, setOpen] = useState(false);

    const patchLike = async () => {
        const response = await fetch(`${process.env.REACT_APP_API}/posts/${postId}/like`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userId: loggedInUserId}),
        });
        const updatedPost = await response.json();
        dispatch(setPost({post: updatedPost}));
    };

    const deletePost = async () => {
        const response = await fetch(`${process.env.REACT_APP_API}/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            dispatch(removePost({postId}));
        }
    };

    const formatDate = (createdAtStr) => {
        const createdAt = new Date(createdAtStr);
        const now = new Date();
        const differenceInSeconds = Math.floor((now - createdAt) / 1000);

        if (differenceInSeconds < 60) {
            return 'Just now';
        } else if (differenceInSeconds < 3600) {
            const minutes = Math.floor(differenceInSeconds / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (differenceInSeconds < 86400) {
            const hours = Math.floor(differenceInSeconds / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            return createdAt.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        }
    };


    return (
        <Wrapper m="2rem 0">
            <Friend
                friendId={postUserId}
                name={name}
                subtitle={location}
                userPicturePath={userPicturePath}
            />
            <Typography color={main} sx={{mt: "1rem"}}>
                {description}

            </Typography>
            {picturePath && (
                <img
                    width="100%"
                    height="auto"
                    alt="post"
                    style={{borderRadius: "0.75rem", marginTop: "0.75rem"}}
                    src={`${process.env.REACT_APP_API}/assets/${picturePath}`}
                />
            )}

            {videoPath && (
                <video
                    width="100%"
                    controls
                    style={{borderRadius: "0.75rem", marginTop: "0.75rem"}}
                    src={`${process.env.REACT_APP_API}/assets/${videoPath}`}
                />
            )}

            {audioPath && (
                <video
                    width="50%"
                    controls
                    style={{borderRadius: "0.75rem", marginTop: "0.75rem"}}
                    src={`${process.env.REACT_APP_API}/assets/${audioPath}`}
                />
            )}

            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{color: "#FF0000"}}/>
                            ) : (
                                <FavoriteBorderOutlined/>
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>



                    {loggedInUserId === postUserId && (
                        <FlexBetween gap="0.3rem">
                            <IconButton onClick={deletePost}>
                                <DeleteOutline/>
                            </IconButton>
                        </FlexBetween>
                    )}
                </FlexBetween>


                <IconButton onClick={() => setOpen(true)}>
                    <ShareOutlined/>
                </IconButton>
                <ShareDialog open={open} handleClose={() => setOpen(false)}/>

            </FlexBetween>

            <Typography style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}
                        sx={{
                            color: main,
                            fontSize: "0.8rem"
                        }}
            >
                {formatDate(createdAt)}
            </Typography>
        </Wrapper>
    );
};

export default Post;
