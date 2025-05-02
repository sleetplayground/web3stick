document.addEventListener('DOMContentLoaded', function() {
    const saveAsSvgButton = document.getElementById('save_as_svg');
    
    saveAsSvgButton.addEventListener('click', function() {
        // Get the SVG element
        const svgElement = document.querySelector('.plaground_SVG');
        
        // Create a clone of the SVG to avoid modifying the displayed one
        const svgClone = svgElement.cloneNode(true);
        
        // Get SVG string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgClone);
        
        // Create a Blob with the SVG content
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        
        // Create a temporary download link
        const downloadLink = document.createElement('a');
        downloadLink.download = 'web3stick.svg';
        downloadLink.href = URL.createObjectURL(blob);
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Clean up
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    });
});