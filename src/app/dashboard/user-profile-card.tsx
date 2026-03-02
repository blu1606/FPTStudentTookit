import Image from "next/image";

type UserProfileCardProps = {
    userName: string;
    studentId: string;
    avatarUrl: string;
    onSettingsClick?: () => void;
};

export default function UserProfileCard({ userName, studentId, avatarUrl, onSettingsClick }: UserProfileCardProps) {
    return (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                onClick={onSettingsClick}
            >
                <Image
                    src={avatarUrl}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 dark:text-white truncate text-sm">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{studentId}</p>
                </div>
                <button
                    className="text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onSettingsClick) onSettingsClick();
                    }}
                >
                    <span className="material-symbols-outlined text-sm">settings</span>
                </button>
            </div>
        </div>
    );
}
