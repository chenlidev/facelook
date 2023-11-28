import { Box, Typography, IconButton } from "@mui/material";
import Dropzone from "react-dropzone";
import { DeleteOutlined } from "@mui/icons-material";
import { useState } from "react";

const PostImage = ({ image, setImage, palette }) => {
    const medium = palette.neutral.medium;
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const handleImageDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
    };

    const handleImageRemove = (e) => {
        e.stopPropagation();
        setImage(null);
        setImagePreviewUrl(null);
    };

    return (
        <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
        >
            <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={handleImageDrop}
            >
                {({ getRootProps, getInputProps }) => (
                    <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                        <input {...getInputProps()} />
                        {!image ? (
                            <p>Add an image here</p>
                        ) : (
                            <>
                                <Typography>{image.name}</Typography>
                                <img src={imagePreviewUrl} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />
                            </>
                        )}
                        {image && (
                            <IconButton onClick={handleImageRemove}>
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
