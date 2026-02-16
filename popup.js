// Owl eye tracking with SVG
document.addEventListener('mousemove', (e) => {
  const owl = document.querySelector('.owl-container');
  const rect = owl.getBoundingClientRect();
  const owlX = rect.left + rect.width / 2;
  const owlY = rect.top + rect.height / 2;

  const angle = Math.atan2(e.clientY - owlY, e.clientX - owlX);
  const distance = Math.min(5, Math.sqrt(Math.pow(e.clientX - owlX, 2) + Math.pow(e.clientY - owlY, 2)) / 25);

  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  const leftPupil = document.getElementById('leftPupil');
  const rightPupil = document.getElementById('rightPupil');

  if (leftPupil) {
    leftPupil.style.transform = `translate(${x}px, ${y}px)`;
  }
  if (rightPupil) {
    rightPupil.style.transform = `translate(${x}px, ${y}px)`;
  }
});

// Data management
let bookmarks = [];
let folders = ['default'];
let selectedBookmarks = new Set();
let currentFolder = 'all';
let editingFolderId = null;
let confirmCallback = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  updateUI();
});

// Load data from storage
async function loadData() {
  const result = await chrome.storage.sync.get(['bookmarks', 'folders']);
  bookmarks = result.bookmarks || [];
  folders = result.folders || ['default'];
  updateUI();
}

// Save data to storage
async function saveData() {
  await chrome.storage.sync.set({ bookmarks, folders });
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const screenId = btn.dataset.screen + 'Screen';
      document.getElementById(screenId).classList.add('active');

      if (btn.dataset.screen === 'view') {
        renderBookmarks();
      } else if (btn.dataset.screen === 'folders') {
        renderFolders();
      }
    });
  });

  // Add bookmark form
  document.getElementById('addBookmarkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('bookmarkTitle').value;
    const url = document.getElementById('bookmarkUrl').value;
    const folder = document.getElementById('bookmarkFolder').value;

    const bookmark = {
      id: Date.now().toString(),
      title,
      url,
      folder,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`,
      createdAt: new Date().toISOString()
    };

    bookmarks.push(bookmark);
    await saveData();

    showSuccess('Bookmark saved successfully! 🎉');
    document.getElementById('addBookmarkForm').reset();
    updateFolderSelects();
  });

  // Capture current page
  document.getElementById('captureCurrentPage').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    document.getElementById('bookmarkTitle').value = tab.title;
    document.getElementById('bookmarkUrl').value = tab.url;
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    renderBookmarks(e.target.value);
  });

  // Folder modals
  document.getElementById('newFolderBtn').addEventListener('click', () => {
    editingFolderId = null;
    document.getElementById('folderModalTitle').textContent = 'New Folder';
    document.getElementById('folderNameInput').value = '';
    document.getElementById('folderModal').classList.add('active');
  });

  document.getElementById('cancelFolderBtn').addEventListener('click', () => {
    document.getElementById('folderModal').classList.remove('active');
  });

  document.getElementById('saveFolderBtn').addEventListener('click', async () => {
    const name = document.getElementById('folderNameInput').value.trim();
    if (!name) return;

    if (editingFolderId !== null) {
      const oldName = folders[editingFolderId];
      folders[editingFolderId] = name;
      // Update bookmarks with this folder
      bookmarks.forEach(b => {
        if (b.folder === oldName) b.folder = name;
      });
    } else {
      folders.push(name);
    }

    await saveData();
    updateFolderSelects();
    renderFolders();
    document.getElementById('folderModal').classList.remove('active');
  });

  // Bulk actions
  document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
    showConfirm(
      'Delete Bookmarks',
      `Are you sure you want to delete ${selectedBookmarks.size} bookmark(s)?`,
      async () => {
        bookmarks = bookmarks.filter(b => !selectedBookmarks.has(b.id));
        await saveData();
        selectedBookmarks.clear();
        renderBookmarks();
      }
    );
  });

  document.getElementById('cancelSelectionBtn').addEventListener('click', () => {
    selectedBookmarks.clear();
    renderBookmarks();
  });

  // Settings
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFileInput').click();
  });

  document.getElementById('importFileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        bookmarks = data.bookmarks || [];
        folders = data.folders || ['default'];
        await saveData();
        showSuccess('Bookmarks imported successfully! 🎉');
        updateUI();
      } catch (err) {
        alert('Error importing file. Please check the format.');
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    const data = { bookmarks, folders };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owl-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Bookmarks exported successfully! 📥');
  });

  document.getElementById('syncBtn').addEventListener('click', async () => {
    showSuccess('Bookmarks are automatically synced via Chrome Sync! ☁️');
  });

  document.getElementById('clearAllBtn').addEventListener('click', () => {
    showConfirm(
      'Clear All Data',
      'This will delete ALL bookmarks and folders. This action cannot be undone!',
      async () => {
        bookmarks = [];
        folders = ['default'];
        await saveData();
        showSuccess('All data cleared! 🗑️');
        updateUI();
      }
    );
  });

  // Confirm modal
  document.getElementById('cancelConfirmBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').classList.remove('active');
  });

  document.getElementById('confirmActionBtn').addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    document.getElementById('confirmModal').classList.remove('active');
  });
}

// Update UI
function updateUI() {
  updateFolderSelects();
  updateFolderTabs();
  renderBookmarks();
  renderFolders();
}

// Update folder select dropdowns
function updateFolderSelects() {
  const select = document.getElementById('bookmarkFolder');
  select.innerHTML = folders.map(f => `<option value="${f}">${f}</option>`).join('');
}

// Update folder tabs
function updateFolderTabs() {
  const container = document.getElementById('folderTabs');
  const allTab = '<div class="folder-tab active" data-folder="all">All</div>';
  const folderTabs = folders.map(f =>
    `<div class="folder-tab" data-folder="${f}">${f}</div>`
  ).join('');

  container.innerHTML = allTab + folderTabs;

  container.querySelectorAll('.folder-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.folder-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFolder = tab.dataset.folder;
      renderBookmarks();
    });
  });
}

// Render bookmarks
function renderBookmarks(searchQuery = '') {
  const grid = document.getElementById('bookmarksGrid');
  let filtered = bookmarks;

  // Filter by folder
  if (currentFolder !== 'all') {
    filtered = filtered.filter(b => b.folder === currentFolder);
  }

  // Filter by search
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(query) ||
      b.url.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🦉</div>
        <p>${searchQuery ? 'No bookmarks found' : 'No bookmarks yet. Start adding!'}</p>
      </div>
    `;
    document.getElementById('bulkActions').style.display = 'none';
    return;
  }

  grid.innerHTML = filtered.map(bookmark => `
    <div class="bookmark-card ${selectedBookmarks.has(bookmark.id) ? 'selected' : ''}" data-id="${bookmark.id}">
      <div class="bookmark-favicon">
        <img src="${bookmark.favicon}" class="favicon-img" width="24" height="24">
      </div>
      <div class="bookmark-title" title="${bookmark.title}">${bookmark.title}</div>
      <div class="bookmark-url" title="${bookmark.url}">${new URL(bookmark.url).hostname}</div>
      <div class="bookmark-actions">
        <button class="icon-btn open-btn" data-id="${bookmark.id}">Open</button>
        <button class="icon-btn select-btn" data-id="${bookmark.id}">Select</button>
        <button class="icon-btn delete-btn" data-id="${bookmark.id}">Delete</button>
      </div>
    </div>
  `).join('');

  // Add error handlers for favicons (fixes CSP violation)
  grid.querySelectorAll('.favicon-img').forEach(img => {
    img.addEventListener('error', () => {
      img.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><text y=%2218%22 font-size=%2218%22>🔖</text></svg>';
    });
  });

  // Event listeners for cards
  grid.querySelectorAll('.open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookmark = bookmarks.find(b => b.id === btn.dataset.id);
      chrome.tabs.create({ url: bookmark.url });
    });
  });

  grid.querySelectorAll('.select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSelection(btn.dataset.id);
    });
  });

  grid.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteBookmark(btn.dataset.id);
    });
  });

  grid.querySelectorAll('.bookmark-card').forEach(card => {
    card.addEventListener('click', () => {
      const bookmark = bookmarks.find(b => b.id === card.dataset.id);
      chrome.tabs.create({ url: bookmark.url });
    });
  });

  // Update bulk actions visibility
  if (selectedBookmarks.size > 0) {
    document.getElementById('bulkActions').style.display = 'block';
    document.getElementById('selectedCount').textContent = selectedBookmarks.size;
  } else {
    document.getElementById('bulkActions').style.display = 'none';
  }
}

