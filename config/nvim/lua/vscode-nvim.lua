local vscode = require('vscode')

-------------------- 基础配置 -----------------
vim.g.mapleader = " "
vim.o.timeoutlen = 1500
vim.notify = vscode.notify
vim.opt.clipboard = 'unnamedplus'
-- jkhl 移动时光标周围保留10行
vim.o.scrolloff = 10
vim.o.sidescrolloff = 10
-- 将 - 视为单词的一部分
vim.opt.iskeyword:append({ '-' })

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
keymap("n", "<Esc>", "<Esc>:noh<CR>")

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
keymap('x', '<', '<gv', { noremap = false, silent = true })
keymap('x', '>', '>gv', { noremap = false, silent = true })

---------------- 输入法自动切换 -------------
local im_select_cmd = "/opt/homebrew/bin/im-select"
local default_im = "com.apple.keylayout.ABC"

vim.api.nvim_create_autocmd("InsertLeave", {
  callback = function()
    os.execute(im_select_cmd .. " " .. default_im)
  end,
})