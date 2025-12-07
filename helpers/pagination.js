module.exports= (ojectPagination, query,countDuan)=>{
    if(query.page){
  ojectPagination.currentPage=parseInt(query.page);
}
ojectPagination.skip = (ojectPagination.currentPage-1)*ojectPagination.limitItem;
 
     const totalpage= Math.ceil(countDuan/ojectPagination.limitItem);
     ojectPagination.totalpage=totalpage;
     return ojectPagination; 
}