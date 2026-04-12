import API from './api';

export const cartService = {
  getCart:      ()                       => API.get('cart/'),
  addToCart:    (product_id, quantity=1) => API.post('cart/', { product_id, quantity }),
  updateItem:   (item_id, quantity)      => API.patch(`cart/${item_id}/`, { quantity }),
  removeItem:   (item_id)               => API.delete(`cart/${item_id}/`),
  clearCart:    ()                       => API.delete('cart/'),
};