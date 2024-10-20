import React, { useEffect, useState } from 'react';

const Card = ({ contract, address, data }) => {
    const [images, setImages] = useState(data || []); // Initialize with passed data or empty array
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            if (!contract || !address) return;
            try {
                const fetchedItems = await contract.togetimgaccess(address);
                console.log("Fetched images:", fetchedItems);

                // Append new images only if `data` already has some items
                if (data && data.length > 0) {
                    setImages((prevImages) => [...prevImages, ...fetchedItems]);
                } else {
                    if (fetchedItems && fetchedItems.length > 0) {
                        setImages(fetchedItems); // Use fetched items if no initial data
                    }
                    
                }

                setError(null); // Clear any previous errors
            } catch (err) {
                console.error("Error fetching images:", err);
                setError("Error fetching images. Ensure you have access and images exist.");
                setImages([]); // Clear images on error
            }
        };

        fetchImages();
    }, [contract, address, data]); // Also depend on `data` to react to prop updates

    return (
        <div className="container my-5">
            {error && <p className="text-danger text-center">{error}</p>}
            {images.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {images.map((img, index) => (
                        <div key={index} className="col">
                            <div className="card shadow-sm" style={{ maxHeight: '300px', objectFit: 'cover' }}>
                                <img
                                    src={img}
                                    alt={`Uploaded Image ${index}`}
                                    className="card-img img-fluid"
                                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center fs-4">No images found for this address.</p>
            )}
        </div>
    );
};

export default Card;
