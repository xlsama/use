local vscode = require('vscode')

-------------------- 基础配置 -----------------
vim.g.mapleader = " "
vim.o.timeoutlen = 400
vim.notify = vscode.notify
vim.opt.iskeyword:append({ '-' })
vim.opt.clipboard = 'unnamedplus'

-------------------- 辅助函数 -----------------
local function keymap(mode, lhs, rhs, opts)
  opts = opts or { noremap = true, silent = true }
  vim.keymap.set(mode, lhs, rhs, opts)
end

local function map(mode, lhs, rhs, opts)
  opts = opts or { noremap = true, silent = true }
  vim.keymap.set(mode, lhs, function() vscode.call(rhs) end, opts)
end

------------------ Vim 原生映射 ---------------
-- ; 和 : 互换
keymap('n', ';', ':')
keymap('n', ':', ';')

keymap({ 'n', 'v' }, 'H', '^')
keymap({ 'n', 'v' }, 'L', '$')
keymap('n', 'dh', 'd^')
keymap('n', 'dl', 'd$')
keymap('n', 'ch', 'c^')
keymap('n', 'cl', 'c$')
keymap('n', 'yh', 'y^')
keymap('n', 'yl', 'y$')
keymap('n', '<leader>v', 'V')
keymap('n', '<leader>a', '%')

----------------- VSCode 命令映射 --------------
map('n', '<leader>r', 'editor.action.rename')
map('n', '<leader>t', 'editor.emmet.action.matchTag')
map('n', '<leader>z', 'editor.toggleFold')

------------------ Text Objects ---------------
local modes = { 'o', 'x' }
local mappings = {
  ['w'] = 'iw',
  ['('] = 'i(',
  ['b'] = 'ib',
  ['['] = 'i[',
  ['{'] = 'i{',
  ["'"] = "i'",
  ['"'] = 'i"',
  ['`'] = 'i`',
  ['<'] = 'i<',
}

for _, mode in ipairs(modes) do
  for key, value in pairs(mappings) do
    keymap(mode, key, value)
  end
end

----------------- 可视模式缩进 --------------
keymap('x', '<', '<gv')
keymap('x', '>', '>gv')

---------------- 输入法自动切换 -------------
vim.api.nvim_create_autocmd("InsertLeave", {
  callback = function()
    vim.fn.jobstart({ "/opt/homebrew/bin/im-select", "com.apple.keylayout.ABC" })
  end,
})
