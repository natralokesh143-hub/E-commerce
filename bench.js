(async () => {
  try {
    const Store = (await import('./src/Store.js')).default;
    const { addToWishlist, removeFromWishlist } = await import('./src/Slices/WishlistSlice.js');
    const s = Store;
    console.log('initial', s.getState().wishlist);
    s.dispatch(addToWishlist({id:1,title:'Test'}));
    console.log('after add', s.getState().wishlist);
    s.dispatch(removeFromWishlist(1));
    console.log('after remove', s.getState().wishlist);
  } catch (err) {
    console.error('error', err);
    if (typeof globalThis.process?.exit === "function") {
      globalThis.process.exit(1);
    }
  }
})();