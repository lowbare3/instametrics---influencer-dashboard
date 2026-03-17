// ===== DEMO DATA =====
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const engagementData = {
    rate: [3.2, 3.5, 3.8, 4.1, 3.9, 4.3, 4.0, 4.5, 4.2, 4.6, 4.4, 4.8],
    interactions: [12400, 14200, 16800, 19500, 17200, 21300, 18900, 23400, 20100, 25600, 22800, 27200]
};

const followerData = {
    cumulative: [180000, 192000, 201000, 215000, 224000, 238000, 245000, 253000, 261000, 270000, 278000, 284500],
    monthly: [8000, 12000, 9000, 14000, 9000, 14000, 7000, 8000, 8000, 9000, 8000, 6500]
};

const cpvCampaigns = {
    labels: ['Nike Collab', 'Skincare Pro', 'Travel Diaries', 'Tech Unbox', 'Fitness 360', 'Food Fest'],
    values: [0.045, 0.032, 0.028, 0.038, 0.025, 0.035],
    colors: ['#a855f7', '#ec4899', '#22c55e', '#3b82f6', '#f97316', '#ef4444']
};

const contentMixData = {
    labels: ['Reels', 'Posts', 'Stories', 'Carousels'],
    values: [42, 25, 20, 13],
    colors: ['#a855f7', '#3b82f6', '#ec4899', '#f97316']
};

const recentPosts = [
    { caption: 'Morning routine that changed my life ✨', type: 'reel', date: 'Mar 12, 2026', views: 245000, likes: 18400, comments: 892, shares: 3200, engRate: 9.2, cpv: 0.028 },
    { caption: 'Honest review: New skincare line 🧴', type: 'carousel', date: 'Mar 10, 2026', views: 189000, likes: 14200, comments: 1240, shares: 2100, engRate: 9.3, cpv: 0.031 },
    { caption: 'Travel vlog: Hidden gems in Bali 🌴', type: 'reel', date: 'Mar 8, 2026', views: 312000, likes: 24500, comments: 1890, shares: 5400, engRate: 10.2, cpv: 0.022 },
    { caption: 'Outfit inspiration for spring 🌸', type: 'post', date: 'Mar 6, 2026', views: 95000, likes: 8900, comments: 420, shares: 980, engRate: 10.8, cpv: 0.042 },
    { caption: 'Behind the scenes of yesterday\'s shoot 📸', type: 'story', date: 'Mar 5, 2026', views: 78000, likes: 6200, comments: 310, shares: 450, engRate: 8.9, cpv: 0.038 },
    { caption: 'My top 5 productivity apps 📱', type: 'carousel', date: 'Mar 3, 2026', views: 167000, likes: 12800, comments: 980, shares: 2800, engRate: 9.9, cpv: 0.029 },
    { caption: 'Workout routine: Full body in 20 min 💪', type: 'reel', date: 'Mar 1, 2026', views: 278000, likes: 21200, comments: 1560, shares: 4100, engRate: 9.7, cpv: 0.025 },
    { caption: 'Q&A: Your questions answered!', type: 'story', date: 'Feb 28, 2026', views: 64000, likes: 5100, comments: 890, shares: 320, engRate: 9.9, cpv: 0.044 },
];

// Sparkline data for each metric card
const sparklines = {
    followers: [180, 192, 201, 215, 224, 238, 245, 253, 261, 270, 278, 284],
    engagement: [3.2, 3.5, 3.8, 4.1, 3.9, 4.3, 4.0, 4.5, 4.2, 4.6, 4.4, 4.8],
    cpv: [0.051, 0.048, 0.044, 0.042, 0.039, 0.038, 0.036, 0.035, 0.034, 0.033, 0.032, 0.032],
    reach: [650, 720, 780, 830, 900, 950, 1020, 1080, 1100, 1150, 1200, 1250],
    revenue: [4200, 5100, 5800, 6500, 7200, 8100, 8900, 9600, 10200, 11100, 12000, 12840],
    likes: [5200, 5800, 6100, 6500, 6900, 7200, 7500, 7800, 7900, 8100, 8300, 8420],
};

