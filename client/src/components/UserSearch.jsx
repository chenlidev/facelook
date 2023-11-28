import React, {useState, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {InputBase, Typography, useTheme, Paper, MenuItem, Box} from '@mui/material';
import {Search} from '@mui/icons-material';
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import {useNavigate} from "react-router-dom";

const UserSearch = () => {
    const theme = useTheme();
    const token = useSelector((state) => state.token);
    const {palette} = useTheme();
    const dark = palette.neutral.dark;
    const neutralLight = theme.palette.neutral.light;

    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (users.length > 0) {
            setOpen(true); // Open dropdown if there are users to show
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        setTimeout(() => setOpen(false), 300); // Delay closing dropdown
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    const searchUsers = async () => {
        const queryParams = new URLSearchParams();

        if (searchTerm.includes('@')) {
            queryParams.append('email', searchTerm);
        } else {
            const [firstName, lastName] = searchTerm.split(' ');
            if (firstName) queryParams.append('firstName', firstName);
            if (lastName) queryParams.append('lastName', lastName);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API}/users/search?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            setUsers(data);
            setOpen(true);
        } catch (error) {
            console.error('Error searching users:', error);
            setUsers([]);
        }
    };

    useEffect(() => {
        if (open) {
            // Step 2: Add an event listener when the dropdown is opened
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            // Step 3: Clean up the event listener when the dropdown is closed or the component is unmounted
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                searchUsers();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, token]);

    return (
        <Paper style={{ position: 'relative' }}>
            <FlexBetween backgroundColor={neutralLight}>
                <InputBase
                    placeholder="Search by name or email"
                    onChange={handleSearchChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{ margin: theme.spacing(1), width: '100%' }}
                    startAdornment={<Search />}
                />
            </FlexBetween>
            {open &&  searchTerm.trim() !== '' &&(
                <Paper style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 2 }} ref={dropdownRef}>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <Box
                                key={user._id} // Fixed key to use _id instead of non-existing id
                                onClick={() => {
                                    navigate(`/profile/${user._id}`);
                                    navigate(0);
                                    setOpen(false);
                                    setIsFocused(false);
                                }}
                            >
                                <MenuItem onClick={() => setOpen(false)}>
                                    <UserImage image={user.picturePath} size="40px" />
                                    <span style={{ marginLeft: '10px' }} />
                                    <Typography
                                        variant="h6"
                                        color={dark}
                                        fontWeight="500"
                                        sx={{
                                            "&:hover": {
                                                color: palette.primary.main,
                                                cursor: "pointer",
                                            },
                                        }}
                                    >
                                        {`${user.firstName} ${user.lastName}`}
                                    </Typography>
                                </MenuItem>
                            </Box>
                        ))
                    ) : (
                        <Typography style={{ padding: theme.spacing(2) }}>
                            No users found.
                        </Typography>
                    )}
                </Paper>
            )}
        </Paper>
    );
};

export default UserSearch;