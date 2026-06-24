const qrText = document.getElementById('qr-text');
const sizes = document.getElementById('sizes');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrContainer = document.querySelector('.qr-body');

let size = sizes.value;
generateBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    isEmptyInput();
});

sizes.addEventListener('change',(e)=>{
    size = e.target.value;
    isEmptyInput();
});

downloadBtn.addEventListener('click', ()=>{
    let img = document.querySelector('.qr-body img');

    if(img !== null){
        let imgAtrr = img.getAttribute('src');
        downloadBtn.setAttribute("href", imgAtrr);
    }
    else{
        downloadBtn.setAttribute("href", `${document.querySelector('canvas').toDataURL()}`);
    }
});

function isEmptyInput(){
    // if(qrText.value.length > 0){
    //     generateQRCode();
    // }
    // else{
    //     alert("Enter the text or URL to generate your QR code");
    // }
    qrText.value.length > 0 ? generateQRCode() : alert("Enter the text or URL to generate your QR code");;
}
function generateQRCode(){
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text:qrText.value,
        height:size,
        width:size,
        colorLight:"#fff",
        colorDark:"#000",
    });
}

/* ── Rotating background ── */
const BG_IMAGES = ['bg-1.jfif', 'bg-2.jfif', 'bg-3.webp'];
let bgIndex = 0;
let activeBg = 1;

const bgLayer1 = document.getElementById('bgLayer1');
const bgLayer2 = document.getElementById('bgLayer2');

bgLayer1.style.backgroundImage = `url('${BG_IMAGES[0]}')`;
bgLayer1.style.opacity = '1';
bgLayer2.style.opacity = '0';

function rotateBg() {
    bgIndex = (bgIndex + 1) % BG_IMAGES.length;
    const incoming = activeBg === 1 ? bgLayer2 : bgLayer1;
    const outgoing  = activeBg === 1 ? bgLayer1 : bgLayer2;

    incoming.style.backgroundImage = `url('${BG_IMAGES[bgIndex]}')`;
    incoming.style.opacity = '1';
    outgoing.style.opacity = '0';

    activeBg = activeBg === 1 ? 2 : 1;
}

setInterval(rotateBg, 8000); // change 8000 to however many milliseconds you want
