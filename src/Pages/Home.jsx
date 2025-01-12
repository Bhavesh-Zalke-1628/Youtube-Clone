import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { fetchRandomVideos, getChanelData } from '../Redux/Slice/BasicSliec';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { videos, status, pageToken, error, channelData } = useSelector((state) => state.basic);
    const observerRef = useRef(null); // Reference for the observer trigger

    // Fetch the initial set of videos when the component mounts
    useEffect(() => {
        dispatch(fetchRandomVideos());
    }, [dispatch]);

    // Fetch channel data for each video when the videos are available
    useEffect(() => {
        if (videos.length > 0) {
            videos.forEach((video) => {
                // Dispatch getChanelData for each video's channelId if not already fetched
                if (!channelData[video.snippet.channelId]) {
                    dispatch(getChanelData(video.snippet.channelId));
                }
            });
        }
    }, [videos, dispatch, channelData]);

    // Intersection Observer Callback
    const observerCallback = useCallback(
        (entries) => {
            const target = entries[0];
            if (target.isIntersecting && pageToken && status !== 'loading') {
                dispatch(fetchRandomVideos(pageToken));
            }
        },
        [dispatch, pageToken, status]
    );

    // Attach the Intersection Observer to the trigger element
    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, { threshold: 1.0 });
        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [observerCallback]);

    return (
        <Layout>
            <div className="mt-6 px-6 py-4 w-full h-full">
                {status === 'loading' && videos.length === 0 && <div>Loading...</div>}

                {status === 'succeeded' && (
                    <div>
                        {videos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {videos.map((videoItem) => (
                                    <div
                                        key={videoItem.id.videoId}  // Using videoId for unique key
                                        className="rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow cursor-pointer"
                                        onClick={() => navigate(`/video/${videoItem.id.videoId}`)}
                                    >
                                        <img
                                            src={videoItem.snippet.thumbnails.medium.url}
                                            alt={videoItem.snippet.title}
                                            className="w-full h-auto"
                                        />
                                        <div className="p-4">
                                            <h2 className="text-md font-semibold line-clamp-2 text-gray-800">
                                                {videoItem.snippet.title}
                                            </h2>
                                            <div className="flex items-center mt-3">
                                                <img
                                                    src={channelData[videoItem.snippet.channelId]?.snippet?.thumbnails?.default?.url || 'https://via.placeholder.com/32'}
                                                    alt={videoItem.snippet.channelTitle}
                                                    className="w-8 h-8 rounded-full mr-2"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {videoItem.snippet.channelTitle}
                                                </span>
                                            </div>
                                            {/* Display view count */}
                                            <div className="mt-2 text-sm text-gray-600">
                                                Views: {videoItem.statistics?.viewCount || '0'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>No videos available.</div>
                        )}
                    </div>
                )}

                {status === 'failed' && (
                    <div className="text-red-500">
                        Error: {error || 'Failed to load videos. Please try again later.'}
                    </div>
                )}

                {/* Trigger element for Intersection Observer */}
                <div
                    ref={observerRef}
                    className="h-12"
                    style={{ position: 'relative', bottom: '0', width: '100%' }}
                ></div>
            </div>
        </Layout>
    );
}

export default Home;
