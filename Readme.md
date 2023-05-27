# Train-Schedule

一個使用 React Native 開發的鐵路時刻表 App

## 如何使用

已上架 App Store

[![Download on the App Store](./Readme/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg)](https://apps.apple.com/tw/app/%E5%8F%B0%E9%90%B5%E5%BF%AB%E6%9F%A5/id6448436446)

或

[測試版(TestFlight)](https://testflight.apple.com/join/dsbFuhK8)

## 開發緣由

前一陣子有搭火車的需求，每次搭火車前要查時刻表開啟 App 後都需要選站和選時間，點來點去，浪費很多時間，於是決定開發一款能快速查詢時刻表的 App

Train-Schedule 提供快速載入通勤或指定路線的火車時刻表，至多只須點擊一至兩次即可取得時刻表，節省使用者操作時間。

## 使用技術

1. 主要框架: React Native 0.70 <https://reactnative.dev/>
2. 開發&上架工具: Expo <https://expo.dev/> 可熱更新
3. UI: Native Base <https://nativebase.io/>
4. 全局變數管理: Recoil.js <https://recoiljs.org/>
5. API 處理: Axios 連接 TDX(運輸資料流通服務平臺)

## 功能介紹 & 實際畫面

- 主畫面

  1. 選擇抵達、出發站
  2. 設定出發時間為現在
  3. 設定為查詢抵達時間
  4. 儲存快速行程，點擊可立刻載入每日時間、立即和抵達狀態
  5. 下一班火車->立即顯示最近車站的時刻表
  6. 查詢時刻->查詢站到站時刻表

   <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2522.PNG" width="33%" height="50%">

  - 選擇時間

   <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2504.PNG" width="33%" height="50%">

  - 選擇車站

   <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2506.PNG" width="33%" height="50%">

- 下一班火車 最近車站的動態時刻表

  1. 點擊列車進入該車次詳細資料
  2. 提供即時誤點資料，且每分鐘自動更新，有更新提示小彈窗

  <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/2524.PNG" width="33%" height="50%">

- 提供即時誤點資料，且每分鐘自動更新，有更新提示小彈窗

  1. 各站到離站時刻
  2. 即時誤點資料、列車目前位置
  3. 自動滾動到起訖站區間

  <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2503.PNG" width="33%" height="50%">

- 站到站時刻表

  1. 提供即時誤點資料，且每分鐘自動更新，有更新提示小彈窗
  2. 點擊列車進入該車次詳細資料，同下一班火車的車次詳細資料

  <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2505.PNG" width="33%" height="50%">

- 其他功能

  1. 設定內可選擇開啟 App 時自動選取最近火車站為出發站

  <img src="https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2502.PNG" width="33%" height="50%">

## 程式碼說明

state.tsx, store.tsx: 全局變數管理

apiRequest.ts, dataProcess.tx: API 和資料處理

## 預計更新

- 增加開啟 Aap 直接進入下一班列車頁面的選項
- 滑動刪除快速行程

## 已知問題

有時抵達車站會顯示空白，臨時解決方法，請進設定清除快取資料

## 如何開發

copy env.example to .env
填寫 TDX API 金鑰，由一組 Client Id 和 Client Secret 組成

```sh
yarn install

yarn start
```
