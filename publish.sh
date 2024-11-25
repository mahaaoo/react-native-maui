#!/bin/bash
 
# 检查是否以root用户运行
if [ "$(id -u)" -eq 0 ]; then
   echo "This script should not be run as root" 
   exit 1
fi
 
# 切换到npm官方源
echo "Switching npm registry to https://registry.npmjs.org/"
npm config set registry https://registry.npmjs.org/
 
# 验证是否切换成功
current_registry=$(npm config get registry)
if [ "$current_registry" != "https://registry.npmjs.org/" ]; then
    echo "Failed to switch npm registry to https://registry.npmjs.org/"
    exit 1
fi
 
echo "npm registry has been switched to https://registry.npmjs.org/"
 
# 执行npm publish命令
echo "Executing npm publish..."
npm publish
publish_status=$?
 
# 检查publish命令是否成功
if [ $publish_status -ne 0 ]; then
    echo "npm publish failed"
    # 切换回npmmirror源之前先退出脚本，避免进一步操作
    exit $publish_status
fi
 
echo "npm publish succeeded"
 
# 切换到npmmirror源
echo "Switching npm registry back to https://registry.npmmirror.com/"
npm config set registry https://registry.npmmirror.com/
 
# 验证是否切换成功
current_registry=$(npm config get registry)
if [ "$current_registry" != "https://registry.npmmirror.com/" ]; then
    echo "Failed to switch npm registry to https://registry.npmmirror.com/"
    exit 1
fi
 
echo "npm registry has been switched back to https://registry.npmmirror.com/"
 
echo "Script execution completed successfully"
exit 0