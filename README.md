# Adobe® Bridge Photo Gallery Generator

A professional Adobe Bridge extension that generates responsive HTML photo galleries directly from your Bridge workspace. This ZXP extension allows users to select images from Bridge, configure advanced layout options, and generate complete web galleries with HTML, CSS, JavaScript, and optimized images with intelligent metadata extraction.

## Features

### Core Features
- **Professional ZXP Extension**: Installs directly into Adobe Bridge as an official extension
- **Bridge Integration**: Seamlessly works with Adobe Bridge file selection and metadata
- **Advanced Layouts**: Choose from Grid, Masonry, or Carousel layouts with customizable options
- **Responsive Design**: Mobile-friendly galleries that work perfectly on all devices
- **Interactive Lightbox**: Full-screen image viewer with keyboard navigation and touch support
- **Professional Output**: Generates clean, modern HTML5/CSS3/ES6 code

### Advanced Capabilities
- **XMP Metadata Extraction**: Automatically extracts titles and descriptions from image metadata
- **Intelligent Captioning**: Configurable caption sources (Title → Description → Filename fallback)
- **Image Processing**: Built-in image optimization with rotation support and quality control
- **Grid Container Options**: Full-size or square aspect ratio containers
- **Progress Tracking**: Real-time progress dialogs during gallery generation
- **Batch Processing**: Efficiently handles large image collections

## Requirements

- **Adobe Bridge**: CC 2018 or later (Bridge 9+)
- **Operating System**: Windows 10/11 or macOS 10.14+
- **ZXP Installation**: Install from Adobe Extension Marketplace or Anastasiy's Extension Manager
- **Supported Formats**: JPG, JPEG, PNG, GIF, BMP, TIFF, TIF, PSD, PDF
- **Node.js**: 14.0.0+ (for building from source)

## Installation

### Option 1: Adobe Extension Marketplace (Recommended)

