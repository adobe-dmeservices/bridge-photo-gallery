# Build Instructions for Bridge Photo Gallery

This document explains how to build and package the Bridge Photo Gallery extension into a ZXP file for distribution.

## Prerequisites

- **Node.js** (version 14.0.0 or higher)
- **ZXPSignCmd** tool (included in `certificate/ZXPSignCmd`)
- **P12 Certificate** (should be located at `certificate/cert.p12`)
- **Certificate Password** (required for signing)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Prepare files for packaging:**
   ```bash
   npm run prepare
   ```

3. **Build signed ZXP (requires certificate password):**
   ```bash
   ZXP_CERT_PASSWORD=your_password npm run build
   ```

## Available Scripts

### `npm run build`
Builds a production ZXP file with signature.
- Cleans the `zxp-temp` directory
- Copies all required files to `zxp-temp`
- Creates signed ZXP using ZXPSignCmd
- **Requires:** `ZXP_CERT_PASSWORD` environment variable

### `npm run build:dev`
Same as build but creates a development ZXP with timestamp in filename.
- Output: `com.adobe.bridgephotogallery-dev-YYYY-MM-DD.zxp`

### `npm run prepare`
Prepares files for ZXP creation without signing.
- Useful for manual signing or inspection
- Files are copied to `zxp-temp` directory
- Shows manual signing command

### `npm run clean`
Cleans the `zxp-temp` directory.

## File Structure

The build process copies these files to `zxp-temp`:

```
zxp-temp/
├── META-INF/                          # (created automatically)
├── Startup_Script/
│   ├── PhotoGalleryGenerator.jsx     # Main extension script
│   └── lib_photoGalleryGenerator/
│       ├── dialogs.jsxinc            # UI dialogs
│       ├── htmlGenerator.jsxinc      # HTML generation
│       ├── imageOptimization.jsxinc  # Image processing
│       └── utilities.jsxinc          # Utility functions
├── com.adobe.bridgephotogallery.mxi  # Extension manifest
└── icon.png                          # Extension icon
```

## Certificate Management

### Setting Certificate Password

**Option 1: Environment Variable (Recommended)**
```bash
export ZXP_CERT_PASSWORD=your_password
npm run build
```

**Option 2: Inline (Less Secure)**
```bash
ZXP_CERT_PASSWORD=your_password npm run build
```

**Option 3: Manual Signing**
```bash
npm run prepare
./certificate/ZXPSignCmd -sign ./zxp-temp ./output.zxp ./certificate/cert.p12 "your_password"
```

### Creating a Self-Signed Certificate (Development)

If you need to create a self-signed certificate for development:

```bash
./certificate/ZXPSignCmd -selfSignedCert US California "Your Organization" "Your Name" your_password ./certificate/cert.p12
```

## Build Output

- **Production build:** `com.adobe.bridgephotogallery.zxp`
- **Development build:** `com.adobe.bridgephotogallery-dev-YYYY-MM-DD.zxp`

## Troubleshooting

### "Command failed" Error
- **Cause:** Missing certificate password
- **Solution:** Set `ZXP_CERT_PASSWORD` environment variable

### "Required file not found: certificate/cert.p12"
- **Cause:** Missing certificate file
- **Solution:** Place your P12 certificate at `certificate/cert.p12`

### "ZXPSignCmd not executable"
- **Cause:** Missing execute permissions
- **Solution:** The script automatically fixes this, but you can manually run:
  ```bash
  chmod +x certificate/ZXPSignCmd
  ```

### "No such file or directory" during copy
- **Cause:** Missing source files
- **Solution:** Ensure all required files exist in the project root

## Security Notes

1. **Never commit certificate passwords** to version control
2. **Keep P12 certificates secure** - they're excluded from git by default
3. **Use environment variables** for sensitive data
4. **Consider using different certificates** for development vs production

## Manual Build Process

If you prefer to build manually without the Node.js script:

1. **Create directory structure:**
   ```bash
   mkdir -p zxp-temp/META-INF
   ```

2. **Copy files:**
   ```bash
   cp -r Startup_Script zxp-temp/
   cp com.adobe.bridgephotogallery.mxi zxp-temp/
   cp icon.png zxp-temp/
   ```

3. **Sign ZXP:**
   ```bash
   ./certificate/ZXPSignCmd -sign ./zxp-temp ./output.zxp ./certificate/cert.p12 "your_password"
   ```

## Advanced Options

### Adding Timestamp Server
For production builds, you may want to add timestamping:

```bash
./certificate/ZXPSignCmd -sign ./zxp-temp ./output.zxp ./certificate/cert.p12 "password" -tsa https://timestamp.geotrust.com/tsa
```

### Verifying ZXP
To verify a signed ZXP:

```bash
./certificate/ZXPSignCmd -verify ./output.zxp -certInfo
```

## Development Workflow

1. **Make changes** to source files
2. **Test locally** by copying to Bridge extensions folder
3. **Run** `npm run prepare` to validate file copying
4. **Build ZXP** with `npm run build:dev` for testing
5. **Build production ZXP** with `npm run build` for distribution
