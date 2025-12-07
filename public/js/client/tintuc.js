document.addEventListener('DOMContentLoaded', () => {
    // 1. Handle Filter Buttons (Giống logic trước nhưng áp dụng cho layout mới)
    const filterBtns = document.querySelectorAll('.filters button');
    const articles = document.querySelectorAll('.article-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            articles.forEach(article => {
                if (filterVal === 'all' || article.getAttribute('data-cat') === filterVal) {
                    article.style.display = 'flex';
                    // Animation
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        article.style.opacity = '1';
                        article.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    article.style.display = 'none';
                }
            });
        });
    });

    // 2. Newsletter Validation Simple
    const emailBtn = document.querySelector('.email-form button');
    const emailInput = document.querySelector('.email-form input');

    if(emailBtn) {
        emailBtn.addEventListener('click', () => {
            if(emailInput.value.includes('@')) {
                alert('Cảm ơn bạn đã đăng ký nhận tin từ PNT DECOR!');
                emailInput.value = '';
            } else {
                alert('Vui lòng nhập email hợp lệ!');
            }
        });
    }
});