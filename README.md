## Setup

### Clone repository

```bash
mkdir -p ~/i && cd ~/i && git clone git@github.com:xlsama/use.git --depth=1 && cd use
```

### Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install Apps, CLI, Fonts from Brewfile

```bash
brew bundle --file=./Brewfile
```

### Set fish as default shell

```bash
echo /opt/homebrew/bin/fish | sudo tee -a /etc/shells
```

```bash
chsh -s /opt/homebrew/bin/fish
```

### Run install script

```bash
zx install.mjs
```

## Hardware

- MacBook Pro 16 M1 Max / 32GB RAM

- Mouse: MX Master 3S

- Keyboard: Keychron K14Pro

- Display: 海信 27G7K Pro

## Software

### Browser

- [Google Chrome](https://www.google.com/chrome/)

### Editor

- [Zed](https://zed.dev/)

### Network

- [Surge](https://nssurge.com/) - Bypass GFW

### Chat

- [飞书](https://www.feishu.cn/) - Meeting, Screenshot and Recording

- [微信](https://weixin.qq.com/)

### Writing

- [Obsidian](https://obsidian.md/)

- [Refine](https://refine.sh/) - Grammar Checker

### Productivity

- [TickTick](https://dida365.com/) - To Do(Use Web, Pin Tab in Browser)

- [Raycast](https://raycast.com) - Launcher

- [Passwords](https://apps.apple.com/us/app/passwords/id6473799789) - MacOS Internal Password Manager

- [Input Source Pro](https://inputsource.pro/) - Auto switch input source

- [PopClip](https://pilotmoon.com/popclip/) - Quick Open

- [Logi Options+](https://www.logitech.com/en-us/software/logi-options-plus.html) - Mouse manager

- [Mos](https://mos.caldis.me/) - Mouse Smooth Scroll

- [Better Display](https://github.com/waydabber/BetterDisplay) - Control displays

### Developer Tools

- [Yaak](https://yaak.app/) - API Client

- [Dataflare](https://dataflare.app/) - Database Management

- [OrbStack](https://orbstack.dev/) - Docker

### Other

- [Spotify](https://open.spotify.com/) - Music

- [CapCut](https://www.capcut.com/) - Video Editor

## CLI

- [fish](https://fishshell.com/) - Shell

- [Homebrew](https://brew.sh/) - Package Manager, More: [Brewfile](./Brewfile)

## MacOS Config

### Battery

- On power adapter: High Power

### General

#### Date & Time

- 24-hour time: open

#### Language & Region

- Region: China mainland (Raycast Currency Exchange)

- Temperature: Celsius

- First day of week: Monday

### Appearance

- Show scroll bars: When scrolling

### Siri

- Siri: off

### Keyboard

- Key repeat rate: Fast

- Delay until repeat: Short

#### Keyboard Shortcuts

##### Modifier Keys

- Caps Lock key -> Control

#### Input Sources

##### All Input Sources

- Show Input menu in menu bar: off

##### Shuangpin - Simplified

- Shuangpin layout: Xiaohe

### Trackpad

#### Point & Click

- Tap to click: on

#### More Gestures

- Swipe between pages: Scroll Left or Right with Two Fingers
