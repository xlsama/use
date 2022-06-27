vim.g.mapleader = ","

vim.g.maplocalleader = ","

-- 本地变量
local map = vim.api.nvim_set_keymap

local opt = { noremap = true, silent = true }


-- normal
map("n", "<space>", ":", opt)
map('n', '<leader>l', 'gg=G<C-o>', opt)

-- insert
map("i", "jk", "<ESC>", opt)
-- insert 模式下，光标移动到行首和行尾
map("i", "<C-a>", "<ESC>I", opt)
map("i", "<C-e>", "<ESC>A", opt)

-- visual模式下缩进代码
map("v", "<", "<gv", opt)
map("v", ">", ">gv", opt)
-- 上下移动选中文本
map("v", "J", ":move '>+1<CR>gv-gv", opt)
map("v", "K", ":move '<-2<CR>gv-gv", opt)

-- 分屏快捷键
map("n", "sv", ":vsp<CR>", opt)
map("n", "sh", ":sp<CR>", opt)
-- 关闭当前
map("n", "sc", "<C-w>c", opt)
-- 关闭其他
map("n", "so", "<C-w>o", opt)

-- ctrl + hjkl  窗口之间跳转
map("n", "<C-h>", "<C-w>h", opt)
map("n", "<C-j>", "<C-w>j", opt)
map("n", "<C-k>", "<C-w>k", opt)
map("n", "<C-l>", "<C-w>l", opt)


-- 插件快捷键
local pluginKeys = {}

-- nvim-tree
-- option + m 键打开关闭tree
map("n", "<C-m>", ":NvimTreeToggle<CR>", opt)
-- 列表快捷键
pluginKeys.nvimTreeList = {
  -- 打开文件或文件夹
{ key = {"<CR>", "o", "<2-LeftMouse>"}, action = "edit" },
  -- 分屏打开文件
{ key = "v", action = "vsplit" },
{ key = "h", action = "split" },
  -- 显示隐藏文件
{ key = "i", action = "toggle_ignored" }, -- Ignore (node_modules)
{ key = ".", action = "toggle_dotfiles" }, -- Hide (dotfiles)
  -- 文件操作
{ key = "<C-r>", action = "refresh" }, -- command+r 刷新
{ key = "a", action = "create" },
{ key = "d", action = "remove" },
{ key = "r", action = "rename" },
{ key = "x", action = "cut" },
{ key = "c", action = "copy" },
{ key = "p", action = "paste" },
{ key = "s", action = "system_open" }, -- 调用系统默认打开
}

-- bufferline
-- 左右Tab切换
map("n", "H", ":BufferLineCyclePrev<CR>", opt)
map("n", "L", ":BufferLineCycleNext<CR>", opt)
-- 关闭
--"moll/vim-bbye"
map("n", "<leader>q", ":Bdelete!<CR>", opt) -- 关闭当前标签页(buffer)
map("n", "<leader>bl", ":BufferLineCloseRight<CR>", opt) -- 关闭右侧标签页
map("n", "<leader>bh", ":BufferLineCloseLeft<CR>", opt) -- 关闭左侧标签页
map("n", "<leader>bc", ":BufferLinePickClose<CR>", opt) -- 选择要关闭的标签页

-- Telescope
-- 查找buffer
map("n", ";", ":Telescope buffers<CR>", opt)
-- 查找文件 file
map("n", "<leader>f", ":Telescope find_files<CR>", opt)
-- 全局搜索 /
map("n", "<leader>/", ":Telescope live_grep<CR>", opt)

-- Telescope 列表中 插入模式快捷键
pluginKeys.telescopeList = {
  i = {
    -- 上下移动
    ["<C-j>"] = "move_selection_next",
    ["<C-k>"] = "move_selection_previous",
    ["<Down>"] = "move_selection_next",
    ["<Up>"] = "move_selection_previous",
    -- 历史记录
    ["<C-n>"] = "cycle_history_next",
    ["<C-p>"] = "cycle_history_prev",
    -- 关闭窗口
    ["<leader>q"] = "close",
    -- 预览窗口上下滚动
    ["<C-u>"] = "preview_scrolling_up",
    ["<C-d>"] = "preview_scrolling_down",
  },
  n = {
    ["<leader>q"] = "close",
  }
}

return pluginKeys

