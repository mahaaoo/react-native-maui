#!/usr/bin/env bash
npm config set registry=https://registry.npmjs.org
echo '请进行登录相关操作：'
npm login # 登陆
echo "-------publishing-------"
npm publish # 发布
echo "发布结束，请注意控制台的实际输出情况"
exit