
function getTypeFromUrl(ctx: any, param: string): string | null {
    const fullUrl = new URL(ctx.url, `http://${ctx.host}`); // Ensure the full URL is correctly constructed
    const params = new URLSearchParams(fullUrl.search);
    return params.get(param);
}


const URL_Request = {
    getTypeFromUrl
  };
  
  export { URL_Request };
  