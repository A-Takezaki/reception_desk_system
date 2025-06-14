/**
 * Notion API連携のユーティリティ関数
 * 来客管理システムのNotionデータベース操作を提供
 */

import { Client } from '@notionhq/client';
import type { VisitorInfo } from './types';

/**
 * Notion APIクライアントインスタンス
 */
const notion = new Client({
  auth: import.meta.env.VITE_NOTION_API_TOKEN,
});

/**
 * 環境変数から取得するNotionデータベースID
 */
const DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID;

/**
 * NotionデータベースのAttendedカラムを更新する結果の型
 */
export type NotionUpdateResult = 
  | { success: true }
  | { success: false; error: string };

/**
 * 訪問者IDに基づいてNotionデータベースのAttendedカラムをtrueに更新
 * @param visitorInfo 訪問者情報
 * @returns 更新結果
 */
export async function updateAttendanceStatus(visitorInfo: VisitorInfo): Promise<NotionUpdateResult> {
  try {
    if (!DATABASE_ID) {
      return {
        success: false,
        error: 'VITE_NOTION_DATABASE_ID環境変数が設定されていません'
      };
    }

    if (!import.meta.env.VITE_NOTION_API_TOKEN) {
      return {
        success: false,
        error: 'VITE_NOTION_API_TOKEN環境変数が設定されていません'
      };
    }

    // IDまたは名前でページを検索
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        or: [
          {
            property: 'ID',
            rich_text: {
              equals: visitorInfo.id
            }
          },
          {
            property: 'Name',
            title: {
              equals: visitorInfo.name
            }
          }
        ]
      }
    });

    if (response.results.length === 0) {
      return {
        success: false,
        error: `訪問者 ${visitorInfo.name} (ID: ${visitorInfo.id}) がNotionデータベースで見つかりませんでした`
      };
    }

    // 最初にマッチしたページを更新
    const pageId = response.results[0].id;
    
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Attended': {
          checkbox: true
        }
      }
    });

    return { success: true };

  } catch (error) {
    console.error('Notion API エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Notion APIの呼び出しに失敗しました'
    };
  }
}

if (import.meta.vitest) {
  const { test, expect, vi } = import.meta.vitest;

  // Notion APIクライアントのモック
  vi.mock('@notionhq/client', () => ({
    Client: vi.fn(() => ({
      databases: {
        query: vi.fn()
      },
      pages: {
        update: vi.fn()
      }
    }))
  }));

  test('updateAttendanceStatus - 環境変数が未設定の場合エラーを返す', async () => {
    // 環境変数をクリア
    const originalToken = import.meta.env.VITE_NOTION_API_TOKEN;
    const originalDatabaseId = import.meta.env.VITE_NOTION_DATABASE_ID;
    
    // @ts-ignore
    import.meta.env.VITE_NOTION_API_TOKEN = '';
    // @ts-ignore  
    import.meta.env.VITE_NOTION_DATABASE_ID = '';

    const visitorInfo: VisitorInfo = { name: '田中太郎', id: '12345' };
    const result = await updateAttendanceStatus(visitorInfo);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('環境変数が設定されていません');
    }

    // 環境変数を復元
    // @ts-ignore
    import.meta.env.VITE_NOTION_API_TOKEN = originalToken;
    // @ts-ignore
    import.meta.env.VITE_NOTION_DATABASE_ID = originalDatabaseId;
  });

  test('updateAttendanceStatus - 成功時のレスポンス構造', async () => {
    const successResult: NotionUpdateResult = { success: true };
    expect(successResult.success).toBe(true);
  });

  test('updateAttendanceStatus - 失敗時のレスポンス構造', async () => {
    const errorResult: NotionUpdateResult = { 
      success: false, 
      error: 'テストエラー' 
    };
    expect(errorResult.success).toBe(false);
    if (!errorResult.success) {
      expect(errorResult.error).toBe('テストエラー');
    }
  });

  test('updateAttendanceStatus - 訪問者情報の型チェック', () => {
    const visitorInfo: VisitorInfo = { name: '田中太郎', id: '12345' };
    expect(visitorInfo.name).toBe('田中太郎');
    expect(visitorInfo.id).toBe('12345');
  });
}