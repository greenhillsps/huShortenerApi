export const append = (url) => {

    if (!url.match(/^[a-zA-Z]+:\/\//))
{
 url = 'http://' + url;
}
return url;

}