# MacOS System Settings

`Version: 13.0`

## General

### Language & Region

- Preferred languages：`English – Primary`

- First day of week：`Monday`

## Appearance

- Appearance：`Auto`

- Allow wallpaper tinting in windows `false`

- Show scroll bars：`When scrolling`

## Siri & Soptlight

- Ask Siri `false`

## Desktop & Dock

- Position on screen `Right`

- Automatically hide and show the Dock `true`

- Show recent applications in Dock `false`

- Stage Manager `true`

## Touch ID & Password

- Apple Watch `true`

## Game Center

- Game Center `false`

## Keyboard

- Key repeat rate ：`Fast`

- Delay until repeat：`Short`

```shell
# Long press for continuous input
defaults write -g ApplePressAndHoldEnabled -bool false
```

- Keyboard navigation `true`

### Keyboard Shortcuts

- Launchpad & Dock

  - Show Launchpad `option + space`

- Input Sources

  - Select the previous input source `control + option + space`

  - Select next source in input menu `control + space`

- Screenshots

  - Save picture of screen as a file `false`

  - Copy picture of screen to the clipboard `false`

  - Save picture of selected area as a file `false`

  - Copy picture of selected area to the clipboard `false`

  - Screenshot and recording options `true` `shift + commmand + 3`

- Spotlight

  - Show Spotlight search `false`

  - Show Finder search window `false`

### Text Input

- Use the Caps Lock key to switch to and from ABC `false`

- Correct spelling automatically `false`

- Capitalize words automatically `false`

- Add period with double-space `false`

#### Shuangpin - Simplified

- Shuangpin layout `Xiaohe`

- Show traditional and rare characters `true`

## Mouse

- Natural scrolling `true`

## Other

```shell
brew install firacode
```

```shell
brew tap homebrew/cask-fonts && brew install --cask font-fira-code
```

```shell
brew install nerd-font
```

```shell
brew tap homebrew/cask-fonts && brew install --cask font-fira-code-nerd-font
```
