// Global state management
const appState = {
    currentUser: null,
    notifications: [],
    clients: [
        {
            id: 1,
            name: "TechCorp Solutions",
            project: "Website Redesign & SEO",
            status: "Active",
            progress: 75,
            startDate: "2024-01-15",
            phases: [
                {
                    id: 1,
                    name: "Discovery & Planning",
                    status: "Completed",
                    progress: 100,
                    completedDate: "2024-01-30",
                    objectives: [
                        "Initial client meeting and requirements gathering",
                        "Website audit and competitive analysis",
                        "Project scope and timeline definition"
                    ]
                },
                {
                    id: 2,
                    name: "Design & Development",
                    status: "In Progress",
                    progress: 60,
                    objectives: [
                        "Website wireframes and mockups",
                        "Frontend development",
                        "Content migration and optimization"
                    ]
                },
                {
                    id: 3,
                    name: "Launch & Optimization",
                    status: "Upcoming",
                    progress: 0,
                    startDate: "2024-03-01",
                    objectives: [
                        "Quality assurance and testing",
                        "Website launch",
                        "SEO implementation and monitoring"
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "InnovateCo",
            project: "Social Media Campaign",
            status: "In Progress",
            progress: 45,
            startDate: "2024-02-01"
        },
        {
            id: 3,
            name: "GlobalTech Inc",
            project: "Content Strategy",
            status: "Planning",
            progress: 15,
            startDate: "2024-02-10"
        }
    ]
};

// Authentication functions
const auth = {
    login: async (email, password) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demo purposes, accept any valid email format
            if (email && password.length >= 6) {
                const user = {
                    email,
                    name: "Demo User",
                    role: "Project Manager"
                };
                appState.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },

    logout: () => {
        appState.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },

    checkAuth: () => {
        // Try to get user from localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            appState.currentUser = JSON.parse(storedUser);
        }
        
        // If no user is found and we're not on the login page, redirect to login
        if (!appState.currentUser && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
        
        // If we have a user and we're on the login page, redirect to dashboard
        if (appState.currentUser && window.location.pathname.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }
    }
};

// Client management functions
const clientManager = {
    getClients: () => {
        return appState.clients;
    },

    getClientById: (id) => {
        return appState.clients.find(client => client.id === id);
    },

    filterClients: (status) => {
        if (!status || status === 'All') {
            return appState.clients;
        }
        return appState.clients.filter(client => client.status === status);
    },

    searchClients: (query) => {
        const searchTerm = query.toLowerCase();
        return appState.clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
            client.project.toLowerCase().includes(searchTerm)
        );
    }
};

// UI utility functions
const ui = {
    showNotification: (message, type = 'info') => {
        const notification = {
            id: Date.now(),
            message,
            type
        };
        appState.notifications.push(notification);
        
        // Create notification element
        const notificationElement = document.createElement('div');
        notificationElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`;
        notificationElement.textContent = message;
        
        document.body.appendChild(notificationElement);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notificationElement.remove();
            appState.notifications = appState.notifications.filter(n => n.id !== notification.id);
        }, 3000);
    },

    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    updateProgressBar: (elementId, progress) => {
        const progressBar = document.getElementById(elementId);
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
};

// Mobile menu functionality
const initMobileMenu = () => {
    const menuButton = document.querySelector('button[type="button"]');
    const sidebar = document.querySelector('.md\\:flex-shrink-0');
    
    if (menuButton && sidebar) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }
};

// Initialize page-specific functionality
const initPage = () => {
    // Check authentication
    auth.checkAuth();

    // Initialize mobile menu
    initMobileMenu();

    // Page-specific initializations
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('dashboard.html')) {
        // Dashboard specific initialization
        console.log('Dashboard initialized');
    } else if (currentPage.includes('clients.html')) {
        // Clients page specific initialization
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const results = clientManager.searchClients(e.target.value);
                // Update UI with search results
                console.log('Search results:', results);
            });
        }
    } else if (currentPage.includes('client-details.html')) {
        // Client details page specific initialization
        console.log('Client details initialized');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

// Export functions for use in other scripts
window.app = {
    auth,
    clientManager,
    ui
};
