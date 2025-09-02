#!/usr/bin/env node

/**
 * Certificate Generation Script for Bridge Photo Gallery Extension
 * 
 * This script generates a self-signed certificate for signing ZXP packages.
 * It uses ZXPSignCmd to create a .p12 certificate file and sets up the environment.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Configuration
const config = {
    projectRoot: __dirname,
    certificateDir: path.join(__dirname, 'certificate'),
    zxpSignCmd: path.join(__dirname, 'certificate', 'ZXPSignCmd'),
    certificatePath: path.join(__dirname, 'certificate', 'cert.p12'),
    
    // Certificate details
    countryCode: 'US',
    stateOrProvince: 'California',
    locality: 'San Francisco',
    organization: 'Adobe Digital Media Services',
    organizationalUnit: 'Extensions',
    commonName: 'Bridge Photo Gallery Extension',
    email: 'developer@adobe.com',
    validityDays: 3650, // 10 years
    
    // Generate a random password
    password: crypto.randomBytes(16).toString('hex')
};

// Command line arguments
const args = process.argv.slice(2);
const forceRegenerate = args.includes('--force');

/**
 * Check if certificate already exists
 */
function certificateExists() {
    return fs.existsSync(config.certificatePath);
}

/**
 * Validate ZXPSignCmd exists and is executable
 */
