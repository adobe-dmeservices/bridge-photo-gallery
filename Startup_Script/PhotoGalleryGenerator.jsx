/**
 * Photo Gallery Generator v{{VERSION}}
 * Adobe Bridge ExtendScript for generating HTML photo galleries
 *
 * @author Bridge Photo Gallery Generator
 * @version {{VERSION}}
 * @requires Adobe Bridge
 */

//@include "lib_photoGalleryGenerator/utilities.jsxinc"
//@include "lib_photoGalleryGenerator/dialogs.jsxinc"
//@include "lib_photoGalleryGenerator/htmlGenerator.jsxinc"
//@include "lib_photoGalleryGenerator/imageOptimization.jsxinc"

// Load the XMP Script library
if (xmpLib == undefined) {
    if (Folder.fs == "Windows") {
        var pathToLib = Folder.startup.fsName + "/AdobeXMPScript.dll";
    } else {
        var pathToLib = Folder.startup.fsName + "/AdobeXMPScript.framework";
    }

    var libfile = new File(pathToLib);
    var xmpLib = new ExternalObject("lib:" + pathToLib);
}

// Main script execution
if (typeof app !== 'undefined' && app.name === 'bridge') {
    initializePhotoGalleryGenerator();
} else {
    alert('This script requires Adobe Bridge to be running.');
}

function initializePhotoGalleryGenerator() {
    try {
        // Add menu item to Tools menu
        addGalleryMenuItem();

        // Show welcome message on first run
        if (!isInitialized()) {
            setInitialized();
            showWelcomeMessage();
        }

    } catch (error) {
        alert('Failed to initialize Photo Gallery Generator: ' + error.message);
    }
}

function addGalleryMenuItem() {
    // Check if menu item already exists
    if (MenuElement.find('Tools/Export Photo Gallery')) {
        return;
    }

    var toolsMenu = MenuElement.find('Tools');
    if (toolsMenu) {
        var menuItem = new MenuElement('command', 'Export Photo Gallery',
            'at the end of ' + toolsMenu.text, 'exportPhotoGallery');
        menuItem.onSelect = function() {
            runPhotoGalleryGenerator();
        };
    }
}

function runPhotoGalleryGenerator() {
    try {
        // Check if we have selected files
        var selectedFiles = getSelectedImageFiles();
        if (selectedFiles.length === 0) {
            alert('Please select one or more image files in Bridge before running this script.');
            return stringifyJSON({
                message: "No files selected"
            }); // User cancelled;
        }

        // Show configuration dialog
        var config = showGalleryConfigDialog();
        if (!config) {
            return stringifyJSON({
                message: "User canceled"
            }); // User cancelled
        }

        // Generate the gallery
        var result = generatePhotoGallery(selectedFiles, config);
        return stringifyJSON({message: result ? "Successfully completed Photo Gallery generation" : "Failed Photo Gallery generation"});

    } catch (error) {
        alert('Photo Gallery Generator failed: ' + error.message);
        return {
            errorMessage: error.message
        }
    }
}

function getSelectedImageFiles() {
    var selectedThumbs = [];
    var selectedFiles = [];

    try {
        if (app.document && app.document.selections) {
            selectedThumbs = app.document.selections;
        }

        // Convert thumbnails to files and validate
        for (var i = 0; i < selectedThumbs.length; i++) {
            var thumb = selectedThumbs[i];
            if (thumb && thumb.spec && thumb.spec instanceof File) {
                // Helper function to dump array items and qualifiers
                function dumpArrayItems(ns, prop) {
                    var items = myXmp.countArrayItems(ns, prop);
                    if (items > 0) {
                        $.writeln("\t" + prop + ": ");
                        for (var i = 1; i <= items; i++) {
                            arrItem = myXmp.getArrayItem(XMPConst.NS_DC, prop, i);
                            $.writeln("\t  [" + i + "] = " + arrItem);
                            if ((arrItem.options & XMPConst.PROP_HAS_QUALIFIERS) > 0) {
                                var propName = prop + "[" + i + "]";
                                var val = myXmp.getQualifier(XMPConst.NS_DC, propName, "http://www.w3.org/XML/1998/namespace", "lang");
                                $.writeln("\t    xml:lang = '" + val + "'");
                            }
                        }
                    } else {
                        $.writeln("\t" + prop + "\n\t  No data");
                    }

                    $.writeln();
                }
                var file = thumb.spec;
                // Create an XMPFile
                var myXmpFile = new XMPFile(file.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);

                // Get the XMP data
                var myXmp = myXmpFile.getXMP();
                file.description = myXmp.getArrayItem(XMPConst.NS_DC, "description", 1).value;
                file.rotation = thumb.rotation || 0;
                file.title = myXmp.getArrayItem(XMPConst.NS_DC, "title", 1).value;
                if (isValidImageFile(file)) {
                    selectedFiles.push(file);
                }
            }
        }

    } catch (error) {
        alert('Error accessing selected files: ' + error.message);
    }

    return selectedFiles;
}



