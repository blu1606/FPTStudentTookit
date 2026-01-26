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
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.dashboard-section');
    const pageTitle = document.getElementById('page-title');

    function setActiveSection(sectionId) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('fade-in');
        });

        // Show target section
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('fade-in');
        }

        // Update Nav State
        navLinks.forEach(link => {
            if (link.dataset.target === sectionId) {
                link.classList.add('bg-primary/10', 'text-primary');
                link.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');

                // Update Page Title
                const icon = link.querySelector('.material-icons-round').innerText;
                const text = link.querySelector('span:last-child').innerText;
                if (pageTitle) pageTitle.innerHTML = `<span class="material-icons-round mr-2 text-primary">${icon}</span>${text}`;

            } else {
                link.classList.remove('bg-primary/10', 'text-primary');
                link.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;
            setActiveSection(targetId);
        });
    });

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

    // === Drag & Drop Simulation (Visual Only) ===
    const draggableTasks = document.querySelectorAll('#planner-week-view .absolute');
    let selectedTask = null;

    draggableTasks.forEach(task => {
        if (task.style.pointerEvents === 'none' || task.classList.contains('pointer-events-none')) return; // Skip logic elements

        task.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent grid click

            if (selectedTask === task) {
                // Deselect
                task.classList.remove('ring-2', 'ring-primary', 'scale-105', 'z-50');
                task.classList.add('z-10');
                selectedTask = null;
                showNotification('Đã hủy chọn task', 'info');
            } else {
                // Deselect others
                if (selectedTask) {
                    selectedTask.classList.remove('ring-2', 'ring-primary', 'scale-105', 'z-50');
                    selectedTask.classList.add('z-10');
                }

                // Select
                selectedTask = task;
                task.classList.add('ring-2', 'ring-primary', 'scale-105', 'z-50');
                task.classList.remove('z-10');
                showNotification('Click vào khung giờ mới để di chuyển', 'success');
            }
        });
    });

    // Grid click to move
    const plannerGrid = document.querySelector('#planner-week-view .grid');
    if (plannerGrid) {
        plannerGrid.addEventListener('click', (e) => {
            if (selectedTask) {
                // Provide visual feedback only for MVP
                const rect = plannerGrid.getBoundingClientRect();
                // Simple calculation for demo purposes (would need complex math for exact grid snapping)
                showNotification('Đã di chuyển task đến vị trí mới (Demo)', 'success');

                // Deselect
                selectedTask.classList.remove('ring-2', 'ring-primary', 'scale-105', 'z-50');
                selectedTask.classList.add('z-10');
                selectedTask = null;
            }
        });
    }

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
                const text = btn.innerText.replace(/^[^\w\sà-ỹÀ-Y]+ /, ''); // Remove emoji prefix
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

});
