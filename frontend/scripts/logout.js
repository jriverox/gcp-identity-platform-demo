// logout.js
document.getElementById('logoutLink').addEventListener('click', () => {
  localStorage.removeItem('idToken');
  window.location.href = 'login.html';
});
