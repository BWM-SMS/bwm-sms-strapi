
function getTypeFromUrl(ctx: any, param: string): string | null {
    const fullUrl = ctx.host + ctx.url
    const url = new URL(fullUrl, ctx.host); // Base URL is required for URL parsing
    const params = new URLSearchParams(url.search);
    return params.get(param);
}


const URL_Request = {
    getTypeFromUrl
  };
  
  export { URL_Request };
  