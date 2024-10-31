File sizes after gzip:

  222.03 kB  build\static\js\main.fb9af8a3.js
  1.78 kB    build\static\js\453.f0b8375b.chunk.js
  1.6 kB     build\static\css\main.e89a455d.css

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build
  serve -s build -l 60443

Find out more about deployment here:

  https://cra.link/deployment


update：
2024.10.14
1、修复不同客户端数据传流问题；
2、增加可以多客户端同时测试；
3、修复connect，无法连接后，unconnect无法使用情况。