# 1.ブラウザーで起動する方法 
```
docker-compose up --build
```
### 4500:portで起動

# 2.ブラウザーの停止方法
```
## docker-compose down
```

# 3. ログの確認
もし問題が解決しない場合、コンテナのログを確認して、何かエラーメッセージが出ていないか確認してください。
```
docker-compose logs
```
# 4. 他のプロセスとの競合
他にポート4500を使用しているプロセスがないか確認し、必要であればそのプロセスを停止してください。ポートを占有しているプロセスを確認するには、次のコマンドを実行します：
```
lsof -i :4500
```
