import { Box } from "@mui/material";

const UserVideo = ({ video, size = "60px" }) => {
    return (
        <Box width={size} height={size}>
            <img
                style={{ objectFit: "cover", borderRadius: "50%" }}
                width={size}
                height={size}
                alt="user"
                src={`${process.env.REACT_APP_API}/assets/${video}`}
            />
        </Box>
    );
};

export default UserVideo;