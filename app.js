//Selectors
const fileInput = document.querySelector(".file-input");
const chooseImgBtn = document.querySelector(".choose-img");
const previewImg = document.querySelector(".preview-image img");
const filterOptions = document.querySelectorAll(".filter button");
const rotateOptions = document.querySelectorAll(".rotate button");
const filterInfoName = document.querySelector(".filter-info .name");
const filterSliderValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const resetFilterBtn = document.querySelector(".reset-filter");
const saveImageBtn = document.querySelector(".save-img");

let brightness = 100;
let saturation = 100;
let inversion = 0;
let grayscale = 0;
let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;

//Functions

function loadImage() {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", function () {
    resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disabled");
  });
}

filterOptions.forEach((option) => {
  option.addEventListener("click", function () {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterInfoName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterSliderValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterSliderValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterSliderValue.innerText = `${inversion}%`;
    } else if (option.id === "grayscale") {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterSliderValue.innerText = `${grayscale}%`;
    }
  });
});

rotateOptions.forEach((option) => {
  option.addEventListener("click", function () {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      if (flipHorizontal === 1) {
        flipHorizontal = -1;
      } else {
        flipHorizontal = 1;
      }
    } else if (option.id === "vertical") {
      if (flipVertical === 1) {
        flipVertical = -1;
      } else {
        flipVertical = 1;
      }
    }
    applyFilters();
  });
});

function updateFilter() {
  filterSliderValue.innerText = `${filterSlider.value}%`;

  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else if (selectedFilter.id === "grayscale") {
    grayscale = filterSlider.value;
  }
  applyFilters();
}

function applyFilters() {
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) `;
  previewImg.style.transform = `rotate(${rotate}deg) scaleX(${flipVertical}) scaleY(${flipHorizontal})`;
}

function resetFilters() {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;

  filterOptions[0].click();

  applyFilters();
}

function saveImage() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) `;
  ctx.translate(canvas.width / 2, canvas.height / 2);

  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipVertical, flipHorizontal);

  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
}

//Event Listeners

chooseImgBtn.addEventListener("click", function () {
  fileInput.click();
});
previewImg.addEventListener("click", function () {
  fileInput.click();
});
fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilters);
saveImageBtn.addEventListener("click", saveImage);
