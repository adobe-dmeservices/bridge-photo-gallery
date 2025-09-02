#!/usr/bin/env node

/**
 * ZXP Build Script for Bridge Photo Gallery Extension
 * 
 * This script automates the process of creating a ZXP package for the Adobe Bridge extension.
 * It copies the required files to the zxp-temp directory and uses ZXPSignCmd to create the signed ZXP.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Load environment variables from .env file if it exists
try {
    require('dotenv').config();
} catch (error) {
    // dotenv is optional - continue without it if not available
}

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const packageVersion = packageJson.version;

// Configuration
const config = {
    projectRoot: __dirname,
    zxpTempDir: path.join(__dirname, 'zxp-temp'),
    outputDir: path.join(__dirname, 'release'),
    certificatePath: path.join(__dirname, 'certificate', 'cert.p12'),
    zxpSignCmd: path.join(__dirname, 'certificate', 'ZXPSignCmd'),
    extensionName: 'com.adobe.bridgephotogallery',
    version: packageVersion,
    // Certificate password - can be set via environment variable for security
    certificatePassword: process.env.ZXP_CERT_PASSWORD || ''
};

// Files and directories to copy to ZXP
const filesToCopy = [
    {
        source: 'Startup_Script',
        dest: 'Startup_Script',
        type: 'directory'
    },
    {
        source: 'com.adobe.bridgePhotoGallery.mxi',
        dest: 'com.adobe.bridgePhotoGallery.mxi',
        type: 'file'
    },
    {
        source: 'icon.png',
        dest: 'icon.png',
        type: 'file'
    }
];

// Command line arguments
const args = process.argv.slice(2);
const isCleanOnly = args.includes('--clean');
const isDev = args.includes('--dev');
const isPrepareOnly = args.includes('--prepare-only');

/**
 * Clean the zxp-temp directory
 */
function cleanZxpTemp() {
    console.log('🧹 Cleaning zxp-temp directory...');
    try {
        if (fs.existsSync(config.zxpTempDir)) {
            fs.removeSync(config.zxpTempDir);
            console.log('✅ zxp-temp directory cleaned');
        } else {
            console.log('ℹ️  zxp-temp directory does not exist');
        }
    } catch (error) {
        console.error('❌ Error cleaning zxp-temp directory:', error.message);
        process.exit(1);
    }
}

/**
 * Create the release directory
 */
function createReleaseDirectory() {
    console.log('📁 Creating release directory...');
    try {
        fs.ensureDirSync(config.outputDir);
        console.log('✅ Release directory ready');
    } catch (error) {
        console.error('❌ Error creating release directory:', error.message);
        process.exit(1);
    }
}

/**
 * Create the zxp-temp directory structure
 */
function createZxpTempStructure() {
    console.log('📁 Creating zxp-temp directory structure...');
    try {
        // Create main directories
        fs.ensureDirSync(config.zxpTempDir);
        fs.ensureDirSync(path.join(config.zxpTempDir, 'META-INF'));
        
        console.log('✅ Directory structure created');
    } catch (error) {
        console.error('❌ Error creating directory structure:', error.message);
        process.exit(1);
    }
}

/**
 * Update version in .mxi file
 */
function updateMxiVersion() {
    console.log('🔄 Updating .mxi file version...');
    
    try {
        const mxiPath = path.join(config.projectRoot, 'com.adobe.bridgePhotoGallery.mxi');
        const tempMxiPath = path.join(config.zxpTempDir, 'com.adobe.bridgePhotoGallery.mxi');
        
        // Read the original .mxi file
        let mxiContent = fs.readFileSync(mxiPath, 'utf8');
        
        // Replace the version attribute in the macromedia-extension element
        mxiContent = mxiContent.replace(
            /<macromedia-extension([^>]*)\sversion="[^"]*"/,
            `<macromedia-extension$1 version="${config.version}"`
        );
        
        // Write the updated content to the temp directory
        fs.writeFileSync(tempMxiPath, mxiContent, 'utf8');
        
        console.log(`✅ Updated .mxi version to ${config.version}`);
    } catch (error) {
        console.error('❌ Error updating .mxi version:', error.message);
        process.exit(1);
    }
}

