import { Box, Typography, IconButton } from "@mui/material";
import Dropzone from "react-dropzone";
import { DeleteOutlined } from "@mui/icons-material";
import { useState } from "react";

const PostImage = ({ video, setVideo, palette }) => {
    const medium = palette.neutral.medium;
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

    const handleVideoDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setVideo(file);
        setVideoPreviewUrl(URL.createObjectURL(file));
    };

    const handleVideoRemove = (e) => {
        e.stopPropagation();
        setVideo(null);
        setVideoPreviewUrl(null);
    };

    return (
        <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
        >
            <Dropzone
                acceptedFiles=".mp4,.webm,.ogg"
                multiple={false}
                onDrop={handleVideoDrop}
            >
                {({ getRootProps, getInputProps }) => (
                    <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                        <input {...getInputProps()} />
                        {!video ? (
                            <p>Add a video here</p>
                        ) : (
                            <>
                                <Typography>{video.name}</Typography>
                                <video width="100%" controls>
                                    <source src={videoPreviewUrl} type={video.type} />
                                    Your browser does not support the video tag.
                                </video>
                            </>
                        )}
                        {video && (
                            <IconButton onClick={handleVideoRemove}>
                                <DeleteOutlined />
                            </IconButton>
                        )}
                    </Box>
                )}
            </Dropzone>
        </Box>
    );
};

export default PostImage;
