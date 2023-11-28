import {
    ImageOutlined,
    Videocam,
    MicOutlined,
    EmojiEmotions,
} from "@mui/icons-material";

import {
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button, useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import Wrapper from "components/Wrapper";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setPosts} from "state";
import PostImage from "./PostImage";
import PostVideo from "./PostVideo";
import PostAudio from "./PostAudio";
import EmojiPicker from 'emoji-picker-react';


const MyPost = ({picturePath}) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const {palette} = useTheme();
    const {_id} = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const [isVideo, setIsVideo] = useState(false);
    const [video, setVideo] = useState(null);
    const [isAudio, setIsAudio] = useState(false);
    const [audio, setAudio] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiButtonRef = useRef(null);  // Create a ref for the emoji button

    const onEmojiClick = (event, emojiObject) => {
        setPost(prevPost => prevPost + emojiObject.emoji);
    };

    const emojiPickerRef = useRef(null);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    const handleClickOutside = (event) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) &&
            emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
            setShowEmojiPicker(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const handlePost = async () => {
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("description", post);

        // Check and add image data if present
        if (image) {
            formData.append("picture", image);
            formData.append("picturePath", image.name);
        }

        if (video) {
            formData.append("video", video);
            formData.append("videoPath", video.name);
        }

        if (audio) {
            formData.append("audio", audio);
            formData.append("audioPath", audio.name);
        }

        const response = await fetch(`${process.env.REACT_APP_API}/posts`, {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`},
            body: formData,
        });

        const posts = await response.json();
        dispatch(setPosts({posts}));

        // Reset state after post creation
        setImage(null);
        setVideo(null); // Clear video state
        setPost("");
        setIsImage(false); // Hide the image dropzone
        setIsVideo(false);
        setAudio(false);
    };

    return (
        <Wrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath}/>
                <InputBase
                    placeholder="What's on your mind..."
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
            </FlexBetween>
            {isImage && <PostImage image={image} setImage={setImage} palette={palette}/>}
            {isVideo && (
                <PostVideo video={video} setVideo={setVideo} palette={palette}/>
            )}
            {isAudio && (
                <PostAudio audio={audio} setAudio={setAudio} palette={palette} />
            )}

            <Divider sx={{margin: "1.25rem 0"}}/>

            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => {
                    setIsImage(!isImage);
                    if (isVideo) {
                        setIsVideo(false);
                    }
                    if(isAudio){
                        setIsAudio(false);
                    }
                }}
                >
                    <ImageOutlined sx={{cursor: "pointer", color: mediumMain}}/>
                    <Typography
                        color={mediumMain}
                        sx={{"&:hover": {cursor: "pointer", color: medium}}}
                    >
                        Image
                    </Typography>
                </FlexBetween>

                <FlexBetween gap="0.25rem" onClick={() => {
                    setIsVideo(!isVideo);
                    if (isImage) {
                        setIsImage(false);
                    }
                    if (isAudio) {
                        setIsAudio(false);
                    }
                }}
                >
                    <Videocam sx={{cursor: "pointer", color: mediumMain}}/>
                    <Typography
                        color={mediumMain}
                        sx={{"&:hover": {cursor: "pointer", color: medium}}}
                    >
                        Video
                    </Typography>
                </FlexBetween>

                <FlexBetween gap="0.25rem" onClick={() => {
                    setIsAudio(!isAudio);
                    if (isImage) {
                        setIsImage(false);
                    }
                    if (isVideo) {
                        setIsVideo(false);
                    }
                }}>
                    <MicOutlined sx={{ cursor: "pointer", color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                    >
                        Audio
                    </Typography>
                </FlexBetween>

                <Button ref={emojiButtonRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <EmojiEmotions sx={{ cursor: "pointer", color: mediumMain }} />
                </Button>

                {/* Emoji Picker container */}
                {showEmojiPicker && (
                    <FlexBetween
                        ref={emojiPickerRef}
                        style={isNonMobileScreens?{
                            position: 'absolute',
                            top: (emojiButtonRef.current?.offsetTop + emojiButtonRef.current?.offsetHeight + 20) + 'px',
                            left: (emojiButtonRef.current?.offsetLeft - 110) + 'px',
                            zIndex: 1
                        }:{
                            position: 'absolute',
                            top: (emojiButtonRef.current?.offsetTop + emojiButtonRef.current?.offsetHeight + 20) + 'px',
                            left: (emojiButtonRef.current?.offsetLeft - 150) + 'px',
                            zIndex: 1
                        }}
                    >
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </FlexBetween>
                )}

                <Button
                    disabled={!post.trim() && !image && !video && !audio} // Check if all conditions are met
                    onClick={handlePost}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem",
                        '&.Mui-disabled': { // Add styles for disabled state
                            color: palette.neutral.light, // Use your theme's colors accordingly
                            backgroundColor: palette.neutral.medium,
                        },
                    }}
                >
                    POST
                </Button>

            </FlexBetween>
        </Wrapper>
    );
};

export default MyPost;