/**
 * Update version placeholders in JavaScript files
 */
function updateJavaScriptVersions() {
    console.log('🔄 Updating JavaScript file versions...');
    
    try {
        const htmlGeneratorPath = path.join(config.zxpTempDir, 'Startup_Script', 'lib_photoGalleryGenerator', 'htmlGenerator.jsxinc');
        
        if (fs.existsSync(htmlGeneratorPath)) {
            // Read the file
            let content = fs.readFileSync(htmlGeneratorPath, 'utf8');
            
            // Replace version placeholder
            content = content.replace(/{{VERSION}}/g, config.version);
            
            // Write the updated content back
            fs.writeFileSync(htmlGeneratorPath, content, 'utf8');
            
            console.log(`✅ Updated version placeholders to ${config.version} in htmlGenerator.jsxinc`);
        } else {
            console.log('⚠️  htmlGenerator.jsxinc not found, skipping version update');
        }
    } catch (error) {
        console.error('❌ Error updating JavaScript versions:', error.message);
        process.exit(1);
    }
}

/**
 * Copy files to zxp-temp directory
 */
function copyFiles() {
    console.log('📄 Copying files to zxp-temp...');
    
    try {
        filesToCopy.forEach(item => {
            const sourcePath = path.join(config.projectRoot, item.source);
            const destPath = path.join(config.zxpTempDir, item.dest);
            
            // Skip .mxi file - we'll handle it separately with version updating
            if (item.source === 'com.adobe.bridgePhotoGallery.mxi') {
                console.log(`  ⏭️  Skipping ${item.source} (will be processed separately with version update)`);
                return;
            }
            
            if (!fs.existsSync(sourcePath)) {
                throw new Error(`Source file/directory not found: ${sourcePath}`);
            }
            
            if (item.type === 'directory') {
                console.log(`  📁 Copying directory: ${item.source} -> ${item.dest}`);
                fs.copySync(sourcePath, destPath, {
                    overwrite: true,
                    filter: (src) => {
                        // Exclude hidden files and temp files
                        const basename = path.basename(src);
                        return !basename.startsWith('.') && !basename.endsWith('.tmp');
                    }
                });
            } else {
                console.log(`  📄 Copying file: ${item.source} -> ${item.dest}`);
                fs.copySync(sourcePath, destPath, { overwrite: true });
            }
        });
        
        console.log('✅ All files copied successfully');
    } catch (error) {
        console.error('❌ Error copying files:', error.message);
        process.exit(1);
    }
}

/**
 * Validate required files exist
 */
