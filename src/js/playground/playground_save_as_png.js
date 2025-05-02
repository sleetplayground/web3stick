// Function to convert SVG to PNG and trigger download
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('save_as_png').addEventListener('click', function() {
        // Get the SVG element
        const svg = document.querySelector('.plaground_SVG');
        const svgData = new XMLSerializer().serializeToString(svg);
        
        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        // Create an image element for the SVG
        const svgImage = new Image();
        svgImage.src = 'data:image/svg+xml;base64,' + btoa(svgData);

        svgImage.onload = function() {
            // Set white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Calculate dimensions to maintain aspect ratio
            const scale = Math.min(canvas.width / svg.clientWidth, canvas.height / svg.clientHeight);
            const x = (canvas.width - svg.clientWidth * scale) / 2;
            const y = (canvas.height - svg.clientHeight * scale) / 2;
            
            // Draw the SVG on canvas
            ctx.drawImage(svgImage, x, y, svg.clientWidth * scale, svg.clientHeight * scale);

            // Ensure the image element is drawn
            const imageElement = svg.querySelector('image');
            if (imageElement) {
                const img = new Image();
                img.src = imageElement.getAttribute('href');
                img.onload = function() {
                    ctx.drawImage(img, x, y, svg.clientWidth * scale, svg.clientHeight * scale);

                    // Convert canvas to PNG and trigger download
                    const pngData = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.download = 'web3stick.png';
                    downloadLink.href = pngData;
                    downloadLink.click();
                };
            }
        };
    });
});