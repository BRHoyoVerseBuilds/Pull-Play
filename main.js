// Add touch event handling
document.addEventListener('touchstart', function() {}, true);

// Theme toggling functionality
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme based on system preference
document.documentElement.setAttribute('data-theme', 
  prefersDarkScheme.matches ? 'dark' : 'light'
);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    document.querySelector(targetId).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Add smooth scroll animation for quick jump links
document.querySelectorAll('.quick-jump-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Intersection Observer for animation
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.game-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(card);
});

// Quick Links Management
const MAX_QUICK_LINKS = 5;

// Initialize quick links from localStorage or empty array if none exist
let quickLinks = JSON.parse(localStorage.getItem('quickLinks') || '[]');

function saveQuickLinks() {
  localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
  updateQuickLinksDisplay();
}

function addQuickLink(name, url, imageUrl, game) {
  if (quickLinks.length >= MAX_QUICK_LINKS) {
    alert(`You can only have ${MAX_QUICK_LINKS} quick links. Please remove one first.`);
    return;
  }
  
  quickLinks.push({ name, url, imageUrl, game });
  saveQuickLinks();
}

function removeQuickLink(index) {
  quickLinks.splice(index, 1);
  saveQuickLinks();
}

function updateQuickLinksDisplay() {
  const quickLinksContainer = document.getElementById('quickLinksContainer');
  if (!quickLinksContainer) return;
  
  quickLinksContainer.innerHTML = '';
  
  // Display existing quick links
  quickLinks.forEach((link, index) => {
    const initial = link.name.charAt(0).toUpperCase();
    const linkElement = document.createElement('div');
    linkElement.className = 'quick-link-item';
    linkElement.innerHTML = `
      <div class="quick-link-image ${!link.imageUrl ? 'placeholder' : ''}" 
           ${link.imageUrl ? `style="background-image: url('${link.imageUrl}')"` : `data-initial="${initial}"`}>
      </div>
      <div class="quick-link-content">
        <a href="${link.url}" class="quick-link-name" target="_blank">${link.name}</a>
        <div class="quick-link-game">${link.game}</div>
        <div class="quick-link-url">${link.url}</div>
        <button class="quick-link-remove" onclick="removeQuickLink(${index})">Remove</button>
      </div>
    `;
    quickLinksContainer.appendChild(linkElement);
  });

  // Add new link button if under limit
  if (quickLinks.length < MAX_QUICK_LINKS) {
    const addButton = document.createElement('div');
    addButton.className = 'quick-link-add';
    addButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
      <span>Add Character Build</span>
    `;
    addButton.onclick = showAddLinkDialog;
    quickLinksContainer.appendChild(addButton);
  }
}

function showAddLinkDialog() {
  const modal = document.createElement('div');
  modal.className = 'quick-link-modal';
  
  // Get games from the game cards
  const games = Array.from(document.querySelectorAll('.game-card')).map(card => ({
    id: card.dataset.game,
    name: card.querySelector('h3').textContent
  }));
  
  const gameOptions = games.map(game => 
    `<option value="${game.name}">${game.name}</option>`
  ).join('');
  
  modal.innerHTML = `
    <div class="quick-link-modal-content">
      <h3>Add Character Build</h3>
      <div class="quick-link-form">
        <div class="form-group">
          <label for="characterName">Character Name</label>
          <input type="text" id="characterName" placeholder="Enter character name">
        </div>
        <div class="form-group">
          <label for="gameSource">Game/Source</label>
          <select id="gameSource" class="game-select">
            <option value="" disabled selected>Select a game</option>
            ${gameOptions}
          </select>
        </div>
        <div class="form-group">
          <label for="buildUrl">Build URL</label>
          <input type="text" id="buildUrl" placeholder="Enter build URL">
        </div>
        <div class="form-group image-input">
          <label for="imageUrl">Character Image URL</label>
          <input type="text" id="imageUrl" placeholder="Enter image URL">
        </div>
      </div>
      
      <div class="preview-section">
        <h4>Preview</h4>
        <div class="quick-link-item preview">
          <div class="image-preview placeholder" data-initial=""></div>
          <div class="quick-link-content">
            <a href="#" class="quick-link-name preview-name">Character Name</a>
            <div class="quick-link-game preview-game">Game/Source</div>
            <div class="quick-link-url preview-url">Build URL</div>
          </div>
        </div>
      </div>
      
      <div class="modal-buttons">
        <button class="modal-button cancel">Cancel</button>
        <button class="modal-button add" disabled>Add Build</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const nameInput = modal.querySelector('#characterName');
  const gameInput = modal.querySelector('#gameSource');
  const urlInput = modal.querySelector('#buildUrl');
  const imageInput = modal.querySelector('#imageUrl');
  const previewImage = modal.querySelector('.image-preview');
  const previewName = modal.querySelector('.preview-name');
  const previewGame = modal.querySelector('.preview-game');
  const previewUrl = modal.querySelector('.preview-url');
  const addButton = modal.querySelector('.modal-button.add');
  
  function updatePreview() {
    const name = nameInput.value.trim();
    const game = gameInput.value.trim();
    const url = urlInput.value.trim();
    const imageUrl = imageInput.value.trim();
    
    if (imageUrl) {
      previewImage.style.backgroundImage = `url('${imageUrl}')`;
      previewImage.classList.remove('placeholder');
      previewImage.removeAttribute('data-initial');
    } else {
      previewImage.style.backgroundImage = '';
      previewImage.classList.add('placeholder');
      previewImage.setAttribute('data-initial', name ? name.charAt(0).toUpperCase() : '');
    }
    
    previewName.textContent = name || 'Character Name';
    previewGame.textContent = game || 'Game/Source';
    previewUrl.textContent = url || 'Build URL';
    
    addButton.disabled = !(name && game && url);
  }
  
  nameInput.addEventListener('input', updatePreview);
  gameInput.addEventListener('input', updatePreview);
  urlInput.addEventListener('input', updatePreview);
  imageInput.addEventListener('input', updatePreview);
  
  modal.querySelector('.modal-button.cancel').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.modal-button.add').addEventListener('click', () => {
    const name = nameInput.value.trim();
    const game = gameInput.value.trim();
    const url = urlInput.value.trim();
    const imageUrl = imageInput.value.trim();
    
    if (name && game && url) {
      addQuickLink(name, url, imageUrl, game);
      document.body.removeChild(modal);
    }
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  nameInput.focus();
}

// Initialize quick links display when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateQuickLinksDisplay();
  
  // Add collapse functionality
  const sectionHeader = document.querySelector('.section-header');
  const quickLinksContainer = document.getElementById('quickLinksContainer');
  
  // Get collapse state from localStorage
  const isCollapsed = localStorage.getItem('favoriteCharactersCollapsed') === 'true';
  
  if (isCollapsed) {
    sectionHeader.classList.add('collapsed');
    quickLinksContainer.classList.add('collapsed');
  }
  
  sectionHeader.addEventListener('click', () => {
    sectionHeader.classList.toggle('collapsed');
    quickLinksContainer.classList.toggle('collapsed');
    
    // Save collapse state to localStorage
    localStorage.setItem(
      'favoriteCharactersCollapsed',
      quickLinksContainer.classList.contains('collapsed')
    );
  });
});

// Make functions available globally
window.addQuickLink = addQuickLink;
window.removeQuickLink = removeQuickLink;
window.showAddLinkDialog = showAddLinkDialog;