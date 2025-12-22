module.exports.createPostduan=(req, res, next)=>{
      if(!req.body.title){
        req.flash("error", `vui long nhập tiêu đề!`);
        res.redirect("/admin/Project/create");
        return;
    }
      
        if(req.body.title.length<8){
            req.flash("error","vui lòng nhập tiêu đề lớn hơn 8 kí tự");
            res.redirect("/admin/Project/create");
            return;
        }
        next();
}