function isValidImageFile(file) {
    if (!(file instanceof File) || !file.exists) {
        return false;
    }

    var validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.psd', '.pdf'];
    var fileName = file.name.toLowerCase();
    var extension = fileName.substr(fileName.lastIndexOf('.'));

    return arrayContains(validExtensions, extension);
}

function generatePhotoGallery(selectedFiles, config) {
    var progressDialog = null;
    try {
        // Show progress dialog
        progressDialog = showProgressDialog(selectedFiles.length);

        // Create output folder if it doesn't exist
        var outputFolder = new Folder(config.outputPath);
        if (!outputFolder.exists) {
            outputFolder.create();
        }

        // Create images subfolder
        var imagesFolder = new Folder(outputFolder + '/images');
        if (!imagesFolder.exists) {
            imagesFolder.create();
        }

        // Process images with optimization
        debugLog('Starting image processing for ' + selectedFiles.length + ' files');
        var processedImages = processImagesBatch(selectedFiles, imagesFolder, config,
            function(current, total, message) {
                progressDialog.updateProgress(current, message);
                debugLog('Progress: ' + current + '/' + total + ' - ' + message);
            });

        debugLog('Image processing completed. Processed ' + processedImages.length + ' images');

        // Generate HTML files
        progressDialog.updateProgress(selectedFiles.length, 'Generating HTML files...');
        debugLog('Starting HTML generation');
        generateGalleryHTML(outputFolder, processedImages, config);
        debugLog('HTML generation completed');

        // Verify files were created
        var indexFile = new File(outputFolder + '/index.html');
        var cssFile = new File(outputFolder + '/style.css');
        var jsFile = new File(outputFolder + '/script.js');
        var readmeFile = new File(outputFolder + '/README.txt');

        var filesCreated = [];
        if (indexFile.exists) filesCreated.push('index.html');
        if (cssFile.exists) filesCreated.push('style.css');
        if (jsFile.exists) filesCreated.push('script.js');
        if (readmeFile.exists) filesCreated.push('README.txt');

        debugLog('Files created: ' + filesCreated.join(', '));

        // Close progress dialog
        progressDialog.close();
        progressDialog = null;

        // Show completion message
        showCompletionMessage(outputFolder, processedImages.length, config);
        return true;

    } catch (error) {
        debugLog('Error in generatePhotoGallery: ' + error.message);
        if (progressDialog) {
            progressDialog.close();
        }
        alert('Gallery generation failed: ' + error.message + '\n\nCheck the ExtendScript Toolkit console for more details.');
        return false;
    }
}

function showWelcomeMessage() {
    alert('Photo Gallery Generator has been installed!\n\n' +
        'To use it:\n' +
        '1. Select image files in Bridge\n' +
        '2. Go to Tools > Export Photo Gallery\n' +
        '3. Configure your gallery settings\n' +
        '4. Choose an output folder\n' +
        '5. Generate your gallery!');
}

function isInitialized() {
    // Check if we've shown the welcome message before
    var settingsFile = new File(Folder.userData + '/BridgePhotoGallery.settings');
    return settingsFile.exists;
}

function setInitialized() {
    // Create a settings file to mark initialization
    var settingsFile = new File(Folder.userData + '/BridgePhotoGallery.settings');
    settingsFile.open('w');
    settingsFile.write('initialized=true');
    settingsFile.close();
}


// uncomment to run the script directly for testing
// runPhotoGalleryGenerator();