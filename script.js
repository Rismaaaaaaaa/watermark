const mainImageLoader = document.getElementById('mainImageLoader');
const watermarkImageLoader = document.getElementById('watermarkImageLoader');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const imageCanvas = document.getElementById('imageCanvas');
const ctx = imageCanvas.getContext('2d');
let mainImage = new Image();
let watermarkImage = new Image();

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;

mainImageLoader.addEventListener('change', handleMainImage, false);
watermarkImageLoader.addEventListener('change', handleWatermarkImage, false);
downloadBtn.addEventListener('click', downloadImage);
resetBtn.addEventListener('click', resetCanvas);

function handleMainImage(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        mainImage.onload = function() {
            const [newWidth, newHeight] = resizeImage(mainImage, MAX_WIDTH, MAX_HEIGHT);
            imageCanvas.width = newWidth;
            imageCanvas.height = newHeight;
            ctx.drawImage(mainImage, 0, 0, newWidth, newHeight);
        }
        mainImage.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function handleWatermarkImage(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        watermarkImage.onload = function() {
            const [newWidth, newHeight] = resizeImage(mainImage, MAX_WIDTH, MAX_HEIGHT);
            imageCanvas.width = newWidth;
            imageCanvas.height = newHeight;
            ctx.drawImage(mainImage, 0, 0, newWidth, newHeight);
            const watermarkWidth = newWidth; // ukuran watermark sebesar gambar utama
            const watermarkHeight = newHeight; // ukuran watermark sebesar gambar utama
            const xPosition = (newWidth - watermarkWidth) / 2; // posisi X di tengah
            const yPosition = (newHeight - watermarkHeight) / 2; // posisi Y di tengah
            ctx.globalAlpha = 0.01; // setting transparency
            ctx.drawImage(watermarkImage, xPosition, yPosition, watermarkWidth, watermarkHeight);
            ctx.globalAlpha = 0.01; // reset transparency
        }
        watermarkImage.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function resizeImage(image, maxWidth, maxHeight) {
    let width = image.width;
    let height = image.height;

    if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
    }

    if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
    }

    return [width, height];
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'watermarked_image.png';
    link.href = imageCanvas.toDataURL();
    link.click();
}

function resetCanvas() {
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    mainImage = new Image();
    watermarkImage = new Image();
    mainImageLoader.value = null;
    watermarkImageLoader.value = null;
}