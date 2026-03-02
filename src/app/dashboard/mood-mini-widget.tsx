import Image from "next/image";

type MoodMiniWidgetProps = {
    onNavigate: (sectionId: string) => void;
};

export default function MoodMiniWidget({ onNavigate }: MoodMiniWidgetProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-80">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                    <span className="material-symbols-outlined text-warning mr-2">sentiment_satisfied</span>
                    Trợ lý cảm xúc
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                <div className="flex items-end">
                    <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJhDW-B-yTTcCLESGkflkLBu8p0FQzSbPmIguJSwvF3cliyyN0--1Nsw42DW2HMNOSF5X0rY3G4_pMxu2K_0UgA4fOyY4jz__k3DNbrAKI-qJMh8o6Dz1RyfpNdLsiEwQDIyZ-93ZncA2X4YxprYJoDv6ku7GFS5yFzQm7G5fn9Gp1rY6IbNkQWeiJZE9VVFNh4XK-6GqCvc9A4pHyE_YYA1bFTbNsoSIkqhK-oxoT99H84W2geVDclEXyIl9iRF75HUHbfjDZpkA" alt="Bot" width={32} height={32} className="w-8 h-8 rounded-full mb-1 mr-2 shadow-sm" unoptimized />
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-none p-3 text-sm text-gray-700 dark:text-gray-200 max-w-[85%]">
                        Chào Minh Nhật! Hôm nay cậu cảm thấy thế nào? Có vẻ như cậu đang có nhiều bài tập nhỉ? 💪
                    </div>
                </div>
                <div className="flex items-end justify-end">
                    <div className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded-2xl rounded-br-none p-3 text-sm max-w-[85%] font-medium">
                        Mình đang hơi stress vì deadline môn Toán quá... 😓
                    </div>
                </div>
                <div className="flex items-end">
                    <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNMHmX0Yxr8d8IcX8Oj_gKm78l1SRIXWQyuPRVJE_VfagQxjEY_-e6wmdfWZG4w4caq5zGG_4RXm0_wldrlQb3IFhGa1LsNvocRsdxsT95LSn3WoYzo5SZITmrwJJvc-d0rK6c885tXd7N158NLfivw0Al4cBoifx49YTdnTa-_v-z_bcKC4Qc23ru3wnUwNX_CNGHLjxPU2pU8_VEQDqodxYRN795ImgCwbAjw-s2nSMExWn7ietgUI10urR_uMqlAUT9dUvvz3E" alt="Bot" width={32} height={32} className="w-8 h-8 rounded-full mb-1 mr-2 shadow-sm" unoptimized />
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-none p-3 text-sm text-gray-700 dark:text-gray-200 max-w-[85%]">
                        Đừng lo! Hít thở sâu nào. Mình gợi ý cậu nên chia nhỏ bài tập Toán ra làm trong 45 phút rồi nghỉ 5 phút nhé. Cố lên! ✨
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center">
                <input type="text" placeholder="Nhập cảm xúc..." className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all" />
                <button className="ml-2 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors transform active:scale-95" onClick={() => onNavigate("mood")}>
                    <span className="material-symbols-outlined text-lg">send</span>
                </button>
            </div>
        </div>
    );
}
