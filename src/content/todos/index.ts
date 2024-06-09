import { MessageActionsId, ProductData } from '../../types';

export const setupMessageListener = () => {
  chrome.runtime.onMessage.addListener(
    async (request: MessageActionsId, _sender, sendResponse) => {
      if (request.action === 'get-product-info') {
        const details: ProductData[] = [];
        let count = 1;
        let element: Element | null;

        // 商品情報が取得できなくなるまで繰り返す
        while (
          (element = document.querySelector(
            `#main > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(${count}) > div.content__884ec505`,
          )) !== null
        ) {
          try {
            const productData = extractProductData(element);
            console.log(productData);
            details.push(productData);
          } catch (error) {
            console.error(`商品の取得中にエラーが発生しました : ${error}`);
            break;
          }
          count++;
        }

        console.log('全ての商品を取得しました。');
        sendResponse({ data: details });
      }
      return true;
    },
  );
};

export const extractProductData = (element: Element): ProductData => {
  const hrefElement = element.querySelector('a');
  const imageElement = element.querySelector(
    'a > div > div > div.merItemThumbnail.small__a6f874a2.image__8ccd0d74 > figure > div.imageContainer__f8ddf3a2 > picture > img',
  );
  const textElement = element.querySelector('a > div > div > div.content__8ccd0d74 > p');

  if (!imageElement || !hrefElement || !textElement) {
    throw new Error('必要な商品情報の要素が見つかりませんでした。');
  }
  const id = hrefElement.getAttribute('href');
  const imageUrl = imageElement.getAttribute('src');
  const textBase = textElement.textContent;

  if (!imageUrl || !id || !textBase) {
    throw new Error('商品の詳細情報の取得に失敗しました。');
  }

  const name = extractProductName(textBase.replace(/\s+/g, ' ').trim());
  const text = textBase.replace(/\s+/g, ' ').trim();

  return { id, name, imageUrl, text };
};

/**
 * @description やることリストに表示されている文章から、商品名だけを取得する。
 * @param {(string | null)} text
 * @return {*}  {string}
 */
export const extractProductName = (text: string | null): string => {
  if (!text) throw new Error('商品名の取得に失敗しました。');

  const match = text.match(/「(.+?)」/);
  if (!match) throw new Error('商品名のフォーマットが正しくありません。');

  return match[1];
};

export const replaceTrimText = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim();
};

// テスト環境では setupMessageListener を呼び出さないようにする
if (typeof chrome !== 'undefined' && chrome.runtime) {
  setupMessageListener();
}
