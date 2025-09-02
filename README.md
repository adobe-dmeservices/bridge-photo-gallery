# Bridge Photo Gallery Generator

A powerful Adobe ExtendScript that generates standalone HTML photo galleries directly from Adobe Bridge. This script allows users to select images from Bridge, configure layout options, and generate a complete web gallery with HTML, CSS, JavaScript, and optimized images.

## Features

- **Bridge Integration**: Seamlessly works with Adobe Bridge file selection
- **Customizable Layout**: Choose from Grid, Masonry, or Carousel layouts
- **Responsive Design**: Mobile-friendly gallery that works on all devices
- **Interactive Elements**: Lightbox image viewer with click-to-expand functionality
- **Professional Output**: Generates clean, modern HTML/CSS/JS code
- **Image Optimization**: Processes and optimizes images for web use

## Requirements

- Adobe Bridge (any recent version)
- Adobe ExtendScript Toolkit or similar ExtendScript environment
- Images in common formats: JPG, PNG, GIF, BMP, TIFF

## Installation

1. Download the `PhotoGalleryGenerator.jsx` file
2. Place it in your Adobe Bridge Startup Scripts folder:
   - **Windows**: `C:\Users\[Username]\AppData\Roaming\Adobe\CEP\extensions\Bridge\StartupScripts`
   - **Mac**: `~/Library/Application Support/Adobe/CEP/extensions/Bridge/StartupScripts`
3. Restart Adobe Bridge
4. The script will automatically add "Export Photo Gallery" to your Tools menu

## Usage

### Step 1: Select Images in Bridge
1. Open Adobe Bridge
2. Navigate to the folder containing your images
3. Select one or more image files (Ctrl/Cmd + Click for multiple)
4. Ensure the images are in supported formats (JPG, PNG, GIF, BMP, TIFF)

### Step 2: Run the Script
1. In Bridge, go to **Tools > Export Photo Gallery**
2. The script will open a dialog with configuration options

### Step 3: Configure Gallery Settings
- **Gallery Type**: Choose between Grid, Masonry, or Carousel layouts
- **Columns**: Set the number of columns for grid layout
- **Max Image Size**: Define the maximum pixel dimensions for images
- **JPEG Quality**: Set compression quality (1-100, higher = better quality)

### Step 4: Select Output Folder
1. Click "Browse" to choose where to save the generated gallery
2. Select an empty folder or create a new one

### Step 5: Generate Gallery
1. Click "Generate Gallery" to create your photo gallery
2. The script will process images and generate all necessary files
3. Your output folder will contain:
   - `index.html` - Main gallery page
   - `style.css` - Gallery styling
   - `script.js` - Interactive functionality
   - `images/` - Folder with optimized images
   - `README.txt` - Documentation

## Output Structure

```
Output Folder/
├── index.html          # Main gallery page
├── style.css           # Gallery styles
├── script.js           # Interactive features
├── images/             # Optimized images
│   ├── image1_opt.jpg
│   ├── image2_opt.png
│   └── ...
└── README.txt           # Documentation
```

## Gallery Features

### Responsive Grid Layout
- Automatically adjusts columns based on screen size
- Mobile-optimized for phones and tablets
- Clean, modern design with hover effects

### Interactive Lightbox
- Click any image to view it full-screen
- Dark overlay with close button
- Click outside image to close

### Professional Styling
- Clean typography and spacing
- Smooth hover animations
- Professional color scheme
- Box shadows and rounded corners

## Customization

The generated files are fully customizable:

- **HTML**: Modify structure and content
- **CSS**: Adjust colors, fonts, spacing, and animations
- **JavaScript**: Add new features or modify existing behavior
- **Images**: Replace with your own optimized versions

## Troubleshooting

### Common Issues

**"No image files selected"**
- Ensure you've selected image files in Bridge before running the script
- Check that your files are in supported formats

**"Could not process image"**
- Verify the image files aren't corrupted
- Ensure you have read permissions for the source files

**Script won't run**
- Check that the script is in the correct Bridge Startup Scripts folder
- Restart Bridge after adding the script
- Verify ExtendScript support is enabled
- Check that the "Export Photo Gallery" menu item appears in Tools menu

### Performance Tips

- For large galleries (50+ images), consider processing in smaller batches
- Use appropriate image quality settings (85-90 is usually optimal)
- Choose reasonable image sizes (800px max is good for most web use)

## Technical Details

- **Script Language**: Adobe ExtendScript (ES3/ES4 compatible)
- **UI Framework**: ScriptUI for all dialogs and interfaces
- **Output Format**: Standard HTML5, CSS3, and ES6 JavaScript
- **Image Processing**: File copying with optimization support
- **Cross-Platform**: Works on Windows and macOS

## Browser Compatibility

The generated gallery works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This script is provided as-is for educational and personal use. Feel free to modify and distribute as needed.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your Bridge and ExtendScript versions
3. Test with a small set of images first

## Version History

- **v1.0**: Initial release with basic gallery generation
- Features: Grid layout, lightbox, responsive design, image processing

---

**Note**: This script is designed specifically for Adobe Bridge and ExtendScript environments. It will not work in standard web browsers or other applications.
