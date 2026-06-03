// Enhanced JavaScript for Cloth Classifier

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    const predictButton = document.getElementById('predict-button');
    const form = document.getElementById('upload-form');
    const loading = document.getElementById('loading');
    const confidenceFill = document.querySelector('.confidence-fill');
    const confidenceValue = document.querySelector('.confidence-value');

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Show file name
            fileName.textContent = `Selected: ${file.name}`;
            fileName.style.display = 'block';
            
            // Show predict button
            predictButton.style.display = 'inline-block';
            
            // Preview image
            previewImage(file);
        } else {
            fileName.style.display = 'none';
            predictButton.style.display = 'none';
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        if (fileInput.files.length === 0) {
            e.preventDefault();
            alert('Please select an image file first!');
            return;
        }
        
        // Show loading animation
        loading.style.display = 'block';
        predictButton.disabled = true;
        predictButton.textContent = 'Processing...';
    });

    // Preview selected image
    function previewImage(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Create or update preview image
            let preview = document.getElementById('image-preview');
            if (!preview) {
                preview = document.createElement('img');
                preview.id = 'image-preview';
                preview.className = 'uploaded-image';
                preview.style.marginTop = '20px';
                preview.style.maxHeight = '200px';
                document.querySelector('.upload-section').appendChild(preview);
            }
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // Animate confidence bar if result exists
    if (confidenceFill && confidenceValue) {
        const confidence = parseFloat(confidenceValue.textContent);
        setTimeout(() => {
            confidenceFill.style.width = confidence + '%';
        }, 500);
    }

    // Add drag and drop functionality
    const container = document.querySelector('.container');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        container.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        container.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        container.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        container.style.background = 'rgba(102, 126, 234, 0.1)';
        container.style.borderColor = '#667eea';
    }

    function unhighlight(e) {
        container.style.background = 'rgba(255, 255, 255, 0.95)';
        container.style.borderColor = 'transparent';
    }

    container.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                fileInput.files = files;
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            } else {
                alert('Please drop an image file!');
            }
        }
    }

    // Add smooth scrolling to results
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const resultSection = document.querySelector('.result-section');
                if (resultSection) {
                    resultSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target === fileInput) {
            e.target.click();
        }
    });

    // Add accessibility improvements
    fileInput.setAttribute('aria-label', 'Choose image file for classification');
    predictButton.setAttribute('aria-label', 'Submit image for prediction');
    
    // Add focus indicators
    fileInput.addEventListener('focus', function() {
        document.querySelector('.file-input-button').style.outline = '2px solid #667eea';
    });
    
    fileInput.addEventListener('blur', function() {
        document.querySelector('.file-input-button').style.outline = 'none';
    });
});

// Utility function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add error handling for image loading
function handleImageError(img) {
    img.style.display = 'none';
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = 'Error loading image. Please try again.';
    errorMsg.style.color = '#dc3545';
    errorMsg.style.padding = '10px';
    errorMsg.style.marginTop = '10px';
    img.parentNode.insertBefore(errorMsg, img.nextSibling);
}
