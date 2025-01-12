import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { fetchVideoDetails } from '../Redux/Slice/VideoSlice';

function VideoPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { videoDetails, status, error } = useSelector((state) => state.video);
    const [channelLogo, setChannelLogo] = useState('');

    const data = useSelector((state) => state.video)

    useEffect(() => {
        if (id) {
            dispatch(fetchVideoDetails(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (videoDetails?.snippet?.channelId) {
            const fetchChannelLogo = async () => {
                try {
                    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${videoDetails.snippet.channelId}&key=YOUR_YOUTUBE_API_KEY`);
                    const data = await response.json();
                    const logoUrl = data.items[0]?.snippet?.thumbnails?.default?.url;
                    setChannelLogo(logoUrl || 'https://via.placeholder.com/32'); // fallback if no logo found
                } catch (error) {
                    console.error('Error fetching channel logo:', error);
                    setChannelLogo('https://via.placeholder.com/32'); // fallback logo
                }
            };

            fetchChannelLogo();
        }
    }, [videoDetails]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    if (!videoDetails) {
        return <div>No video details available</div>;
    }

    const { snippet, contentDetails, statistics } = videoDetails;
    const videoUrl = `https://www.youtube.com/embed/${id}`;

    return (
        <Layout>
            <div className="p-6">
                {/* Video Embed Section */}
                <div className="rounded-lg p-4 mb-4 w-full h-[50vh] sm:h-[60vh] lg:h-[70vh]">
                    <iframe
                        width="100%"  // Adjust to 100% width for responsiveness
                        height="100%" // Adjust to 100% height for responsiveness
                        src={videoUrl}
                        title={snippet.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Video Title */}
                <h1 className="text-xl font-bold max-w-full sm:max-w-xl truncate ml-4">{snippet.title}</h1>

                {/* Channel and Stats Section */}
                <div className="flex flex-col space-y-4 ml-4 mt-4">
                    <div className="flex items-center space-x-6">
                        <img
                            src={channelLogo}
                            alt={snippet.channelTitle}
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-600">{snippet.channelTitle}</span>
                        <span className="text-sm text-gray-500">{statistics.viewCount} views</span>
                        <span className="text-sm text-gray-500">{statistics.likeCount} likes</span>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex flex-wrap space-x-4 mt-4">
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                <path d="M6.4 0C5.247 0 4.3.87 4.3 1.955v8.646c0 .238.123.456.327.582L7 12.227V16h2V7h5.637c1.128 0 2.022-.982 1.947-2.071-.04-.414-.275-.794-.677-1.004-.201-.111-.429-.176-.664-.205-.079-.017-.159-.026-.238-.033l-.163-.003h-1.768V.984c0-.638-.516-1.155-1.153-1.155H6.4z" />
                            </svg>
                            <span>{statistics.viewCount}</span>
                            <span>Like</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
                                <path d="M1 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2l-2 2V3zm11 1H4v9h8V4z" />
                            </svg>
                            <span>Comment</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-share" viewBox="0 0 16 16">
                                <path d="M12.5 1a.5.5 0 0 1 .5.5v10.793l2.146-2.147a.5.5 0 0 1 .708.707l-3 3a.5.5 0 0 1-.707 0l-3-3a.5.5 0 0 1 .707-.707L12 11.293V1.5a.5.5 0 0 1 .5-.5z" />
                            </svg>
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default VideoPage;
