import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Wrapper from "components/Wrapper";

const Ad = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const destinationURL = "https://mika-cosmetics.myshopify.com/";

    return (
        <Wrapper>
            <FlexBetween>
                <Typography color={dark} variant="h5" fontWeight="500">
                    Sponsored
                </Typography>
                <a href={destinationURL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <Typography color={medium}>Mika Cosmetics</Typography>
                </a>
            </FlexBetween>
            <a href={destinationURL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <img
                    width="100%"
                    height="auto"
                    alt="advert"
                    src="/assets/ad.jpeg"
                    style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
                />
            </a>
            <FlexBetween>
                <a href={destinationURL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <Typography color={main}>Mika Cosmetics</Typography>
                </a>
                <Typography color={medium}>mikacosmetics.com</Typography>
            </FlexBetween>
            <Typography color={medium} m="0.5rem 0">
                Your pathway to stunning and immaculate beauty and made sure your skin
                is exfoliating skin and shining like light.
            </Typography>
        </Wrapper>
    );
};

export default Ad;