// ===== UTILITY FUNCTIONS =====
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals) || 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // ease out quart

        const current = target * eased;

        if (target >= 1000 && decimals === 0) {
            el.textContent = prefix + formatNumber(Math.round(current)) + suffix;
        } else {
            el.textContent = prefix + current.toFixed(decimals) + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (target >= 1000 && decimals === 0) {
                el.textContent = prefix + formatNumber(target) + suffix;
            } else {
                el.textContent = prefix + target.toFixed(decimals) + suffix;
            }
        }
    }
    requestAnimationFrame(update);
}

// ===== SPARKLINES (tiny SVG line charts) =====
function createSparkline(containerId, data, color) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.offsetWidth || 200;
    const height = 32;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');

    const svg = `
        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
            <defs>
                <linearGradient id="grad-${containerId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:${color};stop-opacity:0"/>
                </linearGradient>
            </defs>
            <polygon points="${points} ${width},${height} 0,${height}" fill="url(#grad-${containerId})" />
            <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    container.innerHTML = svg;
}

// ===== CHART.JS CONFIGURATION =====
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(18, 18, 26, 0.95)',
            titleColor: '#f0f0f5',
            bodyColor: '#8b8ba3',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'Inter' },
            displayColors: true,
            boxPadding: 4,
        }
    },
    scales: {
        x: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#5a5a72', font: { family: 'Inter', size: 11 } },
            border: { display: false }
        },
        y: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#5a5a72', font: { family: 'Inter', size: 11 } },
            border: { display: false }
        }
    }
};

// ===== ENGAGEMENT CHART =====
let engagementChart;
function createEngagementChart(type = 'rate') {
    const ctx = document.getElementById('engagementChart').getContext('2d');
    const data = type === 'rate' ? engagementData.rate : engagementData.interactions;
    const label = type === 'rate' ? 'Engagement Rate (%)' : 'Total Interactions';

    if (engagementChart) engagementChart.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

    engagementChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: MONTHS,
            datasets: [{
                label: label,
                data: data,
                borderColor: '#a855f7',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                borderWidth: 2.5,
                pointBackgroundColor: '#a855f7',
                pointBorderColor: '#12121a',
                pointBorderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBorderWidth: 3,
            }]
        },
        options: {
            ...chartDefaults,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                ...chartDefaults.scales,
                y: {
                    ...chartDefaults.scales.y,
                    ticks: {
                        ...chartDefaults.scales.y.ticks,
                        callback: function(value) {
                            return type === 'rate' ? value + '%' : formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// ===== GROWTH CHART =====
let growthChart;
function createGrowthChart(type = 'cumulative') {
    const ctx = document.getElementById('growthChart').getContext('2d');
    const data = type === 'cumulative' ? followerData.cumulative : followerData.monthly;
    const label = type === 'cumulative' ? 'Total Followers' : 'New Followers';

    if (growthChart) growthChart.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    growthChart = new Chart(ctx, {
        type: type === 'cumulative' ? 'line' : 'bar',
        data: {
            labels: MONTHS,
            datasets: [{
                label: label,
                data: data,
                borderColor: '#3b82f6',
                backgroundColor: type === 'cumulative' ? gradient : 'rgba(59, 130, 246, 0.6)',
                fill: type === 'cumulative',
                tension: 0.4,
                borderWidth: type === 'cumulative' ? 2.5 : 0,
                borderRadius: type === 'cumulative' ? 0 : 6,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#12121a',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3,
            }]
        },
        options: {
            ...chartDefaults,
            interaction: { intersect: false, mode: 'index' },
            scales: {
                ...chartDefaults.scales,
                y: {
                    ...chartDefaults.scales.y,
                    ticks: {
                        ...chartDefaults.scales.y.ticks,
                        callback: function(value) { return formatNumber(value); }
                    }
                }
            }
        }
    });
}

// ===== CPV CHART =====
function createCPVChart() {
    const ctx = document.getElementById('cpvChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cpvCampaigns.labels,
            datasets: [{
                label: 'Cost Per View ($)',
                data: cpvCampaigns.values,
                backgroundColor: cpvCampaigns.colors.map(c => c + '99'),
                borderColor: cpvCampaigns.colors,
                borderWidth: 1.5,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            ...chartDefaults,
            indexAxis: 'y',
            scales: {
                x: {
                    ...chartDefaults.scales.x,
                    ticks: {
                        ...chartDefaults.scales.x.ticks,
                        callback: function(value) { return '$' + value.toFixed(3); }
                    }
                },
                y: {
                    ...chartDefaults.scales.y,
                    ticks: {
                        ...chartDefaults.scales.y.ticks,
                        font: { family: 'Inter', size: 11, weight: '500' }
                    }
                }
            },
            plugins: {
                ...chartDefaults.plugins,
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: function(context) { return ' $' + context.raw.toFixed(4); }
                    }
                }
            }
        }
    });
}

// ===== CONTENT MIX CHART =====
function createContentMixChart() {
    const ctx = document.getElementById('contentMixChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: contentMixData.labels,
            datasets: [{
                data: contentMixData.values,
                backgroundColor: contentMixData.colors.map(c => c + 'cc'),
                borderColor: 'rgba(18, 18, 26, 0.8)',
                borderWidth: 3,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: function(context) { return ' ' + context.label + ': ' + context.raw + '%'; }
                    }
                }
            }
        }
    });

    // Custom legend
    const legendContainer = document.getElementById('doughnutLegend');
    legendContainer.innerHTML = contentMixData.labels.map((label, i) => `
        <div class="legend-item">
            <span class="legend-dot" style="background:${contentMixData.colors[i]}"></span>
            <span>${label} (${contentMixData.values[i]}%)</span>
        </div>
    `).join('');
}

// ===== POSTS TABLE =====
function populatePostsTable() {
    const tbody = document.getElementById('postsTableBody');

    tbody.innerHTML = recentPosts.map(post => `
        <tr>
            <td>
                <div class="post-cell">
                    <div class="post-thumb" style="background: linear-gradient(135deg, ${getTypeColor(post.type)}33, ${getTypeColor(post.type)}11)"></div>
                    <span class="post-caption">${post.caption}</span>
                </div>
            </td>
            <td><span class="type-badge type-${post.type}">${post.type}</span></td>
            <td>${post.date}</td>
            <td>${formatNumber(post.views)}</td>
            <td>${formatNumber(post.likes)}</td>
            <td>${formatNumber(post.comments)}</td>
            <td>${formatNumber(post.shares)}</td>
            <td><span class="eng-value">${post.engRate}%</span></td>
            <td><span class="cpv-value">$${post.cpv.toFixed(3)}</span></td>
        </tr>
    `).join('');
}

function getTypeColor(type) {
    const colors = { reel: '#a855f7', post: '#3b82f6', story: '#ec4899', carousel: '#f97316' };
    return colors[type] || '#8b8ba3';
}

// ===== SIDEBAR TOGGLE =====
function initSidebar() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Nav item clicks
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });
}

// ===== CHART TAB SWITCHING =====
function initChartTabs() {
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const chart = tab.dataset.chart;
            const type = tab.dataset.type;

            // Toggle active state
            tab.parentElement.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (chart === 'engagement') {
                createEngagementChart(type);
            } else if (chart === 'growth') {
                createGrowthChart(type);
            }
        });
    });
}

// ===== INITIALIZATION =====
function init() {
    // Animate metric counters
    document.querySelectorAll('.metric-value').forEach(el => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => animateCounter(el), 300);
                    observer.unobserve(el);
                }
            });
        });
        observer.observe(el);
    });

    // Create sparklines
    createSparkline('spark-followers', sparklines.followers, '#a855f7');
    createSparkline('spark-engagement', sparklines.engagement, '#ec4899');
    createSparkline('spark-cpv', sparklines.cpv, '#22c55e');
    createSparkline('spark-reach', sparklines.reach, '#3b82f6');
    createSparkline('spark-revenue', sparklines.revenue, '#f97316');
    createSparkline('spark-likes', sparklines.likes, '#ef4444');

    // Create charts
    createEngagementChart('rate');
    createGrowthChart('cumulative');
    createCPVChart();
    createContentMixChart();

    // Populate table
    populatePostsTable();

    // Init interactions
    initSidebar();
    initChartTabs();
}

// Wait for Chart.js to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
