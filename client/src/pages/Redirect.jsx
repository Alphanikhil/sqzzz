import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToHome = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to the home page on reload
        navigate('/');
    }, [navigate]);

    return null;  // This component doesn't need to render anything
};

export default RedirectToHome;
