import { createContext, useState, useEffect } from 'react';

const UserContext = createContext({
    user: null,
    setUser: () => {},
    dmUsers: [],
    setDmUsers: () => {},
    channels: [],
    setChannels: () => {},
});

export const useFetchUser = () => {
    const [user, setUser] = useState(null);
    const [dmUsers, setDmUsers] = useState([]);
    const [channels, setChannels] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/get-user");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const userData = await response.json();

                if (!userData || Object.keys(userData).length === 0) {
                    setError('No user data');
                    return;
                }

                setDmUsers(userData.direct_messages);
                setChannels(userData.channels);
                setUser(userData);
            } catch (error) {
                console.error("There has been a problem with your fetch operation:", error);
                setError(error.message);
            }
        };

        fetchUserData();
    }, []);

    return { user, setUser, dmUsers, setDmUsers, channels, setChannels, error };
};

export default UserContext;
