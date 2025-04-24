// Initialize canvas and context
const nftCanvas = document.getElementById('nftCanvas');
const ctx = nftCanvas.getContext('2d');
ctx.globalCompositeOperation = 'difference';

// Set up color picker to change canvas background
const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', (event) => {
    nftCanvas.style.backgroundColor = event.target.value;
});

// Enable drawing on canvas
let drawing = false;

nftCanvas.addEventListener('mousedown', () => {
    drawing = true;
});

nftCanvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

nftCanvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!drawing) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';

    ctx.lineTo(event.clientX - nftCanvas.offsetLeft, event.clientY - nftCanvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - nftCanvas.offsetLeft, event.clientY - nftCanvas.offsetTop);
}