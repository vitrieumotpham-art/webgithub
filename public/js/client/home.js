// Khi scroll, đánh dấu menu active
const menuItems = document.querySelectorAll('.sticky-menu .item');
const sections = document.querySelectorAll('.section-content');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 60; 
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  menuItems.forEach(item => {
    item.classList.remove('active');
    if(item.parentElement.getAttribute('href') === `#${current}`){
      item.classList.add('active');
    }
  });
});
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // scroll xuống → ẩn header
    header.style.top = "-75px"; 
  } else {
    // scroll lên → hiện header
    header.style.top = "0";
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // tránh âm
});
/* ===== JS: Hiệu ứng xuất hiện khi cuộn xuống (Scroll Animation) ===== */

// Lấy tất cả các phần tử cột mốc
const timelineItems = document.querySelectorAll(".timeline-item");

// Hàm kiểm tra phần tử có nằm trong vùng hiển thị không
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight * 0.85 && // 85% chiều cao màn hình
    rect.bottom > 0
  );
}

// Hàm thêm hiệu ứng khi phần tử xuất hiện
function showTimelineItems() {
  timelineItems.forEach((item) => {
    if (isInViewport(item)) {
      item.classList.add("visible");
    }
  });
}

// Gọi khi cuộn và khi tải trang
window.addEventListener("scroll", showTimelineItems);
window.addEventListener("load", showTimelineItems);
/* ===== JS: Hiệu ứng xuất hiện khi cuộn xuống - CHIẾN LƯỢC KINH DOANH ===== */

const strategyItems = document.querySelectorAll(".strategy-item");

// Hàm kiểm tra phần tử có nằm trong vùng hiển thị không
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < window.innerHeight * 0.9 &&  // hiển thị khi phần tử vào 90% chiều cao màn hình
    rect.bottom > 0
  );
}

// Hàm xử lý hiển thị từng item
function showStrategyItems() {
  strategyItems.forEach((item, index) => {
    if (isInViewport(item)) {
      item.classList.add("visible");
      item.style.transitionDelay = `${index * 0.1}s`; // hiệu ứng lần lượt
    }
  });
}

// Lắng nghe sự kiện cuộn và tải trang
window.addEventListener("scroll", showStrategyItems);
window.addEventListener("load", showStrategyItems);
/* ===== JS: Hiệu ứng xuất hiện khi cuộn xuống - SẢN PHẨM CHIẾN LƯỢC ===== */

// Lấy tất cả các sản phẩm
const productItems = document.querySelectorAll(".product-item");

// Kiểm tra phần tử có trong vùng nhìn thấy không
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < window.innerHeight * 0.9 && // khi 90% chiều cao màn hình
    rect.bottom > 0
  );
}

// Hiển thị từng sản phẩm khi cuộn tới
function showProductItems() {
  productItems.forEach((item, index) => {
    if (isInViewport(item)) {
      item.classList.add("visible");
      item.style.transitionDelay = `${index * 0.1}s`; // hiệu ứng lần lượt
    }
  });
}

// Gọi khi cuộn và khi tải trang
window.addEventListener("scroll", showProductItems);
window.addEventListener("load", showProductItems); 
/* ===== JS: Hiệu ứng xuất hiện khi cuộn xuống - CHỨNG CHỈ CHẤT LƯỢNG ===== */

// Lấy tất cả các phần tử chứng chỉ
const certificateItems = document.querySelectorAll(".certificate-item");

// Kiểm tra phần tử có nằm trong vùng nhìn thấy không
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < window.innerHeight * 0.9 && // xuất hiện khi gần chạm đáy màn hình
    rect.bottom > 0
  );
}

// Thêm lớp "visible" khi cuộn tới phần tử
function showCertificateItems() {
  certificateItems.forEach((item, index) => {
    if (isInViewport(item)) {
      item.classList.add("visible");
      item.style.transitionDelay = `${index * 0.1}s`; // hiệu ứng trễ nhẹ từng item
    }
  });
}

// Lắng nghe sự kiện cuộn và tải trang
window.addEventListener("scroll", showCertificateItems);
window.addEventListener("load", showCertificateItems);
// Lấy tất cả phần tử cần hiệu ứng
const fadeItems = document.querySelectorAll(".fade-item");

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
}

function showFadeItems() {
  fadeItems.forEach((item, index) => {
    if (isInViewport(item)) {
      item.classList.add("visible");
      item.style.transitionDelay = `${index * 0.15}s`;
    }
  });
}

window.addEventListener("scroll", showFadeItems);
window.addEventListener("load", showFadeItems);
