# 🦉 Owl Bookmarks - Chrome Extension

A beautiful, feature-rich bookmark manager with an adorable owl mascot whose eyes follow your cursor!

## ✨ Features

### Core Functionality
- **Smart Bookmark Management**: Save, organize, and access bookmarks with ease
- **Interactive Owl Mascot**: Eyes follow your cursor like MetaMask!
- **Folder Organization**: Create, rename, and delete custom folders
- **Grid View Display**: Beautiful card-based layout showing titles, URLs, and favicons
- **Advanced Search**: Quickly find bookmarks with real-time search
- **Bulk Operations**: Select and delete multiple bookmarks at once

### Import/Export
- **JSON Import**: Import bookmarks from JSON files
- **JSON Export**: Export all bookmarks and folders to JSON
- **Chrome Sync**: Automatically sync across all your devices

### Context Menu Integration
- Right-click any page to save it instantly
- Right-click any link to bookmark it directly

### User Experience
- **Minimalistic Design**: Clean, modern interface with purple gradient theme
- **Responsive Layout**: Works perfectly at any size
- **Quick Access**: Always available from browser toolbar
- **Success Notifications**: Visual feedback for all actions

## 📦 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download the files**:
   - Create a folder named `owl-bookmarks`
   - Save all the following files in this folder:
     - `manifest.json`
     - `popup.html`
     - `popup.js`
     - `background.js`

2. **Create icons folder**:
   - Inside `owl-bookmarks`, create a folder named `icons`
   - Add icon files (16x16, 48x48, 128x128 PNG images) named:
     - `icon16.png`
     - `icon48.png`
     - `icon128.png`
   - You can use any owl icon images or create simple purple circular icons

3. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `owl-bookmarks` folder
   - The extension will now appear in your toolbar!

### Method 2: Create Icon Placeholders (Quick Start)

If you don't have icon files ready, create simple placeholder images:

1. Create 3 PNG files (16x16, 48x48, 128x128 pixels)
2. Use any image editor or online tool
3. Make them purple circles or use an owl emoji screenshot
4. Name them `icon16.png`, `icon48.png`, `icon128.png`
5. Place in the `icons` folder

## 🎯 How to Use

### Adding Bookmarks

**Method 1: From Extension**
1. Click the Owl Bookmarks icon in toolbar
2. Click "+ Add" tab
3. Click "📍 Capture Current Page" or enter details manually
4. Select a folder
5. Click "💾 Save Bookmark"

**Method 2: Context Menu**
1. Right-click anywhere on a page
2. Select "Save to Owl Bookmarks"
3. Bookmark is automatically saved!

**Method 3: Context Menu (Links)**
1. Right-click any link
2. Select "Save Link to Owl Bookmarks"
3. Link is bookmarked instantly!

### Viewing Bookmarks

1. Click "📚 View" tab
2. Use search bar to find bookmarks
3. Filter by folder using tabs
4. Click any bookmark card to open
5. Use "Select" to mark multiple bookmarks
6. Use "Delete" to remove individual bookmarks

### Managing Folders

1. Click "📁 Folders" tab
2. Click "➕ New Folder" to create
3. Use ✏️ to rename folders
4. Use 🗑️ to delete folders
5. Bookmarks in deleted folders move to "Default"

### Bulk Operations

1. Go to "📚 View" tab
2. Click "Select" on multiple bookmarks
3. Click "🗑️ Delete" in the bulk actions bar
4. Confirm deletion

### Import/Export

**Export Bookmarks**:
1. Click "⚙️ Settings" tab
2. Click "📤 Export Bookmarks"
3. JSON file downloads automatically

**Import Bookmarks**:
1. Click "⚙️ Settings" tab
2. Click "📥 Import Bookmarks"
3. Select your JSON file
4. Bookmarks are imported instantly

### Sync Across Devices

- Bookmarks automatically sync via Chrome Sync
- Just sign in to Chrome on multiple devices
- All bookmarks stay in sync! ☁️

## 🎨 Features Breakdown

### The Owl Mascot
- Eyes follow your mouse cursor in real-time
- Smooth, natural eye movement
- Adds personality to the extension
- Purple color scheme matching the theme

### Grid View
- Clean card-based layout
- Shows favicon, title, and URL
- Hover effects for better interactivity
- Responsive grid adjusts to content

### Search Functionality
- Real-time search as you type
- Searches both titles and URLs
- Case-insensitive matching
- Instant results

### Folder System
- Unlimited custom folders
- Default folder always available
- Easy rename and delete
- Shows bookmark count per folder

## 🔧 Technical Details

### Storage
- Uses Chrome Sync Storage (100KB limit)
- Stores bookmarks and folders as JSON
- Automatic sync across devices
- No external dependencies

### Permissions Required
- `storage`: Save bookmarks and settings
- `tabs`: Capture current page info
- `contextMenus`: Right-click menu integration
- `bookmarks`: (Optional, not actively used but available)

### Browser Compatibility
- Chrome 88+
- Microsoft Edge (Chromium)
- Brave Browser
- Any Chromium-based browser

## 📝 File Structure

```
owl-bookmarks/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI interface
├── popup.js              # UI logic and functionality
├── background.js         # Background service worker
├── icons/
│   ├── icon16.png       # 16x16 icon
│   ├── icon48.png       # 48x48 icon
│   └── icon128.png      # 128x128 icon
└── README.md            # This file
```

## 🎯 Data Format (JSON)

Export/Import JSON structure:

```json
{
  "bookmarks": [
    {
      "id": "1234567890",
      "title": "Example Site",
      "url": "https://example.com",
      "folder": "default",
      "favicon": "https://www.google.com/s2/favicons?domain=example.com&sz=64",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "folders": ["default", "Work", "Personal", "Tech"]
}
```

## 🐛 Troubleshooting

**Extension not loading?**
- Make sure all files are in the correct folder
- Check that icons folder exists with all 3 icon files
- Reload the extension from chrome://extensions/

**Bookmarks not syncing?**
- Ensure you're signed in to Chrome
- Check Chrome Sync is enabled in Settings
- Wait a few moments for sync to occur

**Context menu not appearing?**
- Reload the extension
- Check that the extension is enabled
- Try restarting Chrome

## 🚀 Future Enhancements (Ideas)

- Tags for bookmarks
- Custom themes
- Bookmark sharing
- Browser history integration
- Bookmark notes/descriptions
- Sorting options (date, name, frequency)
- Keyboard shortcuts
- Dark mode toggle

## 📄 License

This extension is provided as-is for personal use. Feel free to modify and customize!

## 🤝 Contributing

Have ideas for improvement? Want to add features? Feel free to:
- Modify the code
- Add new features
- Improve the design
- Fix bugs

## 💡 Tips

1. **Organize Early**: Create folders as you save bookmarks
2. **Use Search**: Faster than scrolling through all bookmarks
3. **Regular Exports**: Backup your bookmarks periodically
4. **Bulk Delete**: Clean up old bookmarks efficiently
5. **Context Menu**: Fastest way to bookmark while browsing

---

Made with 💜 by the wise Owl 🦉

Enjoy your new bookmark manager!