1. **Log in to Creative Cloud (if not already logged in)**
2. **Browse to [Adobe Marketplace for Creative Cloud](https://exchange.adobe.com/apps/browse/cc?listingType=plugins&page=1&product=KBRG&sort=RELEVANCE)**  and search for "Photo Gallery Generator for Bridge"
3. **Log in to Creative Cloud (if not already logged in)**
4. **Click Acquire**
5. **Restart Adobe Bridge**
6. The extension adds "Export Photo Gallery" to your **Tools** menu

### Option 2: ZXP Extension

1. **Download the ZXP file** from the [Releases](release/) section
2. **Install using Anastasiy's Extension Manager:**
   - Download [Anastasiy's Extension Manager](https://install.anastasiy.com)
   - Open Anastasiy's Extension Manager and drag the `.zxp` file onto it
   - Follow the installation prompts
3. **Restart Adobe Bridge**
4. The extension adds "Export Photo Gallery" to your **Tools** menu

### Option 3: Manual Installation

1. Download all script files from the `Startup_Script/` folder
2. Place them in your Bridge Startup Scripts folder:
   - **Windows**: `C:\Users\[Username]\AppData\Roaming\Adobe\CEP\extensions\Bridge\StartupScripts`
   - **Mac**: `~/Library/Application Support/Adobe/CEP/extensions/Bridge/StartupScripts`
3. Maintain the folder structure (include the `lib_photoGalleryGenerator/` subfolder)
4. Restart Adobe Bridge

### Verification
- Look for "Export Photo Gallery" in the **Tools** menu
- You'll see a welcome message on first run

## Usage

### Step 1: Select Images in Bridge
1. Open Adobe Bridge
2. Navigate to the folder containing your images
3. Select one or more image files (Ctrl/Cmd + Click for multiple)
4. Ensure the images are in supported formats (JPG, JPEG, PNG, GIF, BMP, TIFF, TIF, PSD, PDF)

### Step 2: Run the Script
1. In Bridge, go to **Tools > Export Photo Gallery**
2. The script will open a dialog with configuration options

### Step 3: Configure Gallery Settings
- **Gallery Name**: Set a custom name for your gallery
- **Gallery Layout**: Choose from Grid, Masonry, or Carousel layouts
- **Grid Container**: Select Full Size or Square aspect ratio (Grid layout only)
- **Caption Source**: Configure title/description source priority:
  - Title → Description → Filename (uses XMP metadata when available)
  - Description → Title → Filename
  - Filename only
- **Columns**: Set number of columns (2-6) for Grid and Masonry layouts
- **Image Settings**: 
  - Max Image Width: 400-2000px (default: 800px)
  - Max Image Height: 300-1500px (default: 600px)
  - JPEG Quality: 1-100% (default: 85%)
  - PNG Quality: 1-100% (default: 95%)

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

### Layout Options

**Grid Layout**
- Responsive grid with 2-6 configurable columns
- Full-size or square container options
- Automatic mobile adaptation
- Clean hover effects and animations

**Masonry Layout**
- Pinterest-style variable height layout
- CSS columns with modern browser support
- Maintains aspect ratios
- Break-inside optimization

**Carousel Layout**
- Full-screen sliding image viewer
- Navigation arrows and dot indicators
- Touch/swipe support for mobile
- Automatic caption display

### Interactive Features
- **Advanced Lightbox**: Full-screen image viewer with keyboard navigation (arrow keys, ESC)
- **Touch Support**: Mobile-friendly touch and swipe gestures
- **Metadata Display**: Shows image titles/descriptions from XMP metadata
- **Progress Indicators**: Real-time progress during gallery generation
- **Responsive Design**: Automatically adapts to all screen sizes

### Technical Excellence
- **Modern Web Standards**: HTML5, CSS3, ES6 JavaScript
- **Cross-Browser Compatible**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Performance Optimized**: Efficient image loading and rendering
- **SEO-Friendly**: Semantic HTML structure with proper meta tags

## Advanced Features

### XMP Metadata Integration
- **Automatic Extraction**: Reads title and description from image XMP metadata
- **Dublin Core Support**: Uses standard DC namespace properties
- **Fallback Strategy**: Intelligent fallback to filename when metadata unavailable
- **Rotation Support**: Respects image rotation from metadata

### Image Processing
- **Smart Resizing**: Maintains aspect ratios while optimizing for web
- **Quality Control**: Configurable compression for JPEG and PNG
- **Format Support**: Handles JPEG, PNG, GIF, BMP, TIFF, PSD, and PDF
- **Batch Processing**: Efficient handling of large image collections
- **Progress Tracking**: Real-time progress with file-by-file updates

### Customization
The generated files are fully customizable:
- **HTML**: Clean, semantic structure ready for modifications
- **CSS**: Modern CSS3 with CSS custom properties for easy theming
- **JavaScript**: Modular ES6 code with clear separation of concerns
- **Images**: Optimized output files ready for further processing

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

- **Large Galleries**: 100+ images process efficiently with progress tracking
- **Quality Settings**: 85% JPEG quality provides optimal size/quality balance
- **Image Dimensions**: 800px max width recommended for web galleries
- **Layout Choice**: Grid layout performs best for large collections
- **Batch Processing**: Extension handles batch operations automatically

## Technical Details

### Extension Architecture
- **Extension Type**: Adobe ZXP extension with manifest
- **Script Language**: Adobe ExtendScript (ES3/ES4 compatible)
- **UI Framework**: ScriptUI for dialogs and progress tracking
- **XMP Integration**: Adobe XMP Script library for metadata extraction
- **Cross-Platform**: Full Windows and macOS support

### Output Technology
- **HTML**: Semantic HTML5 with accessibility features
- **CSS**: Modern CSS3 with flexbox/grid and custom properties
- **JavaScript**: Clean ES6 with progressive enhancement
- **Images**: Intelligent optimization with quality control
- **File Structure**: Organized output with clear documentation

### Build System
- **Package Management**: npm with Node.js 14.0.0+
- **ZXP Creation**: Automated build with digital signing
- **Development Tools**: Hot reload and debugging support
- **Distribution**: Signed ZXP packages for easy installation

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

## Development & Building

### Building from Source

```bash
# Install dependencies
npm install

# Build ZXP extension
ZXP_CERT_PASSWORD=your_password npm run build

# Development build with timestamp
npm run build:dev

# Prepare files without signing
npm run prepare
```

### Development Workflow
1. Modify source files in `Startup_Script/`
2. Test by copying to Bridge startup folder
3. Build development ZXP for testing
4. Create production ZXP for distribution

See [BUILD.md](BUILD.md) for detailed build instructions.

## Version History

- **v1.0.0**: Production release with full ZXP packaging
  - Features: Grid, Masonry, and Carousel layouts
  - XMP metadata extraction and intelligent captioning
  - Advanced image processing with rotation support
  - Professional ZXP extension with automated build system
  - Full progress tracking and error handling
  - Modern HTML5/CSS3/ES6 output with responsive design

---

## Support & Documentation

For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md).
For build instructions and development, see [BUILD.md](BUILD.md).

**Note**: This extension is designed specifically for Adobe Bridge and ExtendScript environments. The generated galleries work in all modern web browsers, but the extension itself requires Adobe Bridge to function.
