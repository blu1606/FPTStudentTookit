"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Comment = {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timePosted: string;
};

export type CommunityPost = {
    id: string;
    authorName: string;
    authorAvatar: string;
    timePosted: string;
    tags: string[];
    content: string;
    likes: number;
    comments: Comment[];
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
        comments: [
            {
                id: "comment-1-1",
                authorName: "Nguyễn Văn C",
                authorAvatar: "https://i.pravatar.cc/100?img=12",
                content: "Bạn check lại port MySQL trong file config xem đúng 3306 chưa nhé.",
                timePosted: "1 giờ trước"
            },
            {
                id: "comment-1-2",
                authorName: "Lê Thị D",
                authorAvatar: "https://i.pravatar.cc/100?img=20",
                content: "Thêm `?serverTimezone=UTC` vào chuỗi kết nối thử xem bạn.",
                timePosted: "30 phút trước"
            }
        ],
    },
    {
        id: "post-2",
        authorName: "Nguyễn Thị B",
        authorAvatar: "https://i.pravatar.cc/100?img=5",
        timePosted: "5 giờ trước",
        tags: ["Discrete Math"],
        content: "Mình vừa tổng hợp được bộ đề ôn thi môn Toán rời rạc (MAD101) từ các kỳ trước. Ai cần thì comment email mình gửi nhé! Chúc mọi người thi tốt 💯",
        likes: 45,
        comments: [
            {
                id: "comment-2-1",
                authorName: "Phạm Minh E",
                authorAvatar: "https://i.pravatar.cc/100?img=15",
                content: "Cho mình xin với nhé. Email: phamminhe@fpt.edu.vn",
                timePosted: "4 giờ trước"
            },
            {
                id: "comment-2-2",
                authorName: "Hoàng Văn F",
                authorAvatar: "https://i.pravatar.cc/100?img=8",
                content: "Thanks bạn. Cho mình xin với nha: hoangvanf@fpt.edu.vn",
                timePosted: "3 giờ trước"
            }
        ],
    },
];

type CommunityContextType = {
    posts: CommunityPost[];
    addPost: (post: Omit<CommunityPost, "id" | "likes" | "comments" | "authorAvatar" | "authorName" | "timePosted">) => void;
    addComment: (postId: string, content: string) => void;
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
                const parsed = JSON.parse(saved);
                // Schema Migration: convert numeric comments to empty array for old data
                const migrated = parsed.map((post: any) => ({
                    ...post,
                    comments: Array.isArray(post.comments) ? post.comments : []
                }));
                setPosts(migrated);
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
            comments: [],
            ...newPostData,
        };

        setPosts((prev) => [newPost, ...prev]);
    };

    const addComment = (postId: string, content: string) => {
        setPosts((prev) =>
            prev.map((post) => {
                if (post.id === postId) {
                    const newComment: Comment = {
                        id: crypto.randomUUID(),
                        authorName: "Bạn (Current User)",
                        authorAvatar: "https://i.pravatar.cc/100?img=11",
                        content,
                        timePosted: "Vừa xong",
                    };
                    return { ...post, comments: [...(Array.isArray(post.comments) ? post.comments : []), newComment] };
                }
                return post;
            })
        );
    };

    return (
        <CommunityContext.Provider value={{ posts, addPost, addComment }}>
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
