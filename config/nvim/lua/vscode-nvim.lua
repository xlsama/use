local vscode = require('vscode')
local keymap = vim.keymap.set
local opts = { noremap = true, silent = true }

vim.g.mapleader = " "

vim.notify = vscode.notify
vim.opt.clipboard = 'unnamedplus'
-- jkhl 移动时光标周围保留10行
vim.o.scrolloff = 10
vim.o.sidescrolloff = 10
vim.opt.iskeyword:append({'-', '#'})

keymap({'n', 'v'}, 'H', '^', opts)
keymap({'n', 'v'}, 'L', '$', opts)

keymap('n', '<leader>v', 'V', opts)
keymap('n', '<leader>a', '%', opts)

keymap({'n', 'v'}, '<C-h>', "<Cmd>lua require('vscode').call('workbench.action.navigateLeft')<CR>", opts)
keymap({'n', 'v'}, '<C-l>', "<Cmd>lua require('vscode').call('workbench.action.navigateRight')<CR>", opts)

-- removes highlighting after escaping vim search
keymap("n", "<Esc>", "<Esc>:noh<CR>", opts)

---- better indent handling
keymap("v", "<", "<gv", opts)
keymap("v", ">", ">gv", opts)

-- move text up and down
keymap("v", "J", ":m .+1<CR>==", opts)
keymap("v", "K", ":m .-2<CR>==", opts)
keymap("x", "J", ":move '>+1<CR>gv-gv", opts)
keymap("x", "K", ":move '<-2<CR>gv-gv", opts)

-- 定义模式和映射
local modes = {'o', 'x'}
local mappings = {
  ['w'] = 'iw',
  ['('] = 'i(',
  ['b'] = 'ib',
  ['['] = 'i[',
  [']'] = 'i]',
  ['{'] = 'i{',
  ['}'] = 'i}',
  ["'"] = "i'",
  ['"'] = 'i"',
  ['`'] = 'i`',
  ['<'] = 'i<',
  ['>'] = 'i>',
}

-- 应用映射
for _, mode in ipairs(modes) do
  for key, value in pairs(mappings) do
    keymap(mode, key, value, opts)
  end
end

-- 定义 im-select 路径和目标输入法
local im_select_cmd = "/Users/xlsama/bin/im-select"
local default_im = "com.apple.keylayout.ABC"

-- 在退出插入模式时切换到 ABC 输入法
vim.api.nvim_create_autocmd("InsertLeave", {
    callback = function()
        os.execute(im_select_cmd .. " " .. default_im)
    end,
})
