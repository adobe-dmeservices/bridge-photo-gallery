# Adobe Bridge Photo Gallery Generator - Installation Guide

## Overview

The Photo Gallery Generator is an Adobe ExtendScript that creates responsive HTML photo galleries directly from Adobe Bridge. This script allows users to select images from Bridge, configure layout options, and generate a complete web gallery with HTML, CSS, JavaScript, and optimized images.

## System Requirements

- **Adobe Bridge**: Any recent version (CC 2018 or later recommended)
- **Operating System**: Windows 10/11 or macOS 10.14+
- **Storage**: Sufficient disk space for processed images

## Installation Steps

### Step 1: Download the Script Files

1. Download all the script files from this repository:
   - `PhotoGalleryGenerator.jsx` (main script)
   - `lib_photoGalleryGenerator/utilities.jsxinc` (utility functions)
   - `lib_photoGalleryGenerator/dialogs.jsxinc` (user interface components)
   - `lib_photoGalleryGenerator/htmlGenerator.jsxinc` (HTML/CSS/JS generation)
   - `lib_photoGalleryGenerator/imageOptimization.jsxinc` (image processing)

### Step 2: Locate Bridge Startup Scripts Folder

The script needs to be placed in Adobe Bridge's Startup Scripts folder:

#### Windows:
```
C:\Users\[YourUsername]\AppData\Roaming\Adobe\CEP\extensions\Bridge\StartupScripts\
```

#### macOS:
```
/Users/[YourUsername]/Library/Application Support/Adobe/CEP/extensions/Bridge/StartupScripts/
```

**Note**: The `StartupScripts` folder may not exist. If it doesn't, create it.

### Step 3: Copy Script Files

1. Copy the main script file `PhotoGalleryGenerator.jsx` to the Startup Scripts folder
2. Copy the entire `lib` folder (containing all `.jsxinc` files) to the Startup Scripts folder
3. The folder structure should look like this:
   ```
   StartupScripts/
   ├── PhotoGalleryGenerator.jsx
   └── lib_photoGalleryGenerator/
       ├── utilities.jsxinc
       ├── dialogs.jsxinc
       ├── htmlGenerator.jsxinc
       └── imageOptimization.jsxinc
   ```

### Step 4: Restart Adobe Bridge

1. Close Adobe Bridge completely (if running)
2. Start Adobe Bridge
3. The script will automatically initialize and add the menu item

### Step 5: Verify Installation

1. Open Adobe Bridge
2. Check that "Export Photo Gallery" appears in the **Tools** menu
3. If you see the menu item, installation was successful!

## Troubleshooting Installation

### Script Doesn't Load
- Verify all files are in the correct Startup Scripts folder
- Ensure the `lib` folder and all its contents are present
- Check file permissions (ensure Bridge can read the files)
- Restart Bridge after installation
- Check Bridge's console for error messages

### Menu Item Missing
- Ensure the main script file is named exactly `PhotoGalleryGenerator.jsx`
- Verify the `lib` folder exists and contains all `.jsxinc` files
- Try restarting Bridge
- Check if other startup scripts work

### Permission Errors
- On Windows: Run Bridge as Administrator during installation
- On macOS: Ensure proper read permissions on the script files
- Check that the Startup Scripts folder is writable

## First Time Setup

When you first run the script after installation:

1. You'll see a welcome message with usage instructions
2. The script creates a settings file to track initialization
3. No further setup is required

## Updating the Script

To update to a newer version:

1. Download the new script files
2. Replace the old files in the Startup Scripts folder
3. Restart Bridge
4. The new version will be active

## Uninstalling

To remove the script:

1. Delete all script files from the Startup Scripts folder
2. Restart Bridge
3. The "Export Photo Gallery" menu item will be removed

## Alternative Installation Method

If the Startup Scripts method doesn't work, you can also:

1. Place the script files in any convenient location
2. Use Adobe ExtendScript Toolkit to run the script
3. Or load the script manually through Bridge's scripting interface

## Support

For issues or questions:
1. Verify your Bridge version and installation
2. Check the troubleshooting section in the main README
3. Test with a small number of images first
4. Ensure proper file permissions

## Technical Notes

- The script uses ES3/ES4 compatible JavaScript (ExtendScript limitations)
- All file paths use forward slashes for cross-platform compatibility
- ScriptUI is used for dialogs and user interface
- Bridge's thumbnail system is used for image selection
- Progress dialogs prevent UI freezing during processing

---

**Installation completed successfully?** The Photo Gallery Generator is now ready to use! Select some images in Bridge and try **Tools > Export Photo Gallery**.
