# Node.jsのスリム版イメージをベースにする
FROM node:18.16.0-slim

# 作業ディレクトリを作成
WORKDIR /app

# アプリケーションのコードをコンテナにコピー
COPY my-react-app /app/

# 依存関係をインストール
RUN npm install

