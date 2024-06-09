import { describe, beforeEach, test, expect } from 'vitest';
import { extractProductData } from './index';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('todos content_script tests', () => {
  beforeEach(() => {
    const html = readFileSync(resolve('./src/test', 'todos.html'), 'utf8');
    document.body.innerHTML = html;
  });

  // extractProductData() tests
  test('値が正しく取得できるか', () => {
    const baseElement = document.querySelector(
      '#main > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(1) > div.content__884ec505',
    );
    const productData = extractProductData(baseElement!);
    expect(productData).toEqual({
      id: '/transaction/m123456',
      imageUrl:
        'https://static.mercdn.net/c!/w=240/thumb/photos/m123456_1.jpg?1717504887',
      name: 'あああああああああああ ああああああああ ああああああああ あ',
      text: 'ああああさんが「あああああああああああ ああああああああ ああああああああ あ」を購入しました。内容を確認の上、発送をお願いします',
    });
  });

  test('必要な商品情報の要素が見つかりませんでした。のエラーが発生する', () => {
    // div:nth-child(2)の要素をいじったので、例外が発生する
    const baseElement = document.querySelector(
      '#main > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(2) > div.content__884ec505',
    );
    // expectブロックの中で直接関数を呼び出すと、エラーが発生する前にテストが終了してしまいます。
    // 無名関数を使用して関数呼び出しをラップすることで、expectがエラーメッセージを正しくキャッチできるようになります。
    expect(() => extractProductData(baseElement!)).toThrow(
      '必要な商品情報の要素が見つかりませんでした。',
    );
  });

  test('商品の詳細情報の取得に失敗しました。のエラーが発生する', () => {
    // aタグのhref属性を削除したので、例外が発生する
    const baseElement = document.querySelector(
      '#main > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(3) > div.content__884ec505',
    );
    expect(() => extractProductData(baseElement!)).toThrow(
      '商品の詳細情報の取得に失敗しました。',
    );
  });
});
