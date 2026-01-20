/*
 * Admin Panel JavaScript
 * 
 * Handles admin authentication and project management.
 * For production, this should connect to a secure backend API.
 */

// Admin password - CHANGE THIS IN PRODUCTION!
// In production, this should be handled server-side with proper authentication
const ADMIN_PASSWORD = 'mjm747'; // Change this to your desired password

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
  loadProjects();
});

/**
 * Check if admin is already authenticated
 */
function checkAuth() {
  const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
  
  if (isAuthenticated) {
    showAdminPanel();
  } else {
    showLoginScreen();
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const addProjectForm = document.getElementById('addProjectForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  if (addProjectForm) {
    addProjectForm.addEventListener('submit', handleAddProject);
  }
}

/**
 * Handle login
 */
function handleLogin(e) {
  e.preventDefault();
  
  const password = document.getElementById('adminPassword').value;
  const errorDiv = document.getElementById('loginError');
  
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('admin_authenticated', 'true');
    showAdminPanel();
    errorDiv.style.display = 'none';
  } else {
    errorDiv.textContent = 'Incorrect password. Please try again.';
    errorDiv.style.display = 'block';
    document.getElementById('adminPassword').value = '';
  }
}

/**
 * Handle logout
 */
function handleLogout() {
  sessionStorage.removeItem('admin_authenticated');
  showLoginScreen();
  document.getElementById('adminPassword').value = '';
}

/**
 * Show login screen
 */
function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
}

/**
 * Show admin panel
 */
function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  loadProjects();
}

/**
 * Handle adding new project
 */
function handleAddProject(e) {
  e.preventDefault();
  
  const projectId = document.getElementById('newProjectId').value.trim().toUpperCase();
  const projectName = document.getElementById('newProjectName').value.trim();
  const projectType = document.getElementById('newProjectType').value;
  
  if (!projectId || !projectName) {
    alert('Please fill in all fields');
    return;
  }
  
  // Get existing projects
  const projects = getProjects();
  
  // Check if project ID already exists
  if (projects[projectId]) {
    alert('Project ID already exists. Please use a different ID.');
    return;
  }
  
  // Add new project
  projects[projectId] = {
    id: projectId,
    name: projectName,
    type: projectType,
    progress: 0,
    statusMessage: 'Project has been initiated. We\'re getting started!',
    lastUpdated: new Date().toISOString()
  };
  
  // Save projects
  saveProjects(projects);
  
  // Reset form
  document.getElementById('addProjectForm').reset();
  
  // Reload projects list
  loadProjects();
  
  alert('Project added successfully!');
}

/**
 * Load and display projects
 */
function loadProjects() {
  const projects = getProjects();
  const projectsList = document.getElementById('projectsList');
  
  if (!projectsList) return;
  
  const projectIds = Object.keys(projects);
  
  if (projectIds.length === 0) {
    projectsList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No projects yet. Add your first project above.</p>';
    return;
  }
  
  projectsList.innerHTML = projectIds.map(projectId => {
    const project = projects[projectId];
    return `
      <div class="card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
          <div>
            <h3 style="color: var(--primary); margin-bottom: 0.5rem;">${project.name}</h3>
            <p style="color: var(--text-muted); margin: 0;">
              <strong>ID:</strong> ${project.id} | 
              <strong>Type:</strong> ${project.type === 'app' ? 'Mobile App' : 'Website'}
            </p>
          </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; color: var(--text-light);">
            Progress: <span id="progress-${projectId}">${project.progress}%</span>
          </label>
          <input 
            type="range" 
            id="slider-${projectId}" 
            min="0" 
            max="100" 
            value="${project.progress}" 
            style="width: 100%; margin-bottom: 0.5rem;"
            oninput="updateProgress('${projectId}', this.value)"
          >
        </div>
        
        <div class="form-group" style="margin-bottom: 1.5rem;">
          <label for="status-${projectId}">Status Message</label>
          <textarea 
            id="status-${projectId}" 
            rows="3" 
            placeholder="Update status message..."
            style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--border-radius); border: none; background-color: var(--card-bg); color: var(--text-light); font-size: 1rem; outline: none; resize: vertical;"
          >${project.statusMessage || ''}</textarea>
        </div>
        
        <div style="display: flex; gap: 1rem;">
          <button 
            onclick="saveProject('${projectId}')" 
            class="btn btn-primary"
          >
            Save Changes
          </button>
          <button 
            onclick="deleteProject('${projectId}')" 
            class="btn btn-secondary"
            style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border-color: rgba(239, 68, 68, 0.3);"
          >
            Delete Project
          </button>
          <a 
            href="track.html?id=${projectId}" 
            target="_blank" 
            class="btn btn-secondary"
            style="text-decoration: none;"
          >
            View as Client
          </a>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Update progress slider value display
 */
window.updateProgress = function(projectId, value) {
  document.getElementById(`progress-${projectId}`).textContent = `${value}%`;
};

/**
 * Save project changes
 */
window.saveProject = function(projectId) {
  const projects = getProjects();
  const project = projects[projectId];
  
  if (!project) return;
  
  const progress = parseInt(document.getElementById(`slider-${projectId}`).value);
  const statusMessage = document.getElementById(`status-${projectId}`).value.trim();
  
  project.progress = progress;
  project.statusMessage = statusMessage || getDefaultStatusMessage(progress);
  project.lastUpdated = new Date().toISOString();
  
  saveProjects(projects);
  
  // Show success message
  const card = document.getElementById(`slider-${projectId}`).closest('.card');
  const originalHTML = card.innerHTML;
  card.innerHTML = '<p style="color: #10b981; text-align: center; padding: 1rem;">✓ Changes saved successfully!</p>';
  
  setTimeout(() => {
    loadProjects();
  }, 1000);
};

/**
 * Delete project
 */
window.deleteProject = function(projectId) {
  if (!confirm(`Are you sure you want to delete project "${projectId}"? This action cannot be undone.`)) {
    return;
  }
  
  const projects = getProjects();
  delete projects[projectId];
  saveProjects(projects);
  loadProjects();
};

/**
 * Get projects from storage
 */
function getProjects() {
  const stored = localStorage.getItem('morobo_projects');
  return stored ? JSON.parse(stored) : {};
}

/**
 * Save projects to storage
 */
function saveProjects(projects) {
  localStorage.setItem('morobo_projects', JSON.stringify(projects));
  
  // In production, this should also sync to a backend API
  // Example:
  // await fetch('/api/projects', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(projects)
  // });
}

/**
 * Get default status message based on progress
 */
function getDefaultStatusMessage(progress) {
  if (progress === 0) {
    return 'Project has been initiated. We\'re getting started!';
  } else if (progress < 25) {
    return 'Project is in the early stages. We\'re setting up the foundation.';
  } else if (progress < 50) {
    return 'Project is progressing well. Core features are being developed.';
  } else if (progress < 75) {
    return 'Project is more than halfway complete. Finalizing key features.';
  } else if (progress < 100) {
    return 'Project is nearly complete. We\'re polishing the final details.';
  } else {
    return 'Project is complete! We\'ll be in touch soon for delivery.';
  }
}
