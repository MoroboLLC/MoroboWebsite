// Dashboard functionality
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  await checkDashboardAuth();
  
  // Load user data
  loadUserData();
  
  // Load dashboard data
  loadDashboardData();
  
  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
});

// Check if user is authenticated for dashboard
async function checkDashboardAuth() {
  const user = localStorage.getItem('morobo_user');
  
  if (!user) {
    window.location.href = 'auth.html';
    return;
  }
  
  // If Supabase is configured, verify session
  if (typeof supabase !== 'undefined') {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        localStorage.removeItem('morobo_user');
        window.location.href = 'auth.html';
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  }
}

// Load user data
function loadUserData() {
  const user = localStorage.getItem('morobo_user');
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      const userName = document.getElementById('userName');
      
      if (userName) {
        // Try to get name from user metadata or email
        const displayName = userData.user_metadata?.full_name || 
                          userData.email?.split('@')[0] || 
                          'Client';
        userName.textContent = displayName;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
}

// Load dashboard data
async function loadDashboardData() {
  // This is where you would fetch real data from Supabase
  // For now, we'll use placeholder data
  
  // Simulate loading data
  setTimeout(() => {
    // Update stats (these would come from Supabase in production)
    document.getElementById('activeProjects').textContent = '0';
    document.getElementById('totalInvoices').textContent = '0';
    document.getElementById('openTickets').textContent = '0';
    
    // If you have Supabase configured, you can fetch real data like this:
    /*
    if (typeof supabase !== 'undefined') {
      loadProjects();
      loadInvoices();
      loadTickets();
    }
    */
  }, 500);
}

// Load projects from Supabase
async function loadProjects() {
  if (!supabase) return;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    const projectsList = document.getElementById('projectsList');
    const activeProjectsCount = document.getElementById('activeProjects');
    
    if (projects && projects.length > 0) {
      projectsList.innerHTML = projects.map(project => `
        <li>
          <strong>${project.name}</strong> - ${project.status}
          <br>
          <small style="opacity: 0.7;">${new Date(project.created_at).toLocaleDateString()}</small>
        </li>
      `).join('');
      
      const activeCount = projects.filter(p => p.status === 'active').length;
      activeProjectsCount.textContent = activeCount;
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Load invoices from Supabase
async function loadInvoices() {
  if (!supabase) return;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    const invoicesList = document.getElementById('invoicesList');
    const totalInvoicesCount = document.getElementById('totalInvoices');
    
    if (invoices && invoices.length > 0) {
      invoicesList.innerHTML = invoices.map(invoice => `
        <li>
          <strong>Invoice #${invoice.invoice_number}</strong> - $${invoice.amount}
          <br>
          <small style="opacity: 0.7;">Status: ${invoice.status} | ${new Date(invoice.created_at).toLocaleDateString()}</small>
        </li>
      `).join('');
      
      totalInvoicesCount.textContent = invoices.length;
    }
  } catch (error) {
    console.error('Error loading invoices:', error);
  }
}

// Load support tickets from Supabase
async function loadTickets() {
  if (!supabase) return;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    const ticketsList = document.getElementById('ticketsList');
    const openTicketsCount = document.getElementById('openTickets');
    
    if (tickets && tickets.length > 0) {
      ticketsList.innerHTML = tickets.map(ticket => `
        <li>
          <strong>${ticket.subject}</strong> - ${ticket.status}
          <br>
          <small style="opacity: 0.7;">${new Date(ticket.created_at).toLocaleDateString()}</small>
        </li>
      `).join('');
      
      const openCount = tickets.filter(t => t.status === 'open').length;
      openTicketsCount.textContent = openCount;
    }
  } catch (error) {
    console.error('Error loading tickets:', error);
  }
}
