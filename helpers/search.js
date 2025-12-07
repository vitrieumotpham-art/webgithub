module.exports = (query)=>{
let object ={
    keyword:"",
}
      if(query.keyword){
        object.keyword=query.keyword;
        const regex= new RegExp(object.keyword,'i') ;
        object.regex=regex;
    }
    return object;
}