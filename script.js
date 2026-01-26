document.addEventListener('DOMContentLoaded', () => {
    // === Dark Mode Logic ===
    const html = document.documentElement;
    const themeToggles = document.querySelectorAll('.theme-toggle');

    // Check system preference or saved local storage
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            html.classList.toggle('dark');
            if (html.classList.contains('dark')) {
                localStorage.theme = 'dark';
            } else {
                localStorage.theme = 'light';
            }
        });
    });

    // === Navigation Logic ===
    // === Navigation Logic ===
    const sections = document.querySelectorAll('.dashboard-section');
    const pageTitle = document.getElementById('page-title');
    const sidebarNav = document.getElementById('sidebar-nav');
    // Also keep legacy selection for updating active state if needed, though delegation handles clicks
    const navLinks = document.querySelectorAll('.nav-link');

    console.log('Script loaded. Nav initialized.');

    function setActiveSection(sectionId) {
        console.log('Switching to section:', sectionId);

        // Hide all sections
        sections.forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('fade-in');
        });

        // Show target section
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.remove('hidden');
            // Slight delay to ensure DOM update allows animation re-trigger if needed, 
            // but just adding class is usually enough
            requestAnimationFrame(() => {
                target.classList.add('fade-in');
            });
        } else {
            console.error('Section not found:', sectionId);
        }

        // Update Nav State
        navLinks.forEach(link => {
            if (link.dataset.target === sectionId) {
                link.classList.add('bg-primary/10', 'text-primary');
                link.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');

                // Update Page Title
                const iconElement = link.querySelector('.material-icons-round');
                const textElement = link.querySelector('span:last-child');
                if (pageTitle && iconElement && textElement) {
                    const icon = iconElement.innerText;
                    const text = textElement.innerText;
                    pageTitle.innerHTML = `<span class="material-icons-round mr-2 text-primary">${icon}</span>${text}`;
                }

            } else {
                link.classList.remove('bg-primary/10', 'text-primary');
                link.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');
            }
        });
    }

    // Event Delegation for Navigation
    if (sidebarNav) {
        sidebarNav.addEventListener('click', (e) => {
            const link = e.target.closest('.nav-link');
            if (link) {
                e.preventDefault();
                const targetId = link.dataset.target;
                if (targetId) {
                    setActiveSection(targetId);
                    // On mobile, close sidebar after click
                    if (window.innerWidth < 768) {
                        const sidebar = document.querySelector('aside');
                        const overlay = document.getElementById('mobile-overlay');
                        if (sidebar && overlay) {
                            sidebar.classList.add('-translate-x-full');
                            sidebar.classList.remove('translate-x-0');
                            overlay.classList.add('hidden');
                        }
                    }
                }
            }
        });
    } else {
        // Fallback for individual listeners if sidebar-nav ID missing
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.dataset.target;
                setActiveSection(targetId);
            });
        });
    }

    // Default to overview
    setActiveSection('overview');

    // === Mobile Menu ===
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('aside');
    const overlay = document.getElementById('mobile-overlay');

    if (menuBtn && sidebar && overlay) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            sidebar.classList.toggle('translate-x-0');
            overlay.classList.toggle('hidden');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
            overlay.classList.add('hidden');
        });
    }

    // === Chart Initialization (Academic Section) ===
    // We wrap this in a try-catch or check existence to prevent errors if chart.js isn't loaded yet or canvas missing
    const ctx = document.getElementById('gpaChart');
    if (ctx && typeof Chart !== 'undefined') {
        const gpaChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
                datasets: [{
                    label: 'GPA',
                    data: [3.2, 3.4, 3.3, 3.5, 3.6, 3.65],
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    borderColor: '#F97316',
                    borderWidth: 3,
                    tension: 0.4,
                    pointBackgroundColor: '#FFFFFF',
                    pointBorderColor: '#F97316',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1F2937',
                        titleColor: '#F9FAFB',
                        bodyColor: '#F9FAFB',
                        borderColor: '#374151',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 2.0,
                        max: 4.0,
                        grid: { color: 'rgba(107, 114, 128, 0.1)', borderDash: [5, 5] },
                        ticks: { color: '#6B7280', font: { family: "'Nunito', sans-serif" } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#6B7280', font: { family: "'Nunito', sans-serif" } }
                    }
                }
            }
        });

        // Theme update listener for Chart
        const updateChartTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            const gridColor = isDark ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)';
            const textColor = isDark ? '#9CA3AF' : '#6B7280';

            if (gpaChart.options.scales.y) {
                gpaChart.options.scales.y.grid.color = gridColor;
                gpaChart.options.scales.y.ticks.color = textColor;
            }
            if (gpaChart.options.scales.x) {
                gpaChart.options.scales.x.ticks.color = textColor;
            }
            gpaChart.update();
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    updateChartTheme();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        // Initial check
        if (document.documentElement.classList.contains('dark')) updateChartTheme();
    }

    // === Chat Interaction Logic ===
    const chatContainer = document.getElementById('chat-messages');
    const chatInput = document.querySelector('#mood input[type="text"]');
    const sendBtn = document.querySelector('#mood button .material-icons-round').parentNode; // Select parent button of icon

    if (chatContainer && chatInput && sendBtn) {
        const scrollToBottom = () => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        };

        const addMessage = (text, isUser = false) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = isUser ? 'flex items-end gap-3 flex-row-reverse fade-in' : 'flex items-end gap-3 fade-in';

            const avatar = isUser
                ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvCI3SrwCoYcJiYTZ4AGbPtBMepDpZLrtzqykoCdWCqN1xuXEiubqXcohcWyIUY0DRj3jHR-6RDQGkYTSn2Joqx-axTn1dGWar50otjVgUfzkWKtvKPFjVq7zlTaQTY5Ml_fIJPLPJ7hDuNY2uKHatA_7G3pmnyLHAV7j8kNmfYGk1dZawp01wb93o_7XTybip7-c4Cb4bmOyuOV5sqQn7s0xvWLbsQK79sOoI9ei1K0BAzSTe77mDizmgU0bmgS-o_DUJMACXNEg'
                : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJhDW-B-yTTcCLESGkflkLBu8p0FQzSbPmIguJSwvF3cliyyN0--1Nsw42DW2HMNOSF5X0rY3G4_pMxu2K_0UgA4fOyY4jz__k3DNbrAKI-qJMh8o6Dz1RyfpNdLsiEwQDIyZ-93ZncA2X4YxprYJoDv6ku7GFS5yFzQm7G5fn9Gp1rY6IbNkQWeiJZE9VVFNh4XK-6GqCvc9A4pHyE_YYA1bFTbNsoSIkqhK-oxoT99H84W2geVDclEXyIl9iRF75HUHbfjDZpkA';

            const bubbleClass = isUser
                ? 'bg-primary text-white p-4 rounded-2xl rounded-br-none shadow-md max-w-[80%] text-sm leading-relaxed'
                : 'bg-white dark:bg-gray-700 p-4 rounded-2xl rounded-bl-none shadow-sm max-w-[80%] text-sm text-gray-700 dark:text-gray-200 leading-relaxed border border-gray-100 dark:border-gray-600';

            msgDiv.innerHTML = `
                <img src="${avatar}" class="w-8 h-8 rounded-full mb-2 shadow-sm">
                <div class="${bubbleClass}">
                    ${text}
                </div>
            `;
            chatContainer.appendChild(msgDiv);
            scrollToBottom();
        };

        const handleSend = () => {
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, true);
            chatInput.value = '';

            // Simulate Bot Typing/Response
            setTimeout(() => {
                const responses = [
                    "Mình hiểu rồi. Cậu cứ bình tĩnh nhé! ✨",
                    "Nghe có vẻ thú vị đấy! Kể thêm cho mình đi.",
                    "Cậu đã làm rất tốt rồi, cố lên nào! 💪",
                    "Đừng quên nghỉ ngơi một chút nhé 🍵",
                    "Thử áp dụng Pomodoro xem sao? ⏱️"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, false);
            }, 1000);
        };

        sendBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    // === Notification System ===
    const showNotification = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transform translate-y-20 opacity-0 transition-all duration-300 z-50 ${type === 'success' ? 'bg-white dark:bg-gray-800 border-l-4 border-green-500 text-gray-800 dark:text-white' :
            'bg-white dark:bg-gray-800 border-l-4 border-blue-500 text-gray-800 dark:text-white'
            }`;

        const icon = type === 'success' ? 'check_circle' : 'info';
        const color = type === 'success' ? 'text-green-500' : 'text-blue-500';

        toast.innerHTML = `
            <span class="material-icons-round ${color}">${icon}</span>
            <span class="font-bold text-sm">${message}</span>
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-20', 'opacity-0');
        });

        // Remove after 3s
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Bind generic actions for demo
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.hasAttribute('onclick') && !btn.classList.contains('theme-toggle') && !btn.id && !btn.closest('#mood')) {
            btn.addEventListener('click', (e) => {
                // Ignore if it's already handled (like nav buttons which have listeners)
                if (btn.closest('.nav-link')) return;

                const text = btn.innerText.trim();
                if (text.includes('Thêm') || text.includes('New') || text.includes('Add')) {
                    showNotification('Đã mở form thêm mới!', 'success');
                } else if (text.includes('Filter') || text.includes('Chi tiết')) {
                    showNotification('Tính năng đang phát triển', 'info');
                }
            });
        }
    });

    // === Planner View Logic ===
    const plannerWeekView = document.getElementById('planner-week-view');
    const plannerMonthView = document.getElementById('planner-month-view');
    const plannerViewBtns = document.querySelectorAll('#planner-view-toggle button');
    const plannerDateDisplay = document.getElementById('planner-date-display');

    if (plannerWeekView && plannerMonthView && plannerViewBtns.length > 0) {
        plannerViewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;

                // Update UI State
                plannerViewBtns.forEach(b => {
                    if (b.dataset.view === view) {
                        b.classList.remove('bg-white', 'dark:bg-gray-600', 'text-gray-600', 'dark:text-gray-300', 'hover:text-gray-900', 'dark:hover:text-white');
                        b.classList.add('bg-white', 'dark:bg-gray-600', 'text-primary', 'shadow-sm');
                    } else {
                        b.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:text-gray-900', 'dark:hover:text-white');
                        b.classList.remove('bg-white', 'dark:bg-gray-600', 'text-primary', 'shadow-sm');
                    }
                });

                // Toggle Views
                if (view === 'month') {
                    plannerWeekView.classList.add('hidden');
                    plannerMonthView.classList.remove('hidden');
                    plannerDateDisplay.innerText = 'Tháng 4, 2024';
                } else if (view === 'week') {
                    plannerWeekView.classList.remove('hidden');
                    plannerMonthView.classList.add('hidden');
                    plannerDateDisplay.innerText = '22 - 28 Tháng 4, 2024';
                } else if (view === 'day') {
                    showNotification('Chế độ xem Ngày đang phát triển', 'info');
                    // Reset to week visually for now
                    setTimeout(() => {
                        plannerViewBtns[1].click();
                    }, 500);
                }
            });
        });
    }

    // === Quick Add FAB Logic ===
    const plannerFab = document.getElementById('planner-fab');
    if (plannerFab) {
        plannerFab.addEventListener('click', () => {
            showNotification('Đã mở Quick Add Task!', 'success');
            // Animate button
            plannerFab.classList.add('rotate-90');
            setTimeout(() => plannerFab.classList.remove('rotate-90'), 300);
        });
    }

    // === Drag & Drop Implementation ===
    const initDragAndDrop = () => {
        const plannerWeekViewContainer = document.getElementById('planner-week-view');
        if (!plannerWeekViewContainer) return;

        // Select the content grid specifically (it has grid-rows-1 and is flex-1)
        // The first .grid is the header.
        const gridContainer = plannerWeekViewContainer.querySelector('.grid.grid-rows-1');

        if (!gridContainer) {
            console.error("Grid container not found");
            return;
        }

        // Select all task elements - strictly those that are absolute positioned tasks
        const tasks = plannerWeekViewContainer.querySelectorAll('.absolute.z-10, .absolute.z-50');

        // Grid Constants (matching 80px = 1 hour)
        const PIXELS_PER_HOUR = 80;
        const GRID_START_HOUR = 8;
        const SNAP_MINUTES = 15;
        const PIXELS_PER_SNAP = (PIXELS_PER_HOUR / 60) * SNAP_MINUTES;

        tasks.forEach(task => {
            task.classList.add('task-card'); // Add class for styling

            task.addEventListener('mousedown', (e) => {
                // Prevent drag if clicking buttons inside (like the 'more' button)
                if (e.target.closest('button')) return;

                e.preventDefault(); // Prevent text selection

                const startX = e.clientX;
                const startY = e.clientY;
                const rect = task.getBoundingClientRect();

                // Offset of mouse within the element
                const offsetX = startX - rect.left;
                const offsetY = startY - rect.top;

                // Initial styles
                const originalLeft = task.style.left || window.getComputedStyle(task).left;
                const originalTop = task.style.top || window.getComputedStyle(task).top;
                const originalWidth = rect.width;
                const originalHeight = rect.height;

                // Visual Feedback
                task.classList.add('dragging');
                task.style.width = `${originalWidth}px`; // Fix width during drag
                task.style.height = `${originalHeight}px`; // Fix height
                task.style.position = 'fixed';
                task.style.left = `${rect.left}px`;
                task.style.top = `${rect.top}px`;
                task.style.zIndex = '9999';

                // Helper to get grid column based on X position
                const getColumnIndex = (x) => {
                    const gridRect = gridContainer.getBoundingClientRect();
                    const relativeX = x - gridRect.left;
                    const colWidth = gridRect.width / 7;
                    let col = Math.floor(relativeX / colWidth);
                    return Math.max(0, Math.min(6, col)); // Clamp between 0 and 6
                };

                const onMouseMove = (moveEvent) => {
                    // Update fixed position to follow mouse
                    task.style.left = `${moveEvent.clientX - offsetX}px`;
                    task.style.top = `${moveEvent.clientY - offsetY}px`;
                };

                const onMouseUp = (upEvent) => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);

                    task.classList.remove('dragging');
                    task.style.position = 'absolute';
                    task.style.zIndex = '';
                    task.style.width = 'calc(100% - 8px)'; // Reset to responsive width with padding
                    task.style.left = '4px'; // Center in column
                    task.style.height = '';

                    const gridRect = gridContainer.getBoundingClientRect();

                    // 1. Determine Column (Day)
                    const dropX = upEvent.clientX;
                    const colIndex = getColumnIndex(dropX);

                    // 2. Determine Row (Time)
                    const scrollContainer = plannerWeekViewContainer.querySelector('.flex-1.overflow-auto');
                    const scrollTop = scrollContainer.scrollTop;

                    // Calculate Y relative to the grid container
                    const relY = upEvent.clientY - gridRect.top - offsetY + scrollTop;
                    // Wait, "Week Grid" is `relative flex-1 ... grid`. It is inside `flex-1 overflow-auto relative`.
                    // So if we scroll, the grid container itself moves up?
                    // No, the parent scrolls. The grid container is the content.

                    // Let's assume the gridContainer IS the relative parent.
                    // `top` is relative to it.

                    // Snap to Logic
                    // Round relY to nearest slot
                    const snappedY = Math.round(relY / PIXELS_PER_SNAP) * PIXELS_PER_SNAP;

                    // Bound checks
                    const maxTop = (18 - GRID_START_HOUR) * PIXELS_PER_HOUR; // Until 18:00
                    const finalTop = Math.max(0, Math.min(snappedY, maxTop));

                    // Update Task Position
                    // 1. Move DOM element to the correct column div
                    // The grid has 7 columns of 1 row? 
                    // <div class="relative h-full col-start-1 col-end-2 ...">
                    // Tasks are inside these column-specific divs.

                    // We need to find the target column container.
                    // The grid structure is:
                    // background lines (absolute)
                    // vertical dividers (absolute)
                    // ... columns (relative h-full col-start-X ...)

                    // Columns are 1-indexed for CSS Grid lines, but let's assume standard divs order match grid-cols-7
                    // The columns containing tasks are:
                    // div.col-start-1 (Mon)
                    // div.col-start-2 (Tue)
                    // ...

                    // We can query them by class or just index relative to existing children?
                    // They are children of the .grid container.
                    // Selector: `.grid > .relative.h-full.col-start-...`

                    const dayColumns = Array.from(gridContainer.children).filter(el =>
                        el.className.includes('col-start-') && el.className.includes('relative')
                    );

                    // Map colIndex (0-6) to the correct DOM element
                    // Note: Check existing DOM structure in dashboard.html lines 616+
                    // It has: "EXISTING TASKS" block.
                    // Column 1 is Mon (index 0).

                    const targetColumn = dayColumns[colIndex];

                    if (targetColumn) {
                        task.style.top = `${finalTop}px`;
                        targetColumn.appendChild(task);

                        // Recalculate Time for Display
                        const totalMinutes = (finalTop / PIXELS_PER_HOUR) * 60;
                        const hour = GRID_START_HOUR + Math.floor(totalMinutes / 60);
                        const minute = Math.floor(totalMinutes % 60);

                        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

                        // Update time label in UI
                        const timeBadge = task.querySelector('span.bg-white, span.bg-teal-100, span.bg-rose-100, span.bg-blue-100, span.bg-purple-100, span.bg-orange-100') || task.querySelector('span.text-xs.font-bold');
                        // The selector above is a bit guessy, let's look at HTML structure
                        // <span class="text-xs font-bold ...">08:00</span>
                        if (timeBadge) {
                            timeBadge.innerText = timeString;
                        }

                        showNotification(`Đã chuyển sang Thứ ${colIndex + 2}, lúc ${timeString}`, 'success');
                    } else {
                        // Revert if something wrong
                        task.style.position = 'absolute';
                        task.style.left = originalLeft;
                        task.style.top = originalTop;
                        showNotification('Không thể di chuyển đến vị trí này', 'info');
                    }
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        });
    };

    // Initialize
    initDragAndDrop();

    // Grid click to move (Optional: keep or remove? Removing as per plan to replace)

    // === Mood Trend Chart ===
    const moodCtx = document.getElementById('moodChart');
    if (moodCtx && typeof Chart !== 'undefined') {
        const moodChart = new Chart(moodCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [{
                    label: 'Mood',
                    data: [3, 2, 4, 3, 5, 4, 4], // 1: Angry, 2: Tired, 3: Normal, 4: Good, 5: Awesome
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: '#FFFFFF',
                    pointBorderColor: '#8B5CF6',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false } // Hide tooltips for cleaner look in sidebar
                },
                scales: {
                    y: {
                        display: false,
                        min: 1,
                        max: 5
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#9CA3AF', font: { size: 10 } }
                    }
                }
            }
        });
    }

    // === Mood Chat Enhancements ===
    const quickReplies = document.querySelectorAll('#quick-replies button');

    // Helper to get formatted time
    const getCurrentTime = () => {
        const now = new Date();
        return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    };

    if (quickReplies.length > 0) {
        quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.innerText.replace(/^[\W\s]+ /, ''); // Remove emoji prefix using standard non-word class
                const chatInput = document.querySelector('#mood input[type="text"]');
                const sendBtn = document.querySelector('#mood button .material-icons-round');

                if (chatInput) {
                    chatInput.value = text;
                    if (sendBtn) sendBtn.parentNode.click();
                }
            });
        });
    }

    // Smart Suggestions Click
    const suggestionCards = document.querySelectorAll('#mood .overflow-x-auto > div');
    suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('p').innerText;
            showNotification(`Đã mở: ${title}`, 'success');
        });
    });

    // === Deadline View Logic ===
    const deadlineListView = document.getElementById('deadline-list-view');
    const deadlineKanbanView = document.getElementById('deadline-kanban-view');
    const deadlineViewBtns = document.querySelectorAll('#deadline-view-toggle button');

    if (deadlineListView && deadlineKanbanView && deadlineViewBtns.length > 0) {
        deadlineViewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;

                // Update UI Buttons
                deadlineViewBtns.forEach(b => {
                    if (b.dataset.view === view) {
                        b.classList.remove('text-gray-500', 'hover:text-gray-900', 'dark:hover:text-white');
                        b.classList.add('bg-white', 'dark:bg-gray-600', 'text-primary', 'shadow-sm');
                    } else {
                        b.classList.add('text-gray-500', 'hover:text-gray-900', 'dark:hover:text-white');
                        b.classList.remove('bg-white', 'dark:bg-gray-600', 'text-primary', 'shadow-sm');
                    }
                });

                // Toggle Views
                if (view === 'list') {
                    deadlineListView.classList.remove('hidden');
                    deadlineListView.classList.add('flex');
                    deadlineKanbanView.classList.add('hidden');
                    deadlineKanbanView.classList.remove('flex');
                } else if (view === 'kanban') {
                    deadlineListView.classList.add('hidden');
                    deadlineListView.classList.remove('flex');
                    deadlineKanbanView.classList.remove('hidden');
                    deadlineKanbanView.classList.add('flex');
                }
            });
        });
    }

});
