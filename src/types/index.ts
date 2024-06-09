/**
 * @description メッセージのアクションID
 * @param get-product-info: 画面初期表示時に商品情報を取得する
 */
export type MessageActionsId = {
  action: 'get-product-info';
};

/**
 * @description 画面初期表示時に取得する商品の情報
 * @param id: 商品ID
 * @param name: 商品名
 * @param imageUrl: 商品画像URL
 * @param text: やることリストに表示されているテキスト
 */
export type ProductData = {
  id: string;
  name: string;
  imageUrl: string;
  text: string;
};

export type ResponseMessageData = {
  data: ProductData[];
};
