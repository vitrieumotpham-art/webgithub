tinymce.init({
  selector: 'textarea#my-expressjs-tinymce-app', // Kiểm tra ID này khớp với Pug
  license_key: 'gpl',  // <--- THÊM DÒNG NÀY ĐỂ MỞ KHÓA
  plugins: 'lists link image table code help wordcount',
  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist',
  height: 300
});