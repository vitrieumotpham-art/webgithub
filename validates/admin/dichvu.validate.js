module.exports.createPost=(req, res, next)=>{
      if(!req.body.title){
        req.flash("error", `vui long nhập tiêu đề!`);
        res.redirect("/admin/dichvu/create");
        return;
    }
      
        if(req.body.title.length<8){
            req.flash("error","vui lòng nhập tiêu đề lớn hơn 8 kí tự");
            res.redirect("/admin/dichvu/create");
            return;
        }
        next();
}