function validateRequiredFiles() {
    console.log('🔍 Validating required files...');
    
    const requiredFiles = [
        config.certificatePath,
        config.zxpSignCmd
    ];
    
    for (const filePath of requiredFiles) {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Required file not found: ${filePath}`);
            process.exit(1);
        }
    }
    
    // Check if ZXPSignCmd is executable
    try {
        fs.accessSync(config.zxpSignCmd, fs.constants.F_OK | fs.constants.X_OK);
    } catch (error) {
        console.log('⚠️  Making ZXPSignCmd executable...');
        try {
            fs.chmodSync(config.zxpSignCmd, '755');
        } catch (chmodError) {
            console.error('❌ Failed to make ZXPSignCmd executable:', chmodError.message);
            process.exit(1);
        }
    }
    
    console.log('✅ All required files validated');
}

/**
 * Create the ZXP package using ZXPSignCmd
 */
function createZxp() {
    console.log('📦 Creating ZXP package...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const zxpFileName = isDev 
        ? `${config.extensionName}-${config.version}-dev-${timestamp}.zxp`
        : `${config.extensionName}-${config.version}.zxp`;
    const zxpOutputPath = path.join(config.outputDir, zxpFileName);
    
    try {
        // Remove existing ZXP if it exists
        if (fs.existsSync(zxpOutputPath)) {
            fs.removeSync(zxpOutputPath);
            console.log(`🗑️  Removed existing ZXP: ${zxpFileName}`);
        }
        
        // Check if we have a certificate password
        if (!config.certificatePassword) {
            console.log('⚠️  No certificate password provided.');
            console.log('   You can set it via environment variable: ZXP_CERT_PASSWORD=your_password npm run build');
            console.log('   Or you can run the command manually:');
            console.log(`   "${config.zxpSignCmd}" -sign "${config.zxpTempDir}" "${zxpOutputPath}" "${config.certificatePath}" "YOUR_PASSWORD"`);
            return;
        }
        
        // Build the ZXPSignCmd command
        const command = `"${config.zxpSignCmd}" -sign "${config.zxpTempDir}" "${zxpOutputPath}" "${config.certificatePath}" "${config.certificatePassword}" "-tsa" "http://timestamp.digicert.com"`;
        
        console.log('🔧 Running ZXPSignCmd...');
        console.log(`   Command: ${command}`);
        
        // Execute the command
        const output = execSync(command, { 
            encoding: 'utf8',
            cwd: config.projectRoot 
        });
        
        console.log('📋 ZXPSignCmd Output:');
        console.log(output);
        
        // Verify the ZXP was created
        if (fs.existsSync(zxpOutputPath)) {
            const stats = fs.statSync(zxpOutputPath);
            console.log(`✅ ZXP package created successfully!`);
            console.log(`   📁 Location: ${zxpOutputPath}`);
            console.log(`   📏 Size: ${(stats.size / 1024).toFixed(2)} KB`);
        } else {
            throw new Error('ZXP file was not created');
        }
        
    } catch (error) {
        console.error('❌ Error creating ZXP package:', error.message);
        if (error.stdout) console.log('📋 Command output:', error.stdout);
        if (error.stderr) console.error('📋 Command error:', error.stderr);
        process.exit(1);
    }
}

/**
 * Main build process
 */
function main() {
    console.log('🚀 Bridge Photo Gallery ZXP Builder');
    console.log('=====================================');
    
    const startTime = Date.now();
    
    try {
        // Clean only mode
        if (isCleanOnly) {
            cleanZxpTemp();
            console.log('✅ Clean completed');
            return;
        }
        
        // Prepare only mode
        if (isPrepareOnly) {
            console.log('🎯 Preparing files for ZXP (without signing)...');
            
            // Step 1: Clean
            cleanZxpTemp();
            
            // Step 2: Create directories
            createReleaseDirectory();
            createZxpTempStructure();
            
            // Step 3: Copy files
            copyFiles();
            
            // Step 4: Update .mxi file version
            updateMxiVersion();
            
            // Step 5: Update JavaScript file versions
            updateJavaScriptVersions();
            
            console.log('✅ Files prepared in zxp-temp directory');
            console.log('💡 To create the ZXP manually, run:');
            console.log(`   "${config.zxpSignCmd}" -sign "${config.zxpTempDir}" "output.zxp" "${config.certificatePath}" "YOUR_PASSWORD"`);
            return;
        }
        
        // Full build process
        console.log(`🎯 Building ${isDev ? 'development' : 'production'} ZXP...`);
        
        // Step 1: Clean
        cleanZxpTemp();
        
        // Step 2: Validate required files
        validateRequiredFiles();
        
        // Step 3: Create directories
        createReleaseDirectory();
        createZxpTempStructure();
        
        // Step 4: Copy files
        copyFiles();
        
        // Step 5: Update .mxi file version
        updateMxiVersion();
        
        // Step 6: Update JavaScript file versions
        updateJavaScriptVersions();
        
        // Step 7: Create ZXP
        createZxp();
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`🎉 Build completed successfully in ${duration}s`);
        
    } catch (error) {
        console.error('💥 Build failed:', error.message);
        process.exit(1);
    }
}

// Handle process interruption
process.on('SIGINT', () => {
    console.log('\n⚠️  Build interrupted by user');
    process.exit(1);
});

// Run the main function
main();
