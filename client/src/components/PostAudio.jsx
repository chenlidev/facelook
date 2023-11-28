import { Box, Typography, IconButton } from "@mui/material";
import Dropzone from "react-dropzone";
import { DeleteOutlined} from "@mui/icons-material";
import { useState } from "react";

const PostAudio = ({ audio, setAudio, palette }) => {
    const medium = palette.neutral.medium;
    const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);

    const handleAudioDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setAudio(file);
        setAudioPreviewUrl(URL.createObjectURL(file));
    };

    const handleAudioRemove = (e) => {
        e.stopPropagation();
        setAudio(null);
        setAudioPreviewUrl(null);
    };

    return (
        <Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
            <Dropzone
                acceptedFiles=".mp3,.wav,.ogg,.m4a"
                multiple={false}
                onDrop={handleAudioDrop}
            >
                {({ getRootProps, getInputProps }) => (
                    <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                        <input {...getInputProps()} />
                        {!audio ? (
                            <p>Add an audio file here</p>
                        ) : (
                            <>
                                <Typography>{audio.name}</Typography>
                                <audio width="100%" controls>
                                    <source src={audioPreviewUrl} type={audio.type} />
                                    Your browser does not support the video tag.
                                </audio>
                            </>
                        )}
                        {audio && (
                            <IconButton onClick={handleAudioRemove}>
                                <DeleteOutlined />
                            </IconButton>
                        )}
                    </Box>
                )}
            </Dropzone>
        </Box>
    );
};

export default PostAudio;
