function showLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="login-container">
        <form class="login-form" id="loginForm">
          <h2>Login</h2>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" placeholder="Enter username" id="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" placeholder="Enter password" id="password" required>
          </div>
          <button type="submit">Sign In</button>
          <div id="loginError" class="error-message">Invalid credentials!</div>
        </form>
      </div>
    `;
  
    document.getElementById('loginForm').onsubmit = function(e) {
      e.preventDefault();
      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;
      const errorDiv = document.getElementById('loginError');
      
      if (user === window.env.USERNAME && pass === window.env.PASSWORD) {
        errorDiv.style.display = 'none';
        showDashboard();
      } else {
        errorDiv.style.display = 'block';
        document.getElementById('password').value = '';
      }
    };
  }