// Handles job listings and job-related functionality

// Load and display job listings on the main page
function loadJobListings() {
    const jobListingsContainer = document.getElementById('jobListings');
    if (!jobListingsContainer) return;
    
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    
    // Clear existing listings
    jobListingsContainer.innerHTML = '';
    
    if (jobs.length === 0) {
        jobListingsContainer.innerHTML = '<p class="no-jobs">No job listings found.</p>';
        return;
    }
    
    // Sort jobs by date (newest first)
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Render each job card
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <h3>${job.title}</h3>
            <p class="company">${job.company}</p>
            <div class="details">
                <span class="detail">${job.location}</span>
                <span class="detail">${job.type}</span>
                <span class="detail">${job.category}</span>
                <span class="detail">${job.salary}</span>
            </div>
            <p class="description">${truncateText(job.description, 100)}</p>
            <button class="btn btn-primary view-job" data-id="${job.id}">View Details</button>
        `;
        
        jobListingsContainer.appendChild(jobCard);
    });
    
    // Add event listeners to "View Details" buttons
    document.querySelectorAll('.view-job').forEach(button => {
        button.addEventListener('click', () => {
            const jobId = button.getAttribute('data-id');
            window.location.href = `pages/job-details.html?id=${jobId}`;
        });
    });
}

// Filter jobs based on user selections
function filterJobs() {
    const filterBtn = document.getElementById('filterBtn');
    if (!filterBtn) return;
    
    filterBtn.addEventListener('click', () => {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const locationFilter = document.getElementById('locationFilter').value.toLowerCase();
        
        const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
        const jobListingsContainer = document.getElementById('jobListings');
        
        // Clear existing listings
        jobListingsContainer.innerHTML = '';
        
        // Filter jobs
        const filteredJobs = jobs.filter(job => {
            const matchesCategory = categoryFilter === '' || job.category === categoryFilter;
            const matchesType = typeFilter === '' || job.type === typeFilter;
            const matchesSearch = searchInput === '' || 
                job.title.toLowerCase().includes(searchInput) || 
                job.company.toLowerCase().includes(searchInput) || 
                job.description.toLowerCase().includes(searchInput);
            const matchesLocation = locationFilter === '' || job.location.toLowerCase().includes(locationFilter);
            
            return matchesCategory && matchesType && matchesSearch && matchesLocation;
        });
        
        if (filteredJobs.length === 0) {
            jobListingsContainer.innerHTML = '<p class="no-jobs">No job listings match your filters.</p>';
            return;
        }
        
        // Sort filtered jobs by date (newest first)
        filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Render each filtered job card
        filteredJobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p class="company">${job.company}</p>
                <div class="details">
                    <span class="detail">${job.location}</span>
                    <span class="detail">${job.type}</span>
                    <span class="detail">${job.category}</span>
                    <span class="detail">${job.salary}</span>
                </div>
                <p class="description">${truncateText(job.description, 100)}</p>
                <button class="btn btn-primary view-job" data-id="${job.id}">View Details</button>
            `;
            
            jobListingsContainer.appendChild(jobCard);
        });
        
        // Add event listeners to "View Details" buttons
        document.querySelectorAll('.view-job').forEach(button => {
            button.addEventListener('click', () => {
                const jobId = button.getAttribute('data-id');
                window.location.href = `pages/job-details.html?id=${jobId}`;
            });
        });
    });
}

