export const registerServiceWorker = () => {
  if (!navigator.serviceWorker)
    return;
  //
  navigator.serviceWorker.register('/sw-bundle.js')
    .then((/*reg*/) => {
      console.log('serviceWorker register() success');
    })
    .catch(err => {
      console.log(`serviceWorker register() failure ${err}`);
    });
};

export const config = {
  nbImages: 10,
  urlOrigin: 'http://localhost:8000',
};

