# MacOS System Preferences

![image-20210924215647479](https://i.loli.net/2021/09/24/J5fCZycLGIVXir2.png)

## General

- Appearance：`Auto` 根据日落日出时间自动切换白天和黑夜模式
- SideBar icon size：
  - Allow wallpaper tinting in windows `不勾选` 窗口的背景颜色随壁纸变化
- Show scroll bars：`When scrolling` 只有当滚动时才显示滚动条，鼠标也是

## Language & Region

- Preferred languages：`English – Primary` 系统语言

- First day of week：`Monday` 一周的第一天

## Keyboard

- Keyboard：

  - Key Repeat：`Fast` 拉到最快
  - Delay Until Repeat：`Short` 拉到最短

  这样 vim 用起来很丝滑，比如按住 hjkl、Control+d、Control+u 时

```
defaults write -g ApplePressAndHoldEnabled -bool false
```
需要重启
Command+Shift+Q 重启当前用户

- Shortcuts：

  - Launchpad：
    - Show Launchpad：`Command+Space` 打开启动台（这个不常用）
  - Screentshots：`全部取消勾选` 我用 [iShot](https://apps.apple.com/cn/app/ishot-%E4%BC%98%E7%A7%80%E7%9A%84%E6%88%AA%E5%9B%BE%E5%BD%95%E5%B1%8F%E5%B7%A5%E5%85%B7/id1485844094?mt=12) 截图
  - Spotlight：`全部取消勾选` 不用聚焦，用 [raycast](https://raycast.com/)

    - [Config](https://github.com/xlsama/use)

## Mouse

- Scroll direction：Natural `勾选` 鼠标滚动方向自然

## Sharing

- Computer Name：`xlsama` 我的计算机名字（蓝牙，AirDrop 等显示的名字）

## Terminal

- [Alacritty](https://github.com/alacritty/alacritty)

  - Config：[alacritty.yml](https://github.com/xlsama/use/blob/main/alacritty.yml)

- [zsh](https://ohmyz.sh/) - Shell

  - Config：[.zshrc](https://github.com/xlsama/use/blob/main/.zshrc)

- [Tmux](https://github.com/tmux/tmux/wiki/Installing) - multiplexer

  - Config：[tmux.conf](https://github.com/xlsama/use/blob/main/tmux.conf)

