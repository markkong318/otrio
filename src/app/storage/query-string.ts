const params: any = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(String(prop)),
});

export default params;
