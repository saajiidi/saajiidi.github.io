/**
 * GITHUB-STYLE LIVE FEED
 * Enhanced activity feed with GitHub-style timeline
 */

class GitHubStyleFeed {
    constructor(container) {
        this.container = container;
        this.activities = [];
        this.maxActivities = 20;
        this.init();
    }
    
    init() {
        this.setupFeedStructure();
        this.loadInitialActivities();
        this.startRealTimeUpdates();
    }
    
    setupFeedStructure() {
        const feedContent = this.container.querySelector('.bridge-content');
        if (!feedContent) return;
        
        feedContent.innerHTML = `
            <div class="github-feed">
                <div class="feed-header">
                    <div class="feed-title">
                        <i class="fab fa-github"></i>
                        Activity Feed
                    </div>
                    <div class="feed-filters">
                        <button class="feed-filter active" data-filter="all">All</button>
                        <button class="feed-filter" data-filter="commits">Commits</button>
                        <button class="feed-filter" data-filter="projects">Projects</button>
                        <button class="feed-filter" data-filter="system">System</button>
                    </div>
                </div>
                <div class="feed-timeline" id="feedTimeline">
                    <!-- Activities will be inserted here -->
                </div>
                <div class="feed-footer">
                    <button class="load-more-btn" id="loadMoreBtn">Load More</button>
                </div>
            </div>
        `;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const filters = this.container.querySelectorAll('.feed-filter');
        filters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                filters.forEach(f => f.classList.remove('active'));
                e.target.classList.add('active');
                this.filterActivities(e.target.dataset.filter);
            });
        });
        
        const loadMoreBtn = this.container.querySelector('#loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreActivities());
        }
    }
    
    loadInitialActivities() {
        const initialActivities = [
            {
                type: 'commit',
                title: 'Updated portfolio with new AI features',
                description: 'Added Agentic AI capabilities and enhanced UI',
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
                repo: 'saajiidi.github.io',
                branch: 'main',
                hash: this.generateCommitHash()
            },
            {
                type: 'project',
                title: 'Deployed ML Pipeline Dashboard',
                description: 'Real-time analytics for data processing workflows',
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                repo: 'ml-pipelines',
                action: 'deployed'
            },
            {
                type: 'system',
                title: 'Service Worker Updated',
                description: 'Cache strategy optimized for better performance',
                timestamp: new Date(Date.now() - 1000 * 60 * 60),
                action: 'system_update'
            },
            {
                type: 'commit',
                title: 'Fixed responsive design issues',
                description: 'Mobile viewport improvements and touch interactions',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                repo: 'saajiidi.github.io',
                branch: 'develop',
                hash: this.generateCommitHash()
            },
            {
                type: 'project',
                title: 'RAG System Implementation',
                description: 'Retrieval-Augmented Generation for knowledge base',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
                repo: 'ai-research',
                action: 'feature'
            }
        ];
        
        this.activities = initialActivities;
        this.renderActivities();
    }
    
    generateCommitHash() {
        return Math.random().toString(36).substring(2, 10);
    }
    
    renderActivities(filter = 'all') {
        const timeline = this.container.querySelector('#feedTimeline');
        if (!timeline) return;
        
        const filteredActivities = filter === 'all' 
            ? this.activities 
            : this.activities.filter(activity => activity.type === filter);
        
        timeline.innerHTML = filteredActivities.map(activity => this.createActivityHTML(activity)).join('');
        
        // Add animations
        const items = timeline.querySelectorAll('.feed-item');
        items.forEach((item, index) => {
            item.style.animation = `slideIn 0.3s ease-out ${index * 0.05}s both`;
        });
    }
    
    createActivityHTML(activity) {
        const timeAgo = this.getTimeAgo(activity.timestamp);
        const icon = this.getActivityIcon(activity.type);
        const color = this.getActivityColor(activity.type);
        
        return `
            <div class="feed-item" data-type="${activity.type}">
                <div class="feed-item-icon" style="background-color: ${color}">
                    <i class="${icon}"></i>
                </div>
                <div class="feed-item-content">
                    <div class="feed-item-header">
                        <div class="feed-item-title">${activity.title}</div>
                        <div class="feed-item-time">${timeAgo}</div>
                    </div>
                    <div class="feed-item-description">${activity.description}</div>
                    ${activity.repo ? `
                        <div class="feed-item-meta">
                            <span class="repo-name">
                                <i class="fas fa-code-branch"></i>
                                ${activity.repo}
                            </span>
                            ${activity.branch ? `
                                <span class="branch-name">
                                    <i class="fas fa-code-branch"></i>
                                    ${activity.branch}
                                </span>
                            ` : ''}
                            ${activity.hash ? `
                                <span class="commit-hash">
                                    <i class="fas fa-hashtag"></i>
                                    ${activity.hash}
                                </span>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    getActivityIcon(type) {
        const icons = {
            commit: 'fas fa-code-commit',
            project: 'fas fa-rocket',
            system: 'fas fa-cog',
            merge: 'fas fa-code-branch',
            release: 'fas fa-tag',
            issue: 'fas fa-exclamation-circle'
        };
        return icons[type] || 'fas fa-circle';
    }
    
    getActivityColor(type) {
        const colors = {
            commit: '#22c55e',
            project: '#3b82f6',
            system: '#f59e0b',
            merge: '#8b5cf6',
            release: '#ef4444',
            issue: '#06b6d4'
        };
        return colors[type] || '#6b7280';
    }
    
    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        
        return timestamp.toLocaleDateString();
    }
    
    addActivity(activity) {
        this.activities.unshift(activity);
        if (this.activities.length > this.maxActivities) {
            this.activities = this.activities.slice(0, this.maxActivities);
        }
        this.renderActivities();
    }
    
    filterActivities(filter) {
        this.renderActivities(filter);
    }
    
    loadMoreActivities() {
        // Simulate loading more activities
        const moreActivities = [
            {
                type: 'commit',
                title: 'Added error handling for API calls',
                description: 'Improved robustness of data fetching operations',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
                repo: 'saajiidi.github.io',
                branch: 'main',
                hash: this.generateCommitHash()
            },
            {
                type: 'system',
                title: 'Database schema updated',
                description: 'Optimized queries for better performance',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
                action: 'database_update'
            }
        ];
        
        this.activities.push(...moreActivities);
        this.renderActivities();
    }
    
    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            if (Math.random() > 0.7) {
                const randomActivities = [
                    {
                        type: 'commit',
                        title: 'Fixed minor bug in navigation',
                        description: 'Resolved scroll behavior issue',
                        timestamp: new Date(),
                        repo: 'saajiidi.github.io',
                        branch: 'main',
                        hash: this.generateCommitHash()
                    },
                    {
                        type: 'system',
                        title: 'Cache refreshed',
                        description: 'Static assets updated successfully',
                        timestamp: new Date(),
                        action: 'cache_update'
                    },
                    {
                        type: 'project',
                        title: 'New feature deployed',
                        description: 'Enhanced user dashboard with real-time metrics',
                        timestamp: new Date(),
                        repo: 'feature-branch',
                        action: 'deploy'
                    }
                ];
                
                const randomActivity = randomActivities[Math.floor(Math.random() * randomActivities.length)];
                this.addActivity(randomActivity);
            }
        }, 15000); // Every 15 seconds
    }
}

// Initialize GitHub-style feed
document.addEventListener('DOMContentLoaded', () => {
    const portfolioBridge = document.getElementById('portfolioBridge');
    if (portfolioBridge) {
        window.githubFeed = new GitHubStyleFeed(portfolioBridge);
    }
});
