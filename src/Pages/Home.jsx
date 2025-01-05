import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingVideos, fetchChannelThumbnail } from "../Redux/Slice/BasicSliec";
import Layout from "../Layout/Layout";
import axios from "axios";

function Home() {
    const dispatch = useDispatch();
    const { video, status, error } = useSelector((state) => state.basic);

    const [channelThumbnails, setChannelThumbnails] = useState({});

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchTrendingVideos());
        }
    }, [status, dispatch]);

    useEffect(() => {
        const loadChannelThumbnails = async () => {
            const thumbnails = {};
            await Promise.all(
                video.map(async (videoItem) => {
                    const channelId = videoItem.snippet.channelId;
                    if (channelId && !thumbnails[channelId]) {
                        try {
                            const thumbnail = await fetchChannelThumbnail(channelId);
                            thumbnails[channelId] = thumbnail;
                        } catch (error) {
                            console.error(`Error fetching thumbnail for ${channelId}:`, error);
                            thumbnails[channelId] = "https://via.placeholder.com/32"; // Fallback placeholder
                        }
                    }
                })
            );
            setChannelThumbnails(thumbnails);
        };

        if (video.length > 0) {
            loadChannelThumbnails();
        }
    }, [video]);

    return (
        <Layout>
            <div className="mt-6 px-6 py-4 w-full h-full">
                {
                    (status === "loading") ? (
                        <div className="text-center text-lg font-medium text-gray-700">
                            Loading...
                        </div>
                    ) : (status === "succeeded") ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {video.map((videoItem) => (
                                <div key={videoItem.id} className="rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow">
                                    <img
                                        src={videoItem.snippet.thumbnails.medium.url}
                                        alt={videoItem.snippet.title}
                                        className="w-full h-auto"
                                    />
                                    <div className="p-4">
                                        <h2 className="text-md font-semibold line-clamp-2 text-gray-800">
                                            {videoItem.snippet.title}
                                        </h2>

                                        {/* Channel Block */}
                                        <div className="flex items-center mt-3">
                                            <img
                                                src={channelThumbnails[videoItem.snippet.channelId] || "https://via.placeholder.com/32"}
                                                alt={videoItem.snippet.channelTitle}
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {videoItem.snippet.channelTitle}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-red-500 text-lg font-medium">
                            Error: {error || "Failed to load videos."}
                        </div>
                    )
                }
            </div>
        </Layout>
    );
}

export default Home;
