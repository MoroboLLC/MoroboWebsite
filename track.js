/*
 * Project Tracking JavaScript
 * 
 * Handles client-side project tracking functionality.
 * For production, this should connect to a backend API.
 */

document.addEventListener('DOMContentLoaded', () => {
  const trackForm = document.getElementById('trackForm');
  const projectStatus = document.getElementById('projectStatus');
  const errorMessage = document.getElementById('errorMessage');

  if (trackForm) {
    trackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const projectId = document.getElementById('projectId').value.trim().toUpperCase();
      
      if (!projectId) {
        return;
      }

      // Hide previous results
      projectStatus.style.display = 'none';
      errorMessage.style.display = 'none';

      // Fetch project data
      const project = await fetchProject(projectId);

      if (project) {
        displayProject(project);
      } else {
        errorMessage.style.display = 'block';
      }
    });
  }

  // Check if project ID is in URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectIdFromUrl = urlParams.get('id');
  if (projectIdFromUrl) {
    document.getElementById('projectId').value = projectIdFromUrl;
    trackForm.dispatchEvent(new Event('submit'));
  }
});

/**
 * Fetch project data
 * Currently uses localStorage for demo purposes.
 * In production, this should fetch from a backend API.
 */
async function fetchProject(projectId) {
  // For demo: Check localStorage
  // In production: Fetch from backend API
  const storedProjects = localStorage.getItem('morobo_projects');
  
  if (storedProjects) {
    const projects = JSON.parse(storedProjects);
    return projects[projectId] || null;
  }
  
  // If no localStorage, try fetching from a JSON file or API
  // This is a placeholder for backend integration
  try {
    // Example: Fetch from a JSON file hosted on the site
    // const response = await fetch(`projects/${projectId}.json`);
    // if (response.ok) {
    //   return await response.json();
    // }
  } catch (error) {
    console.error('Error fetching project:', error);
  }
  
  return null;
}

/**
 * Display project information
 */
function displayProject(project) {
  const projectName = document.getElementById('projectName');
  const projectType = document.getElementById('projectType');
  const progressPercent = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  const statusText = document.getElementById('statusText');
  const lastUpdated = document.getElementById('lastUpdated');

  projectName.textContent = project.name || 'Project';
  projectType.textContent = project.type === 'app' ? 'Mobile Application' : 'Website';
  
  const progress = project.progress || 0;
  progressPercent.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;
  
  statusText.textContent = project.statusMessage || getDefaultStatusMessage(progress);
  
  if (project.lastUpdated) {
    const date = new Date(project.lastUpdated);
    lastUpdated.textContent = `Last updated: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  } else {
    lastUpdated.textContent = '';
  }

  projectStatus.style.display = 'block';
  projectStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
