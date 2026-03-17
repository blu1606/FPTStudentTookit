import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#eadbcd] dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 nav-blur">
        <div className="max-w-[1200px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Smart Time Management Logo"
              width={40}
              height={40}
              className="size-10 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <h2 className="text-[#1d140c] dark:text-white text-xl font-bold tracking-tight">
              Smart Time Management
            </h2>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Tính năng
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Đánh giá
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Hỏi đáp
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle Component */}
            <ThemeToggle />

            <Link
              href="/auth/login"
              className="hidden sm:flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-primary-dark transition-colors text-white text-sm font-bold shadow-sm shadow-orange-200 dark:shadow-none"
            >
              <span>Bắt đầu ngay</span>
            </Link>
            {/* Mobile Menu */}
            <button className="md:hidden size-10 flex items-center justify-center text-[#1d140c] dark:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 px-6 overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute top-1/4 -right-24 size-96 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute bottom-1/4 -left-24 size-96 bg-purple-500/10 rounded-full blur-[100px] -z-10"></div>

          <div className="max-w-[1200px] w-full flex flex-col lg:flex-row gap-16 items-center">
            {/* Content */}
            <div className="flex flex-col gap-8 lg:w-1/2 text-left items-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Dành riêng cho sinh viên FPT
                </span>
              </div>
              <h1 className="text-[#1d140c] dark:text-white text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
                Học Ít Hơn, <br />
                <span className="text-primary relative inline-block">
                  Hiểu Nhiều Hơn
                  <svg
                    className="absolute w-full h-3 -bottom-2 left-0 text-primary/30"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 10"
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                    ></path>
                  </svg>
                </span>
              </h1>
              <p className="text-[#5c4028] dark:text-gray-300 text-lg md:text-xl font-normal leading-relaxed max-w-[540px]">
                Bộ công cụ quản lý thời gian tối ưu dành riêng cho sinh viên Đại
                học FPT để chinh phục mọi deadline và nâng cao GPA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center h-14 px-10 rounded-xl bg-primary hover:bg-primary-dark text-white text-lg font-bold shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  Bắt đầu miễn phí
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#8c6b4a] dark:text-gray-400 mt-4">
                <div className="flex -space-x-3">
                  <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-gray-200 overflow-hidden relative">
                    <Image
                      src="https://i.pravatar.cc/100?u=1"
                      alt="Student"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-gray-200 overflow-hidden relative">
                    <Image
                      src="https://i.pravatar.cc/100?u=2"
                      alt="Student"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-gray-200 overflow-hidden relative">
                    <Image
                      src="https://i.pravatar.cc/100?u=3"
                      alt="Student"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
                <p className="font-medium">
                  Được tin dùng bởi hơn 2,000+ sinh viên
                </p>
              </div>
            </div>
            {/* Visual Mockup */}
            <div className="lg:w-1/2 w-full relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-2xl -z-10 group-hover:bg-primary/30 transition-all duration-500"></div>
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border border-[#eadbcd] dark:border-white/10 p-4">
                {/* Mockup Content */}
                <div className="w-full h-full rounded-xl bg-[#FFF5EB] dark:bg-[#23190f] overflow-hidden flex flex-col shadow-inner">
                  <div className="h-8 border-b border-[#eadbcd] dark:border-white/5 flex items-center px-4 gap-1.5 bg-white/50 dark:bg-black/20">
                    <div className="size-2.5 rounded-full bg-red-400"></div>
                    <div className="size-2.5 rounded-full bg-yellow-400"></div>
                    <div className="size-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 p-6 grid grid-cols-12 gap-4">
                    <div className="col-span-8 flex flex-col gap-4">
                      <div className="h-12 w-2/3 bg-white dark:bg-white/5 rounded-lg shadow-sm"></div>
                      <div className="flex-1 bg-white dark:bg-white/5 rounded-xl shadow-sm p-4 flex flex-col gap-3">
                        <div className="h-4 w-full bg-primary/10 rounded"></div>
                        <div className="h-4 w-5/6 bg-primary/5 rounded"></div>
                        <div className="h-4 w-full bg-primary/10 rounded"></div>
                        <div className="flex-1 flex items-end gap-2 mt-4">
                          <div className="flex-1 h-1/2 bg-primary/20 rounded-t-lg animate-pulse"></div>
                          <div className="flex-1 h-3/4 bg-primary/40 rounded-t-lg"></div>
                          <div
                            className="flex-1 h-2/3 bg-primary/30 rounded-t-lg animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                          ></div>
                          <div className="flex-1 h-full bg-primary rounded-t-lg"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-4 flex flex-col gap-4">
                      <div className="h-24 bg-orange-100 dark:bg-primary/20 rounded-xl"></div>
                      <div className="h-24 bg-white dark:bg-white/5 rounded-xl shadow-sm"></div>
                      <div className="h-24 bg-white dark:bg-white/5 rounded-xl shadow-sm"></div>
                    </div>
                  </div>
                </div>
                {/* Phone Mockup Overlay */}
                <div className="absolute bottom-[-10%] right-[0%] w-[35%] aspect-[9/19] bg-gray-900 rounded-[2.5rem] border-4 border-gray-800 shadow-2xl hidden md:block transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500 overflow-hidden">
                  <div className="w-full h-full bg-white dark:bg-[#1d140c] flex flex-col">
                    <div className="h-6 w-full flex justify-center items-center">
                      <div className="w-16 h-4 bg-black rounded-b-xl"></div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="h-4 w-12 bg-primary/20 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-10 w-full bg-gray-50 dark:bg-white/5 rounded-lg"></div>
                        <div className="h-10 w-full bg-gray-50 dark:bg-white/5 rounded-lg"></div>
                        <div className="h-10 w-full bg-primary/10 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Awareness Section */}
        <section className="w-full flex justify-center py-24 px-6 bg-white dark:bg-[#1a120b] border-y border-[#eadbcd]/50 dark:border-white/5">
          <div className="max-w-[1200px] w-full flex flex-col gap-20">
            <div className="flex flex-col gap-4 text-center items-center">
              <h2 className="text-primary font-bold tracking-wider text-sm uppercase">
                Nỗi đau của sinh viên
              </h2>
              <h3 className="text-[#1d140c] dark:text-white text-3xl md:text-5xl font-black leading-tight max-w-[800px]">
                Bạn có đang gặp những khó khăn này mỗi học kỳ?
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1 */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-[#eadbcd] dark:border-white/5 bg-background-light dark:bg-background-dark p-8 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300">
                <div className="size-14 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-4xl">
                    schedule
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#1d140c] dark:text-white text-2xl font-bold leading-tight">
                    Trì hoãn
                  </h4>
                  <p className="text-[#8c6b4a] dark:text-gray-400 text-base leading-relaxed">
                    Dừng việc dồn mọi thứ vào ngày mai. Lập kế hoạch thông minh
                    giúp bạn chia nhỏ nhiệm vụ.
                  </p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-[#eadbcd] dark:border-white/5 bg-background-light dark:bg-background-dark p-8 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300">
                <div className="size-14 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-4xl">
                    notifications_active
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#1d140c] dark:text-white text-2xl font-bold leading-tight">
                    Quên Deadline
                  </h4>
                  <p className="text-[#8c6b4a] dark:text-gray-400 text-base leading-relaxed">
                    Không bao giờ bỏ lỡ nộp bài nữa với hệ thống nhắc nhở tự
                    động, cá nhân hóa thông minh.
                  </p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-[#eadbcd] dark:border-white/5 bg-background-light dark:bg-background-dark p-8 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300">
                <div className="size-14 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-4xl">
                    battery_alert
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#1d140c] dark:text-white text-2xl font-bold leading-tight">
                    Burnout
                  </h4>
                  <p className="text-[#8c6b4a] dark:text-gray-400 text-base leading-relaxed">
                    Cân bằng giữa việc học và cuộc sống. Chúng tôi nhắc bạn
                    nghỉ ngơi để tránh kiệt sức.
                  </p>
                </div>
              </div>
              {/* Card 4 */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-[#eadbcd] dark:border-white/5 bg-background-light dark:bg-background-dark p-8 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300">
                <div className="size-14 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-4xl">
                    trending_up
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#1d140c] dark:text-white text-2xl font-bold leading-tight">
                    Theo dõi GPA
                  </h4>
                  <p className="text-[#8c6b4a] dark:text-gray-400 text-base leading-relaxed">
                    Theo dõi điểm số thực tế để giữ mục tiêu học tập. Xem tiến
                    độ qua từng học kỳ trực quan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Tabs Section */}
        <section
          id="features"
          className="w-full flex justify-center py-24 px-6 overflow-hidden"
        >
          <div className="max-w-[1200px] w-full flex flex-col items-center">
            <div className="text-center mb-16 flex flex-col items-center">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3">
                Tối đa hóa tiềm năng
              </span>
              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-6 max-w-3xl text-[#1d140c] dark:text-white">
                Mọi thứ bạn cần để &quot;vượt vũ môn&quot; tại{" "}
                <span className="text-primary">Smart Time Management</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
                Dừng việc dùng quá nhiều ứng dụng rời rạc. Chúng tôi kết hợp
                mọi thứ vào một nơi.
              </p>
            </div>

            {/* Tabs Navigation */}
            <div className="w-full flex overflow-x-auto pb-4 mb-12 md:justify-center border-b border-[#eadbcd] dark:border-white/10 no-scrollbar">
              <div className="flex min-w-max gap-8 md:gap-12 px-4">
                <button className="flex flex-col items-center pb-4 border-b-4 border-primary transition-all">
                  <span className="text-primary font-bold text-lg whitespace-nowrap">
                    Lập lịch học tập
                  </span>
                </button>
                <button className="flex flex-col items-center pb-4 border-b-4 border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all">
                  <span className="font-bold text-lg whitespace-nowrap">
                    Quản lý Deadline
                  </span>
                </button>
                <button className="flex flex-col items-center pb-4 border-b-4 border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all">
                  <span className="font-bold text-lg whitespace-nowrap">
                    Trợ lý Mood
                  </span>
                </button>
                <button className="flex flex-col items-center pb-4 border-b-4 border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all">
                  <span className="font-bold text-lg whitespace-nowrap">
                    Theo dõi tiến độ
                  </span>
                </button>
              </div>
            </div>

            {/* Active Feature Content */}
            <div className="w-full bg-surface-light dark:bg-surface-dark rounded-3xl p-8 md:p-16 shadow-2xl shadow-orange-500/5 border border-gray-100 dark:border-white/5">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 flex flex-col gap-8">
                  <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-4xl">
                      calendar_month
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-[#1d140c] dark:text-white leading-tight">
                    Lập lịch thông minh đồng bộ với lịch học FPT
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    Không bao giờ phải nhập lịch học thủ công. Hệ thống tự động
                    đồng bộ từ cổng thông tin FPT và giúp bạn tìm ra khoảng
                    trống hoàn hảo để tự học.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex items-center justify-center size-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                        <span className="material-symbols-outlined text-sm font-bold">
                          check
                        </span>
                      </div>
                      <div>
                        <strong className="block text-[#1d140c] dark:text-white">
                          Kéo thả linh hoạt
                        </strong>
                        <p className="text-gray-500 dark:text-gray-400">
                          Dễ dàng di chuyển các khối thời gian học xung quanh
                          lịch học chính.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex items-center justify-center size-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                        <span className="material-symbols-outlined text-sm font-bold">
                          check
                        </span>
                      </div>
                      <div>
                        <strong className="block text-[#1d140c] dark:text-white">
                          Cảnh báo trùng lịch
                        </strong>
                        <p className="text-gray-500 dark:text-gray-400">
                          Thông báo ngay lập tức nếu có lịch thi hoặc sự kiện
                          quan trọng bị trùng.
                        </p>
                      </div>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <Link
                      href="#"
                      className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:gap-4 transition-all group"
                    >
                      Khám phá thêm
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="order-1 lg:order-2 relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#eadbcd] dark:border-white/5 bg-gray-100 dark:bg-gray-900">
                    <div className="h-8 bg-white dark:bg-gray-800 flex items-center px-4 gap-2 border-b border-[#eadbcd] dark:border-white/5">
                      <div className="size-2.5 rounded-full bg-red-400"></div>
                      <div className="size-2.5 rounded-full bg-yellow-400"></div>
                      <div className="size-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <Image
                      src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1000"
                      alt="App Preview"
                      width={1000}
                      height={562}
                      className="w-full aspect-video object-cover"
                      unoptimized
                    />
                    {/* Floating element overlay */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 dark:bg-gray-800/90 nav-blur rounded-xl border border-white/20 shadow-xl flex items-center gap-4 animate-bounce-slow">
                      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                          event_available
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Lịch học tiếp theo</p>
                        <p className="text-xs text-gray-500">
                          Môn: PRF192 - Phòng: AL-302
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary">
                        Trong 15p
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="w-full bg-white dark:bg-[#1a120b] border-y border-[#eadbcd]/50 dark:border-white/5 py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-black text-[#1d140c] dark:text-white mb-3">
                  1,200+
                </span>
                <span className="text-primary font-bold uppercase tracking-widest text-sm">
                  Sinh viên đang dùng
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-black text-[#1d140c] dark:text-white mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-5xl md:text-6xl text-green-500">
                    trending_up
                  </span>{" "}
                  0.6
                </span>
                <span className="text-primary font-bold uppercase tracking-widest text-sm">
                  GPA Trung bình tăng
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-black text-[#1d140c] dark:text-white mb-3">
                  50k+
                </span>
                <span className="text-primary font-bold uppercase tracking-widest text-sm">
                  Deadline đã hoàn thành
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="w-full flex justify-center py-24 px-6 bg-[#FFFAF0] dark:bg-background-dark"
        >
          <div className="max-w-[1200px] w-full flex flex-col">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1d140c] dark:text-white mb-6">
                Nghe từ những người dẫn đầu
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Gia nhập hàng trăm sinh viên đã biến các học kỳ hỗn loạn thành
                bảng điểm Dean&apos;s List.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="flex flex-col bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-xl shadow-orange-500/5 border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-1 text-primary mb-6">
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg italic leading-relaxed mb-8 flex-1">
                  &quot;Deadline Manager đã cứu sống mình trong kỳ Capstone. Mình
                  phải xoay sở với 3 dự án lớn cùng lúc và app này đã giữ cho
                  mình tỉnh táo. Từ 2.8 lên 3.5 GPA chỉ trong một học kỳ!&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-full bg-gray-200 overflow-hidden ring-4 ring-primary/10 relative">
                    <Image
                      src="https://i.pravatar.cc/150?u=minhanh"
                      alt="User"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[#1d140c] dark:text-white">
                      Minh Anh
                    </p>
                    <p className="text-sm text-gray-500">
                      Software Engineering (SE)
                    </p>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="flex flex-col bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-xl shadow-orange-500/5 border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-1 text-primary mb-6">
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star_half
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg italic leading-relaxed mb-8 flex-1">
                  &quot;Cuối cùng cũng có một công cụ hiểu được lịch học block
                  của FPT. Việc kéo thả để lập lịch rất trực quan so với việc
                  dùng bảng Excel.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-full bg-gray-200 overflow-hidden ring-4 ring-primary/10 relative">
                    <Image
                      src="https://i.pravatar.cc/150?u=tuankiet"
                      alt="User"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[#1d140c] dark:text-white">
                      Tuấn Kiệt
                    </p>
                    <p className="text-sm text-gray-500">
                      Kinh doanh quốc tế
                    </p>
                  </div>
                </div>
              </div>
              {/* Testimonial 3 */}
              <div className="flex flex-col bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-xl shadow-orange-500/5 border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-1 text-primary mb-6">
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                  <span className="material-symbols-outlined font-fill">
                    star
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg italic leading-relaxed mb-8 flex-1">
                  &quot;Mình rất thích trợ lý mood. Nó thực sự đã cảnh báo mình
                  về burnout trước khi mình kiệt sức trong tuần thi cuối kỳ.
                  Rất đề xuất cho các bạn fresher.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-full bg-gray-200 overflow-hidden ring-4 ring-primary/10 relative">
                    <Image
                      src="https://i.pravatar.cc/150?u=lanhuong"
                      alt="User"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[#1d140c] dark:text-white">
                      Lan Hương
                    </p>
                    <p className="text-sm text-gray-500">
                      Thiết kế đồ họa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="w-full flex justify-center py-24 px-6 bg-white dark:bg-[#1a120b]"
        >
          <div className="max-w-[800px] w-full flex flex-col">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1d140c] dark:text-white mb-6">
                Câu hỏi thường gặp
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Giải đáp những thắc mắc phổ biến của sinh viên FPT
              </p>
            </div>
            <div className="space-y-4">
              <details className="group rounded-2xl border border-[#eadbcd] dark:border-white/5 bg-[#FFFAF0] dark:bg-background-dark overflow-hidden transition-all duration-300">
                <summary className="flex cursor-pointer items-center justify-between p-6 select-none group-hover:bg-primary/5 transition-colors">
                  <p className="text-lg font-bold">
                    Smart Time Management có miễn phí cho sinh viên không?
                  </p>
                  <span className="material-symbols-outlined text-primary chevron-icon">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 border-t border-[#eadbcd] dark:border-white/5 mt-0">
                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pt-4">
                    Có, gói cơ bản (Basic) hoàn toàn miễn phí cho tất cả sinh
                    viên sử dụng email đuôi @fpt.edu.vn. Gói này bao gồm các
                    tính năng quản lý thời khóa biểu và nhắc nhở cơ bản.
                  </p>
                </div>
              </details>
              <details className="group rounded-2xl border border-[#eadbcd] dark:border-white/5 bg-[#FFFAF0] dark:bg-background-dark overflow-hidden transition-all duration-300">
                <summary className="flex cursor-pointer items-center justify-between p-6 select-none group-hover:bg-primary/5 transition-colors">
                  <p className="text-lg font-bold">
                    Nó có đồng bộ với lịch học FPT không?
                  </p>
                  <span className="material-symbols-outlined text-primary chevron-icon">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 border-t border-[#eadbcd] dark:border-white/5 mt-0">
                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pt-4">
                    Chắc chắn rồi! Smart Time Management được thiết kế để tích
                    hợp trực tiếp với hệ thống FAP của FPT University. Bạn chỉ
                    cần đồng bộ tài khoản và lịch học sẽ tự động được cập nhật.
                  </p>
                </div>
              </details>
              <details className="group rounded-2xl border border-[#eadbcd] dark:border-white/5 bg-[#FFFAF0] dark:bg-background-dark overflow-hidden transition-all duration-300">
                <summary className="flex cursor-pointer items-center justify-between p-6 select-none group-hover:bg-primary/5 transition-colors">
                  <p className="text-lg font-bold">
                    Tôi có thể sử dụng trên điện thoại không?
                  </p>
                  <span className="material-symbols-outlined text-primary chevron-icon">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 border-t border-[#eadbcd] dark:border-white/5 mt-0">
                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pt-4">
                    Smart Time Management được tối ưu hóa hoàn toàn cho thiết bị
                    di động dưới dạng Progressive Web App. Bạn có thể cài đặt
                    trực tiếp lên màn hình chính điện thoại để dùng như app
                    native.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-24 px-6 overflow-hidden relative">
          <div className="max-w-[1200px] mx-auto">
            <div className="bg-gradient-to-br from-[#1d140c] to-[#3a2d20] rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/20 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 size-96 bg-purple-500/20 rounded-full blur-[120px]"></div>

              <div className="relative z-10 flex flex-col items-center gap-8">
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  Sẵn sàng để làm chủ <br /> học kỳ này?
                </h2>
                <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto">
                  Gia nhập cộng đồng sinh viên FPT xuất sắc ngay hôm nay. Bắt
                  đầu miễn phí và không cần thẻ tín dụng.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mt-4">
                  <Link
                    href="/auth/login"
                    className="h-16 flex items-center justify-center px-12 rounded-2xl bg-primary hover:bg-primary-dark text-white text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/20 active:scale-95"
                  >
                    Bắt đầu nâng cao GPA
                  </Link>
                  <button className="h-16 px-12 rounded-2xl bg-white/10 border-2 border-white/20 hover:bg-white/20 text-white text-xl font-bold transition-all active:scale-95">
                    Xem Demo
                  </button>
                </div>
                <p className="text-gray-500 text-sm italic">
                  *Đăng ký bằng Google Email FPT để được ưu tiên.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a120b] text-white pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Smart Time Management Logo"
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
                <h2 className="text-2xl font-bold tracking-tight">
                  Smart Time Management
                </h2>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Nền tảng quản lý học tập toàn diện dành riêng cho sinh viên Đại
                học FPT. Giúp bạn sắp xếp thời gian thông minh và đạt kết quả
                tốt nhất.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                >
                  <span className="font-bold">fb</span>
                </Link>
                <Link
                  href="#"
                  className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                >
                  <span className="font-bold">in</span>
                </Link>
                <Link
                  href="#"
                  className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                >
                  <span className="font-bold">ig</span>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-8">Liên kết nhanh</h3>
              <ul className="space-y-4 text-gray-400 text-lg">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-primary transition-colors"
                  >
                    Tính năng
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonials"
                    className="hover:text-primary transition-colors"
                  >
                    Đánh giá
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="hover:text-primary transition-colors"
                  >
                    Hỏi đáp
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-8">Hỗ trợ</h3>
              <ul className="space-y-4 text-gray-400 text-lg">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Điều khoản dịch vụ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold">Đăng ký nhận tin</h3>
              <p className="text-gray-400">
                Nhận mẹo học tập và cập nhật mới nhất.
              </p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 text-white focus:outline-none focus:border-primary transition-colors"
                />
                <button className="absolute right-2 top-2 h-10 px-4 bg-primary rounded-lg font-bold hover:bg-primary-dark transition-colors">
                  Gửi
                </button>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-center md:text-left">
              © 2024 Smart Time Management. Không chính thức thuộc về Đại học
              FPT.
            </p>
            <div className="flex gap-8 text-gray-500 text-sm">
              <Link href="#" className="hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white">
                Terms
              </Link>
              <Link href="#" className="hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
