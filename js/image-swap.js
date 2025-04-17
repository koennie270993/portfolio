// Dynamically swap image sources to optimized versions
document.addEventListener('DOMContentLoaded', function() {
  // Mapping of original image paths to optimized versions
  const imageMap = {
  "img/battleship/01.jpg": "img/battleship/01-optimized.jpg",
  "img/battleship/02.jpg": "img/battleship/02-optimized.jpg",
  "img/battleship/03.jpg": "img/battleship/03-optimized.jpg",
  "img/battleship/04.jpg": "img/battleship/04-optimized.jpg",
  "img/battleship/05.jpg": "img/battleship/05-optimized.jpg",
  "img/battleship/06.jpg": "img/battleship/06-optimized.jpg",
  "img/battleship/07.jpg": "img/battleship/07-optimized.jpg",
  "img/battleship/08.jpg": "img/battleship/08-optimized.jpg",
  "img/battleship/09.jpg": "img/battleship/09-optimized.jpg",
  "img/battleship/s_horizontal_768x432.jpg": "img/battleship/s_horizontal_768x432-optimized.jpg",
  "img/battleship/s_icon_512.png": "img/battleship/s_icon_512-optimized.png",
  "img/battleship/s_square_768.jpg": "img/battleship/s_square_768-optimized.jpg",
  "img/battleship/s_vertical_432x768.jpg": "img/battleship/s_vertical_432x768-optimized.jpg",
  "img/fmv/fmv.jpg": "img/fmv/fmv-optimized.jpg",
  "img/fmv/fmv-preview.jpg": "img/fmv/fmv-preview-optimized.jpg",
  "img/fove/fove.png": "img/fove/fove-optimized.png",
  "img/pinata/pinata.png": "img/pinata/pinata-optimized.png",
  "img/portfolio/cabin.png": "img/portfolio/cabin-optimized.png",
  "img/profile.jpeg": "img/profile-optimized.jpeg",
  "img/storm-skaters/Horizontal-Background.jpg": "img/storm-skaters/Horizontal-Background-optimized.jpg",
  "img/storm-skaters/Square-Background.jpg": "img/storm-skaters/Square-Background-optimized.jpg",
  "img/storm-skaters/stormskater1s.jpg": "img/storm-skaters/stormskater1s-optimized.jpg",
  "img/storm-skaters/title_overlay_628x240.png": "img/storm-skaters/title_overlay_628x240-optimized.png",
  "img/storm-skaters/Vertical-Background.jpg": "img/storm-skaters/Vertical-Background-optimized.jpg",
  "img/trinity/trinity.png": "img/trinity/trinity-optimized.png",
  "img/vr-csi/vr-csi.png": "img/vr-csi/vr-csi-optimized.png"
};
  
  // Find all images on the page
  const images = document.querySelectorAll('img');
  
  // Loop through images and replace src attributes if optimized version exists
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && imageMap[src]) {
      img.setAttribute('src', imageMap[src]);
      console.log('Swapped image:', src, '->', imageMap[src]);
    }
  });
});
