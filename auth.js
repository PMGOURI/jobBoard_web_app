//  Handles user authentication

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const closeButtons = document.querySelectorAll('.close');
const authButtons = document.getElementById('authButtons');

// Show login modal
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
}

// Show register modal
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });
}

// Switch between modals
if (showRegister) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });
}

if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
}

// Close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// Register Form Submission
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const userType = document.getElementById('registerUserType').value;
        
        // Validate password match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Get existing users or initialize empty array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            alert('Email already registered!');
            return;
        }
        
        // Create new user object
        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // In a real app, password should be hashed
            userType,
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save back to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Create user-specific data containers
        if (userType === 'jobseeker') {
            const applications = JSON.parse(localStorage.getItem('applications')) || {};
            applications[newUser.id] = [];
            localStorage.setItem('applications', JSON.stringify(applications));
        } else if (userType === 'employer') {
            const employerJobs = JSON.parse(localStorage.getItem('employerJobs')) || {};
            employerJobs[newUser.id] = [];
            localStorage.setItem('employerJobs', JSON.stringify(employerJobs));
        }
        
        alert('Registration successful! Please log in.');
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
}

// Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const userType = document.getElementById('userType').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user with matching email and password
        const user = users.find(user => user.email === email && user.password === password && user.userType === userType);
        
        if (!user) {
            alert('Invalid credentials or user type!');
            return;
        }
        
        // Store logged in user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect based on user type
        switch (userType) {
            case 'jobseeker':
                window.location.href = 'pages/seeker-dashboard.html';
                break;
            case 'employer':
                window.location.href = 'pages/employer-dashboard.html';
                break;
            case 'admin':
                window.location.href = 'pages/admin.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    });
}

// Check if user is logged in
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        // Update auth buttons
        if (authButtons) {
            authButtons.innerHTML = `
                <span>Welcome, ${currentUser.name}</span>
                <button id="dashboardBtn" class="btn">Dashboard</button>
                <button id="logoutBtn" class="btn">Logout</button>
            `;
            
            // Dashboard button event
            document.getElementById('dashboardBtn').addEventListener('click', () => {
                switch (currentUser.userType) {
                    case 'jobseeker':
                        window.location.href = 'pages/seeker-dashboard.html';
                        break;
                    case 'employer':
                        window.location.href = 'pages/employer-dashboard.html';
                        break;
                    case 'admin':
                        window.location.href = 'pages/admin.html';
                        break;
                }
            });
            
            // Logout button event
            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        }
    }
}

// Initialize data for first-time users
function initializeData() {
    // Check if it's the first time loading the application
    if (!localStorage.getItem('initialized')) {
        // Create admin account
        const users = [];
        users.push({
            id: 1,
            name: 'Admin User',
            email: 'admin@jobconnect.com',
            password: 'admin123',
            userType: 'admin',
            createdAt: new Date().toISOString()
        });
        
        // Sample job data
        const jobs = [
            {
                id: 1,
                title: 'Front-End Developer',
                company: 'TechCorp',
                location: 'New York',
                type: 'full-time',
                category: 'technology',
                salary: '$80,000 - $100,000',
                description: 'We are looking for an experienced front-end developer to join our team.',
                requirements: 'HTML, CSS, JavaScript, React',
                employerId: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Marketing Manager',
                company: 'BrandBoost',
                location: 'London',
                type: 'full-time',
                category: 'marketing',
                salary: '$70,000 - $90,000',
                description: 'Lead our marketing team and develop effective strategies.',
                requirements: '5+ years of marketing experience, excellent communication skills',
                employerId: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Data Analyst',
                company: 'DataInsight',
                location: 'Remote',
                type: 'contract',
                category: 'technology',
                salary: '$50 - $70 per hour',
                description: 'Analyze data and create insightful reports for our clients.',
                requirements: 'SQL, Python, data visualization tools',
                employerId: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                title: 'Nurse Practitioner',
                company: 'HealthFirst',
                location: 'Berlin',
                type: 'part-time',
                category: 'healthcare',
                salary: '$40 - $50 per hour',
                description: 'Join our healthcare team providing quality care to patients.',
                requirements: 'Nursing degree, 2+ years of experience, certification',
                employerId: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                title: 'Elementary Teacher',
                company: 'Bright Future School',
                location: 'Tokyo',
                type: 'full-time',
                category: 'education',
                salary: '$45,000 - $55,000',
                description: 'Teach elementary students in a supportive environment.',
                requirements: 'Teaching degree, experience with children, patience',
                employerId: 1,
                createdAt: new Date().toISOString()
            }
        ];
        
        // Sample employers (for demo purposes)
        users.push({
            id: 2,
            name: 'Employer Account',
            email: 'employer@company.com',
            password: 'employer123',
            userType: 'employer',
            company: 'Demo Company',
            createdAt: new Date().toISOString()
        });
        
        // Sample job seeker
        users.push({
            id: 3,
            name: 'Job Seeker',
            email: 'seeker@example.com',
            password: 'seeker123',
            userType: 'jobseeker',
            createdAt: new Date().toISOString()
        });
        
        // Save data to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('jobs', JSON.stringify(jobs));
        localStorage.setItem('applications', JSON.stringify({}));
        localStorage.setItem('employerJobs', JSON.stringify({
            2: [6, 7] // Sample job IDs for the employer
        }));
        
        // Mark as initialized
        localStorage.setItem('initialized', 'true');
    }
}

// Run initialization and authentication check
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    checkAuth();
});