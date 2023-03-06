# Train-Schedule

鐵路時刻表 iPhone 版

安卓未測試

## 使用技術

1. Expo
2. React Native 0.70
3. Native Base 做 UI 框架 https://nativebase.io/
4. Recoiljs 作為全局變數管理 https://recoiljs.org/

## 主要功能

1. 快速查詢站到站列車時刻表(含即時誤點資料，自動滾動設定時間區間，顏色區隔已超過時間的列車)
2. 開啟時自動選取最近火車站為出發站(可開關)
3. 設定出發時間永遠為現在
4. 設定為查詢抵達時間
5. 儲存快速行程，點擊即可載入(包含每日時間、立即和抵達狀態)
6. 點擊列車進入該車次詳細資料(每站到離站時刻，含即時誤點資料，自動滾動到起訖站區間)
7. 即時誤點資料每分鐘自動更新，有更新提示小彈窗

## 截圖

1.主畫面

![image](https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2499.PNG)

2.選擇時間

![image](https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2504.PNG)

3.時刻表

![image](https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2505.PNG

4.列車詳細時刻表

![image](https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2503.PNG)

5.設定頁面

![image](https://github.com/clspeter/Train-Schedule/blob/master/Readme/IMG_2502.PNG)

## Usage

```sh
yarn install

yarn start
```
