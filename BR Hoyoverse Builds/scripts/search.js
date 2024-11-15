// search.js

// Handle Search Bar functionality
document.getElementById('search-btn').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    if (query) {
      alert('Search for: ' + query);  // Replace with actual search functionality
    } else {
      alert('Please enter a search query');
    }
  });
  