// Get the color picker and SVG rect element
document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.getElementById('color_picker');
    const svgRect = document.querySelector('.plaground_SVG rect');

    // Add event listener for color changes
    colorPicker.addEventListener('input', function(e) {
        // Update the SVG rectangle fill color
        svgRect.setAttribute('fill', e.target.value);
    });

    colorPicker.addEventListener('change', function(e) {
        // Final color selection
        svgRect.setAttribute('fill', e.target.value);
    });
});