// Handle search functionality
function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    if (!searchBtn) return;
    
    searchBtn.addEventListener('click', () => {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const locationFilter = document.getElementById('locationFilter').value.toLowerCase();
        
        if (searchInput === '' && locationFilter === '') {
            alert('Please enter a search term or select a location');
            return;
        }
        
        // Reset other filters
        if (document.getElementById('categoryFilter')) {
            document.getElementById('categoryFilter').value = '';
        }
        
        if (document.getElementById('typeFilter')) {
            document.getElementById('typeFilter').value = '';
        }
        
        const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
        const jobListingsContainer = document.getElementById('jobListings');
        
        // Clear existing listings
        jobListingsContainer.innerHTML = '';
        
        // Filter jobs
        const filteredJobs = jobs.filter(job => {
            const matchesSearch = searchInput === '' || 
                job.title.toLowerCase().includes(searchInput) || 
                job.company.toLowerCase().includes(searchInput) || 
                job.description.toLowerCase().includes(searchInput);
            const matchesLocation = locationFilter === '' || job.location.toLowerCase().includes(locationFilter);
            
            return matchesSearch && matchesLocation;
        });
        
        if (filteredJobs.length === 0) {
            jobListingsContainer.innerHTML = '<p class="no-jobs">No job listings match your search.</p>';
            return;
        }
        
        // Sort filtered jobs by date (newest first)
        filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Render each filtered job card
        filteredJobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p class="company">${job.company}</p>
                <div class="details">
                    <span class="detail">${job.location}</span>
                    <span class="detail">${job.type}</span>
                    <span class="detail">${job.category}</span>
                    <span class="detail">${job.salary}</span>
                </div>
                <p class="description">${truncateText(job.description, 100)}</p>
                <button class="btn btn-primary view-job" data-id="${job.id}">View Details</button>
            `;
            
            jobListingsContainer.appendChild(jobCard);
        });
        
        // Add event listeners to "View Details" buttons
        document.querySelectorAll('.view-job').forEach(button => {
            button.addEventListener('click', () => {
                const jobId = button.getAttribute('data-id');
                window.location.href = `pages/job-details.html?id=${jobId}`;
            });
        });
    });
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Load job details on the job details page
function loadJobDetails() {
    const jobDetailsContainer = document.getElementById('jobDetails');
    if (!jobDetailsContainer) return;
    
    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get('id'));
    
    if (!jobId) {
        jobDetailsContainer.innerHTML = '<p>Job not found.</p>';
        return;
    }
    
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
        jobDetailsContainer.innerHTML = '<p>Job not found.</p>';
        return;
    }
    
    // Format date
    const jobDate = new Date(job.createdAt);
    const formattedDate = `${jobDate.getDate()}/${jobDate.getMonth() + 1}/${jobDate.getFullYear()}`;
    
    // Render job details
    jobDetailsContainer.innerHTML = `
        <div class="job-header">
            <h1>${job.title}</h1>
            <p class="company">${job.company}</p>
            <div class="details">
                <span class="detail"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                <span class="detail"><i class="fas fa-briefcase"></i> ${job.type}</span>
                <span class="detail"><i class="fas fa-folder"></i> ${job.category}</span>
                <span class="detail"><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
                <span class="detail"><i class="fas fa-calendar-alt"></i> Posted on ${formattedDate}</span>
            </div>
        </div>
        
        <div class="job-content">
            <div class="section">
                <h2>Job Description</h2>
                <p>${job.description}</p>
            </div>
            
            <div class="section">
                <h2>Requirements</h2>
                <p>${job.requirements}</p>
            </div>
        </div>
        
        <div class="job-actions">
            <button id="applyBtn" class="btn btn-primary">Apply Now</button>
            <button id="saveBtn" class="btn">Save Job</button>
            <button id="backBtn" class="btn">Back to Jobs</button>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('backBtn').addEventListener('click', () => {
        window.history.back();
    });
    
    document.getElementById('applyBtn').addEventListener('click', () => {
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            alert('Please log in as a job seeker to apply for this job.');
            return;
        }
        
        if (currentUser.userType !== 'jobseeker') {
            alert('Only job seekers can apply for jobs.');
            return;
        }
        
        // Check if already applied
        const applications = JSON.parse(localStorage.getItem('applications')) || {};
        const userApplications = applications[currentUser.id] || [];
        
        if (userApplications.some(app => app.jobId === jobId)) {
            alert('You have already applied for this job.');
            return;
        }
        
        // Add application
        const newApplication = {
            id: Date.now(),
            jobId: jobId,
            jobTitle: job.title,
            company: job.company,
            appliedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        userApplications.push(newApplication);
        applications[currentUser.id] = userApplications;
        localStorage.setItem('applications', JSON.stringify(applications));
        
        alert('Application submitted successfully!');
    });
    
    document.getElementById('saveBtn').addEventListener('click', () => {
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            alert('Please log in to save jobs.');
            return;
        }
        
        if (currentUser.userType !== 'jobseeker') {
            alert('Only job seekers can save jobs.');
            return;
        }
        
        // Get saved jobs
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || {};
        const userSavedJobs = savedJobs[currentUser.id] || [];
        
        // Check if already saved
        if (userSavedJobs.includes(jobId)) {
            alert('This job is already saved.');
            return;
        }
        
        // Save job
        userSavedJobs.push(jobId);
        savedJobs[currentUser.id] = userSavedJobs;
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        
        alert('Job saved successfully!');
    });
}

// Initialize job-related functionality
document.addEventListener('DOMContentLoaded', () => {
    loadJobListings();
    filterJobs();
    setupSearch();
    loadJobDetails();
})