// Toggle bookmark selection
function toggleSelection(id) {
  if (selectedBookmarks.has(id)) {
    selectedBookmarks.delete(id);
  } else {
    selectedBookmarks.add(id);
  }
  renderBookmarks();
}

// Delete single bookmark
function deleteBookmark(id) {
  showConfirm(
    'Delete Bookmark',
    'Are you sure you want to delete this bookmark?',
    async () => {
      bookmarks = bookmarks.filter(b => b.id !== id);
      await saveData();
      renderBookmarks();
    }
  );
}

// Render folders
function renderFolders() {
  const container = document.getElementById('foldersList');

  const folderItems = folders.map((folder, index) => {
    const count = bookmarks.filter(b => b.folder === folder).length;
    const isDefault = folder === 'default';

    return `
      <div class="folder-item">
        <span class="folder-icon">📁</span>
        <div class="folder-info">
          <div class="folder-name">${folder}</div>
          <div class="folder-count">${count} bookmark${count !== 1 ? 's' : ''}</div>
        </div>
        <div class="folder-actions">
          ${!isDefault ? `
            <button class="icon-btn rename-folder-btn" data-index="${index}">✏️</button>
            <button class="icon-btn delete-folder-btn" data-index="${index}">🗑️</button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = folderItems;

  // Rename folder
  container.querySelectorAll('.rename-folder-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      editingFolderId = index;
      document.getElementById('folderModalTitle').textContent = 'Rename Folder';
      document.getElementById('folderNameInput').value = folders[index];
      document.getElementById('folderModal').classList.add('active');
    });
  });

  // Delete folder
  container.querySelectorAll('.delete-folder-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      const folderName = folders[index];
      const count = bookmarks.filter(b => b.folder === folderName).length;

      showConfirm(
        'Delete Folder',
        `Delete "${folderName}"? ${count > 0 ? `${count} bookmark(s) will be moved to Default.` : ''}`,
        async () => {
          // Move bookmarks to default
          bookmarks.forEach(b => {
            if (b.folder === folderName) b.folder = 'default';
          });

          folders.splice(index, 1);
          await saveData();
          updateUI();
        }
      );
    });
  });
}

// Show success message
function showSuccess(message) {
  const container = document.getElementById('successMessage');
  container.innerHTML = `<div class="success-message">${message}</div>`;
  setTimeout(() => {
    container.innerHTML = '';
  }, 3000);
}

// Show confirm dialog
function showConfirm(title, message, callback) {
  document.getElementById('confirmModalTitle').textContent = title;
  document.getElementById('confirmModalText').textContent = message;
  confirmCallback = callback;
  document.getElementById('confirmModal').classList.add('active');
}