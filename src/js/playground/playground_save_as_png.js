// Function to convert SVG to PNG and trigger download
document.getElementById('save_as_png').addEventListener('click', function() {
    // Get the SVG element
    const svg = document.querySelector('.plaground_SVG');
    const svgData = new XMLSerializer().serializeToString(svg);
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Create an image element for the background
    const svgImage = new Image();
    svgImage.src = 'data:image/svg+xml;base64,' + btoa(svgData);

    svgImage.onload = function() {
        // Draw the SVG on canvas
        ctx.drawImage(svgImage, 0, 0);

        // Convert canvas to PNG and trigger download
        const pngData = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'web3stick.png';
        downloadLink.href = pngData;
        downloadLink.click();
    };
}));