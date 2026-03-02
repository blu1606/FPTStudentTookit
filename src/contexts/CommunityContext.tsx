"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CommunityPost = {
    id: string;
    authorName: string;
    authorAvatar: string;
    timePosted: string;
    tags: string[];
    content: string;
    likes: number;
    comments: number;
};

const MOCK_POSTS: CommunityPost[] = [
    {
        id: "post-1",
        authorName: "Trần Văn A",
        authorAvatar: "https://i.pravatar.cc/100?img=3",
        timePosted: "2 giờ trước",
        tags: ["Java"],
        content: "Mọi người cho mình hỏi phần kết nối Database trong bài Assignment 1 với ạ. Mình bị lỗi connection timeout mãi mà không fix được. Có ai gặp lỗi tương tự không? 😢",
        likes: 12,
        comments: 5,
    },
    {
        id: "post-2",
        authorName: "Nguyễn Thị B",
        authorAvatar: "https://i.pravatar.cc/100?img=5",
        timePosted: "5 giờ trước",
        tags: ["Discrete Math"],
        content: "Mình vừa tổng hợp được bộ đề ôn thi môn Toán rời rạc (MAD101) từ các kỳ trước. Ai cần thì comment email mình gửi nhé! Chúc mọi người thi tốt 💯",
        likes: 45,
        comments: 20,
    },
];

type CommunityContextType = {
    posts: CommunityPost[];
    addPost: (post: Omit<CommunityPost, "id" | "likes" | "comments" | "authorAvatar" | "authorName" | "timePosted">) => void;
};

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem("planner_community_posts");
        if (saved) {
            try {
                setPosts(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse community posts", e);
                setPosts(MOCK_POSTS);
            }
        } else {
            setPosts(MOCK_POSTS);
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("planner_community_posts", JSON.stringify(posts));
        }
    }, [posts, isLoaded]);

    const addPost = (newPostData: Omit<CommunityPost, "id" | "likes" | "comments" | "authorAvatar" | "authorName" | "timePosted">) => {
        const newPost: CommunityPost = {
            id: crypto.randomUUID(),
            authorName: "Bạn (Current User)", // In a real app, this would come from an AuthContext
            authorAvatar: "https://i.pravatar.cc/100?img=11",
            timePosted: "Vừa xong",
            likes: 0,
            comments: 0,
            ...newPostData,
        };

        setPosts((prev) => [newPost, ...prev]);
    };

    return (
        <CommunityContext.Provider value={{ posts, addPost }}>
            {children}
        </CommunityContext.Provider>
    );
}

export function useCommunity() {
    const context = useContext(CommunityContext);
    if (context === undefined) {
        throw new Error("useCommunity must be used within a CommunityProvider");
    }
    return context;
}
