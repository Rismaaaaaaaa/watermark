const watermarkedImageLoader = document.getElementById('watermarkedImageLoader');
const extractBtn = document.getElementById('extractBtn');
const resetBtn = document.getElementById('resetBtn');
const resultContainer = document.getElementById('resultContainer');
let watermarkedImage = new Image();

watermarkedImageLoader.addEventListener('change', handleWatermarkedImage, false);
extractBtn.addEventListener('click', extractWatermark);
resetBtn.addEventListener('click', resetCanvas);

function handleWatermarkedImage(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        watermarkedImage.onload = function() {
            // Gambar berhasil dimuat
        }
        watermarkedImage.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function extractWatermark() {
    const imageCanvas = document.createElement('canvas');
    const ctx = imageCanvas.getContext('2d');
    imageCanvas.width = watermarkedImage.width;
    imageCanvas.height = watermarkedImage.height;
    ctx.drawImage(watermarkedImage, 0, 0);

    const imgData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const data = imgData.data;

    const originalData = ctx.createImageData(imageCanvas.width, imageCanvas.height);
    const watermarkData = ctx.createImageData(imageCanvas.width, imageCanvas.height);

    const originalPixels = originalData.data;
    const watermarkPixels = watermarkData.data;

    for (let i = 0; i < data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            const lsb = data[i + j] & 1;
            originalPixels[i + j] = data[i + j] & 254; // Menghapus LSB untuk gambar asli
            watermarkPixels[i + j] = lsb === 1 ? 255 : 0; // Membuat gambar watermark dari LSB
        }
        originalPixels[i + 3] = 255; // Set alpha menjadi sepenuhnya tidak transparan
        watermarkPixels[i + 3] = 255; // Set alpha menjadi sepenuhnya tidak transparan
    }

    displayResult(originalData, 'Gambar Asli', 'originalCanvas');
    displayResult(watermarkData, 'Watermark', 'watermarkCanvas');
}

function displayResult(imageData, title, canvasId) {
    const container = document.createElement('div');
    container.classList.add('canvas-container');

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;

    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = `Unduh ${title}`;
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `${title.replace(' ', '_').toLowerCase()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });

    container.appendChild(titleElement);
    container.appendChild(canvas);
    container.appendChild(downloadBtn);
    resultContainer.appendChild(container);
}

function resetCanvas() {
    resultContainer.innerHTML = '';
    watermarkedImage = new Image();
    watermarkedImageLoader.value = null;
}