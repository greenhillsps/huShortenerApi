function append(url){

    if (!url.match(/^[a-zA-Z]+:\/\//))
{
    if(url!==""){
 url = 'http://' + url;
    }
}
return url;

}

module.exports={
append
}