function validateZxpSignCmd() {
    console.log('🔍 Validating ZXPSignCmd...');
    
    if (!fs.existsSync(config.zxpSignCmd)) {
        console.error('❌ ZXPSignCmd not found at:', config.zxpSignCmd);
        console.error('   Please ensure ZXPSignCmd is available in the certificate directory');
        process.exit(1);
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
    
    console.log('✅ ZXPSignCmd validated');
}

/**
 * Generate self-signed certificate
 */
function generateCertificate() {
    console.log('🔐 Generating self-signed certificate...');
    
    try {
        // Ensure certificate directory exists
        fs.ensureDirSync(config.certificateDir);
        
        // Build the ZXPSignCmd command for certificate generation
        const command = `"${config.zxpSignCmd}" -selfSignedCert "${config.countryCode}" "${config.stateOrProvince}" "${config.organization}" "${config.commonName}" "${config.password}" "${config.certificatePath}" -locality "${config.locality}" -orgUnit "${config.organizationalUnit}" -email "${config.email}" -validityDays ${config.validityDays}`;
        
        console.log('🔧 Running ZXPSignCmd to generate certificate...');
        console.log(`   Command: ${command}`);
        
        // Execute the command
        const output = execSync(command, { 
            encoding: 'utf8',
            cwd: config.projectRoot 
        });
        
        console.log('📋 ZXPSignCmd Output:');
        console.log(output);
        
        // Verify the certificate was created
        if (fs.existsSync(config.certificatePath)) {
            const stats = fs.statSync(config.certificatePath);
            console.log(`✅ Certificate generated successfully!`);
            console.log(`   📁 Location: ${config.certificatePath}`);
            console.log(`   📏 Size: ${(stats.size / 1024).toFixed(2)} KB`);
        } else {
            throw new Error('Certificate file was not created');
        }
        
    } catch (error) {
        console.error('❌ Error generating certificate:', error.message);
        if (error.stdout) console.log('📋 Command output:', error.stdout);
        if (error.stderr) console.error('📋 Command error:', error.stderr);
        process.exit(1);
    }
}

/**
 * Save certificate password to environment file
 */
function savePasswordToEnv() {
    console.log('💾 Setting up environment configuration...');
    
    try {
        const envFilePath = path.join(config.projectRoot, '.env');
        let envContent = '';
        
        // Read existing .env file if it exists
        if (fs.existsSync(envFilePath)) {
            envContent = fs.readFileSync(envFilePath, 'utf8');
        }
        
        // Remove existing ZXP_CERT_PASSWORD line if present
        envContent = envContent.replace(/^ZXP_CERT_PASSWORD=.*$/m, '').trim();
        
        // Add the new password
        if (envContent) {
            envContent += '\n';
        }
        envContent += `ZXP_CERT_PASSWORD=${config.password}\n`;
        
        // Write the updated .env file
        fs.writeFileSync(envFilePath, envContent, 'utf8');
        
        console.log(`✅ Password saved to .env file`);
        console.log(`   🔑 Password: ${config.password}`);
        console.log(`   📄 To use: export ZXP_CERT_PASSWORD="${config.password}"`);
        console.log(`   💡 Or source the .env file in your shell`);
        
    } catch (error) {
        console.error('❌ Error saving password to .env:', error.message);
        console.log(`🔑 Manual setup required - use password: ${config.password}`);
        console.log(`   Set environment variable: export ZXP_CERT_PASSWORD="${config.password}"`);
    }
}

/**
 * Add .env to .gitignore if not already present
 */
function updateGitignore() {
    console.log('🔒 Updating .gitignore...');
    
    try {
        const gitignorePath = path.join(config.projectRoot, '.gitignore');
        let gitignoreContent = '';
        
        // Read existing .gitignore if it exists
        if (fs.existsSync(gitignorePath)) {
            gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        }
        
        // Check if .env is already in .gitignore
        if (!gitignoreContent.includes('.env')) {
            if (gitignoreContent && !gitignoreContent.endsWith('\n')) {
                gitignoreContent += '\n';
            }
            gitignoreContent += '# Environment files\n.env\n';
            
            fs.writeFileSync(gitignorePath, gitignoreContent, 'utf8');
            console.log('✅ Added .env to .gitignore');
        } else {
            console.log('ℹ️  .env already in .gitignore');
        }
        
    } catch (error) {
        console.error('⚠️  Warning: Could not update .gitignore:', error.message);
        console.log('   Please manually add .env to your .gitignore file');
    }
}

/**
 * Display usage instructions
 */
function displayInstructions() {
    console.log('\n🎉 Certificate setup complete!');
    console.log('=====================================');
    console.log('');
    console.log('📋 Next steps:');
    console.log('');
    console.log('1. 🔐 Set the environment variable in your shell:');
    console.log(`   export ZXP_CERT_PASSWORD="${config.password}"`);
    console.log('');
    console.log('2. 🚀 Or source the .env file:');
    console.log('   source .env');
    console.log('');
    console.log('3. 📦 Build your ZXP package:');
    console.log('   npm run build');
    console.log('');
    console.log('💡 The certificate is valid for 10 years and will be used automatically');
    console.log('   by the build script when the ZXP_CERT_PASSWORD environment variable is set.');
    console.log('');
}

/**
 * Main function
 */
function main() {
    console.log('🔐 Bridge Photo Gallery Certificate Generator');
    console.log('===============================================');
    
    const startTime = Date.now();
    
    try {
        // Check if certificate already exists
        if (certificateExists() && !forceRegenerate) {
            console.log('ℹ️  Certificate already exists at:', config.certificatePath);
            console.log('   Use --force to regenerate the certificate');
            console.log('');
            console.log('💡 If you need the password, check your .env file or regenerate with:');
            console.log('   npm run generate-cert -- --force');
            return;
        }
        
        if (forceRegenerate && certificateExists()) {
            console.log('🗑️  Removing existing certificate...');
            fs.removeSync(config.certificatePath);
        }
        
        // Step 1: Validate ZXPSignCmd
        validateZxpSignCmd();
        
        // Step 2: Generate certificate
        generateCertificate();
        
        // Step 3: Save password to .env
        savePasswordToEnv();
        
        // Step 4: Update .gitignore
        updateGitignore();
        
        // Step 5: Display instructions
        displayInstructions();
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`⏱️  Completed in ${duration}s`);
        
    } catch (error) {
        console.error('💥 Certificate generation failed:', error.message);
        process.exit(1);
    }
}

// Handle process interruption
process.on('SIGINT', () => {
    console.log('\n⚠️  Certificate generation interrupted by user');
    process.exit(1);
});

// Run the main function
main();
