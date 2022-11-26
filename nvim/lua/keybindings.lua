vim.g.mapleader = ","
vim.g.maplocalleader = ","

-- 本地变量
local map = vim.api.nvim_set_keymap

local opt = { noremap = true, silent = true }


-- normal
map("n", "<space>", ":", opt)
map("n", "H", "^", opt)
map("n", "L", "$", opt)
map("n", "<leader>v", "V", opt)
map("n", "<leader>g", "G", opt)
map("n", "<leader>c", "zz", opt)

-- insert
map("i", "jk", "<ESC>", opt)
