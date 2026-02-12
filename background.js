// Context menu integration
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu
  chrome.contextMenus.create({
    id: 'saveToOwlBookmarks',
    title: 'Save to Owl Bookmarks',
    contexts: ['page', 'link']
  });
  
  chrome.contextMenus.create({
    id: 'saveToOwlBookmarksLink',
    title: 'Save Link to Owl Bookmarks',
    contexts: ['link']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToOwlBookmarks') {
    // Save current page
    saveBookmark(tab.title, tab.url);
  } else if (info.menuItemId === 'saveToOwlBookmarksLink') {
    // Save linked page
    saveBookmark(info.linkUrl, info.linkUrl);
  }
});

// Save bookmark function
async function saveBookmark(title, url) {
  const result = await chrome.storage.sync.get(['bookmarks', 'folders']);
  const bookmarks = result.bookmarks || [];
  const folders = result.folders || ['default'];
  
  // Check if bookmark already exists
  const exists = bookmarks.some(b => b.url === url);
  if (exists) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Owl Bookmarks',
      message: 'This page is already bookmarked!'
    });
    return;
  }
  
  const bookmark = {
    id: Date.now().toString(),
    title: title,
    url: url,
    folder: 'default',
    favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`,
    createdAt: new Date().toISOString()
  };
  
  bookmarks.push(bookmark);
  await chrome.storage.sync.set({ bookmarks });
  
  // Show notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Owl Bookmarks',
    message: '✓ Bookmark saved successfully!'
  });
}

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'save-bookmark') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      saveBookmark(tab.title, tab.url);
    });
  }
});