import { MessageActionsId, ResponseMessageData } from '../types';
import { Constants } from '../constants';

// index.htmlから画面初期表示時に呼び出される処理
document.addEventListener('DOMContentLoaded', () => {
  // 現在のタブ情報を取得
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0 || tabs[0].id === undefined) {
      throw new Error('アクティブなタブが見つかりませんでした。');
    }
    chrome.tabs.sendMessage<MessageActionsId>(
      tabs[0].id,
      { action: 'get-product-info' },
      (response: ResponseMessageData | undefined) => {
        if (chrome.runtime.lastError) {
          throw new Error(chrome.runtime.lastError.message);
        }
        const container = document.querySelector('.listings-container');
        if (!container || !response) {
          throw new Error('Container要素が見つからないか、商品情報がありません。');
        }

        createContainer(response, container);
      },
    );
  });
});

/**
 * @description
 * @param {ResponseMessageData} response index.html表示時に/todosに表示されている商品の情報
 * @param {Element} container 商品情報を表示するhtmlのContainer要素
 */
const createContainer = (response: ResponseMessageData, container: Element) => {
  let inputCount = 1;
  for (const product of response.data) {
    // `発送をお願いします`とresponse.data.textに入っていなければ次のループ処理に進む
    if (!product.text.includes(Constants.NOT_DISPLAY_STRING)) {
      continue;
    }

    const listingItem = document.createElement('div');
    listingItem.classList.add('listing-item');
    // 商品IDをdata属性に追加
    listingItem.dataset.productId = product.id ? product.id : '';

    // チェックボックスを作成
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `item-checkbox-${inputCount}`;
    checkbox.classList.add('item-checkbox');

    const productDetails = document.createElement('div');
    productDetails.classList.add('product-details');

    // 商品名
    const productName = document.createElement('label');
    productName.htmlFor = `item-checkbox-${inputCount}`;
    productName.textContent = `${product.name ?? ' '}`;

    // 商品画像
    const productImage = document.createElement('img');
    productImage.src = product.imageUrl ?? '';
    productImage.alt = product.name ?? 'No image';

    // 商品詳細をまとめる
    productDetails.appendChild(productName);
    productDetails.appendChild(productImage);

    // リストアイテムにチェックボックスと商品詳細を追加
    listingItem.appendChild(checkbox);
    listingItem.appendChild(productDetails);

    // コンテナにリストアイテムを追加
    container.appendChild(listingItem);
    inputCount++;
  }
};
