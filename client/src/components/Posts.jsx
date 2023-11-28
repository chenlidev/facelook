import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setPosts} from "state";
import Post from "./Post";

const Posts = ({userId, isProfile = false}) => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);

    const getPosts = async () => {
        const response = await fetch(`${process.env.REACT_APP_API}/posts`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`},
        });
        const data = await response.json();
        dispatch(setPosts({posts: data}));
    };

    const getUserPosts = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API}/posts/${userId}/posts`,
            {
                method: "GET",
                headers: {Authorization: `Bearer ${token}`},
            }
        );
        const data = await response.json();
        dispatch(setPosts({posts: data}));
    };

    useEffect(() => {
        if (isProfile) {
            getUserPosts();
        } else {
            getPosts();
        }
    }, []);

    const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    return (
        <>
            {sortedPosts.map(
                ({
                     _id,
                     userId,
                     firstName,
                     lastName,
                     description,
                     location,
                     picturePath,
                     userPicturePath,
                     videoPath,
                     audioPath,
                     likes,
                     createdAt
                 }) => (
                    <Post
                        key={_id}
                        postId={_id}
                        postUserId={userId}
                        name={`${firstName} ${lastName}`}
                        description={description}
                        location={location}
                        picturePath={picturePath}
                        userPicturePath={userPicturePath}
                        videoPath={videoPath}
                        audioPath={audioPath}
                        likes={likes}
                        createdAt={createdAt}
                    />
                )
            )}
        </>
    );
};

export default Posts;
