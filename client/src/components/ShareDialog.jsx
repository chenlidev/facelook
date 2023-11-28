import React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import RedditIcon from '@mui/icons-material/Reddit';
import EmailIcon from '@mui/icons-material/Email';
import FlexBetween from "./FlexBetween";

function ShareDialog({open, handleClose}) {
    const [copied, setCopied] = useState(false);

    const currentURL = window.location.href;

    const handleCopy = () => {
        navigator.clipboard.writeText(currentURL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Share this link
                <IconButton style={{float: 'right'}} onClick={handleClose}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <FlexBetween>
                    <input
                        type="text"
                        value={currentURL}
                        readOnly
                        style={{flexGrow: 1, padding: '5px', marginRight: '10px'}}
                    />
                    <IconButton onClick={handleCopy}>
                        <FileCopyIcon/>
                    </IconButton>
                    {copied && <span>Copied!</span>}
                </FlexBetween>

                <IconButton>
                    <FacebookIcon/>
                </IconButton>
                <IconButton>
                    <TwitterIcon/>
                </IconButton>
                <IconButton>
                    <InstagramIcon/>
                </IconButton>
                <IconButton>
                    <WhatsAppIcon/>
                </IconButton>
                <IconButton>
                    <LinkedInIcon/>
                </IconButton>
                <IconButton>
                    <RedditIcon/>
                </IconButton>
                <IconButton>
                    <EmailIcon/>
                </IconButton>

            </DialogContent>
        </Dialog>
    );
}

export default ShareDialog;
