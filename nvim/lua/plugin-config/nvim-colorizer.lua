local status, nvim_colorizer = pcall(require, "nvim-colorizer")
if not status then
    vim.notify("没有找到 nvim-colorizer")
  return
end

pcall(vim.cmd, 'ColorizerAttachToBuffer')

