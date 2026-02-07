# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

コーヒー抽出用のReact + TypeScript + Viteアプリケーション。粕谷哲氏の4:6メソッドに基づき、コーヒー豆の量・お湯の量・風味・濃さから抽出ステップを自動計算し、タイマー機能で抽出をサポートする。

## 開発コマンド

```bash
# 開発サーバー起動（package.jsonにdevスクリプトがないため直接実行）
npx vite

# ビルド
npm run build

# テスト実行
npm run test

# テスト（ウォッチモード）
npm run test:watch

# Lint
npm run lint

# ビルド結果のプレビュー
npm run preview

# GitHub Pagesへデプロイ
npm run deploy
```

## 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite（SWCプラグイン使用）
- **UIライブラリ**: Material-UI (MUI) v6
- **テスト**: Vitest
- **デプロイ先**: GitHub Pages (`/coffee-brewing-app/` ベースパス)

## アーキテクチャ

```
src/
├── App.tsx                    # メインコンポーネント（状態管理 + レイアウト）
├── types.ts                   # 型定義・定数・ロジック関数・ユーティリティ
├── theme.ts                   # MUIテーマ定義
├── main.tsx                   # エントリーポイント（ThemeProvider適用）
├── components/
│   ├── BrewingTips.tsx        # 抽出のコツ（Accordion）
│   ├── BrewingForm.tsx        # 入力フォーム（豆量・湯量・風味・濃さ）
│   ├── BrewingTable.tsx       # 抽出ステップテーブル
│   └── TimerControl.tsx       # タイマー表示・操作
└── __tests__/
    └── brewingLogic.test.ts   # 計算ロジックの単体テスト（19件）
```

### 主要モジュール

#### types.ts
- **型定義**: `BrewingStep`, `Flavor`, `Strength`
- **定数**: `FIRST_RATIO(0.4)`, `LAST_RATIO(0.6)`, `STEP_INTERVAL_SECONDS(45)`, `FLAVOR_RATIOS`, `STRENGTH_POURS`, `COLORS`
- **ロジック関数**:
  - `calculateBrewingSteps()` - 総水量・風味・濃さから注湯スケジュールを算出
  - `calculateFlavorAdjustment()` - 前半40%の分配（甘め≈5:7 / 標準=1:1 / 明るめ≈7:5）
  - `calculateStrengthAdjustment()` - 後半60%の分配（濃いめ=3回 / 標準=2回 / 薄め=1回）
  - `formatTime()` - 秒数を「X分XX秒」形式にフォーマット
  - `playBeep()` - Web Audio APIによるビープ音再生
- **ストレージ**: `getStorage()`, `setStorage()` （localStorage経由）

#### App.tsx
- 状態管理（useState, useMemo, useEffect, useRef）
- ビープ音通知のuseEffect
- タイマーのuseEffect
- 子コンポーネントへのprops配信

### 4:6メソッドの実装について
- 粕谷哲氏のオリジナルに準拠
- 注湯タイミングは全ステップ**45秒間隔**
- 風味調整比率: 甘め≈5/12:7/12, 明るめ≈7/12:5/12（オリジナルの約2:3 / 3:2に対応）
- 丸め誤差は最終ステップで調整し、合計が必ずtotalWaterと一致

## チーム開発体制

大きな機能開発・改善を行う際は、以下の3チーム体制で並行作業する。

### 1. 調査チーム（research-team）
- **役割**: 関連技術・ドメイン知識の調査、現行実装との比較分析
- **ツール**: WebSearch, WebFetch, Read, Grep
- **成果物**: 調査結果レポート（マークダウン形式、scratchpadに保存）
- **例**: 4:6メソッドの正確な仕様調査、競合アプリ調査、新技術の調査

### 2. Red Team（red-team）
- **役割**: アプリの批判的レビュー、改善点の洗い出し
- **レビュー観点**:
  - コード品質（型安全性、関心の分離、パフォーマンス）
  - アーキテクチャ（状態管理、永続化、テスタビリティ）
  - UX/UI（モバイル対応、a11y、初心者配慮）
  - 不足機能
  - セキュリティ・品質保証
- **成果物**: 改善提案レポート（優先度: 高/中/低 付き、具体的な修正方針を含む）

### 3. 開発チーム（dev-phase1, dev-phase2, ...）
- **役割**: 調査・レビュー結果に基づく実装
- **作業フロー**:
  1. チームリーダーが調査・レビュー結果を統合し、Phase分けした開発計画を策定
  2. 依存関係のあるPhaseは順次実行、独立したPhaseは並行実行
  3. 各Phaseの完了時にビルド（`npm run build`）とテスト（`npm run test`）を確認
- **コミット・PR**: Phase単位でブランチを作成しPRを出す

### チーム運用の流れ

```
1. 調査チーム + Red Team を並行起動
2. 両チームの成果物を統合し、優先度付き開発計画を策定
3. ユーザーに実施範囲を確認
4. 開発チームを順次/並行起動し実装
5. 各Phase完了ごとにビルド+テスト確認
6. コミット+PR作成
```
