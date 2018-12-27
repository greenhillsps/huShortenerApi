exports.append = function(url){
    if (!url.match(/^[a-zA-Z]+:\/\//))
{
 url = 'http://' + url;
}
return url;

}