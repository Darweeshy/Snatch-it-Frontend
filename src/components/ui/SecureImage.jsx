import React, { useState, useEffect } from 'react';
import API from '../../api/client';
import Spinner from './Spinner';

const SecureImage = ({ src, alt, className }) => {
    const [objectUrl, setObjectUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Guard against empty src prop
        if (!src) {
            setIsLoading(false);
            setError(true);
            return;
        }

        let isMounted = true;
        
        const fetchImage = async () => {
            setIsLoading(true);
            setError(false);
            try {
                // Fetch the image data as a blob, which includes the auth header via our API client
                const response = await API.get(src, { responseType: 'blob' });
                if (isMounted) {
                    // Create a temporary local URL from the blob data
                    const localUrl = URL.createObjectURL(response.data);
                    setObjectUrl(localUrl);
                }
            } catch (err) {
                if (isMounted) {
                    setError(true);
                }
                console.error("Failed to fetch secure image:", err);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchImage();

        // Cleanup function to run when the component unmounts or the src changes
        return () => {
            isMounted = false;
            // Revoke the object URL to free up memory
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src]); // Rerun this effect if the src prop changes

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center bg-secondary-100 ${className}`}>
                <Spinner size="sm" />
            </div>
        );
    }

    if (error || !objectUrl) {
        return (
            <div className={`flex items-center justify-center bg-secondary-100 text-secondary-400 ${className}`}>
                <i className="bi bi-image-alt text-2xl"></i>
            </div>
        );
    }

    return (
        <img src={objectUrl} alt={alt} className={className} />
    );
};

export default SecureImage;