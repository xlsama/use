import { useEffect, useState } from 'react'
import { ActionPanel, Action, List, Clipboard } from '@raycast/api'

const envList = [
  {
    name: 'boe',
    icon: 'logo-boe.png',
    baseUrl: 'https://cloud-boe.bytedance.net',
  },
  {
    name: 'ppe',
    icon: 'logo-ppe.png',
    baseUrl: 'https://cloud.bytedance.net',
  },
]
const argosUrl = '/argos/streamlog/info_overview/log_id_search'

export default function Command() {
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    ;(async () => {
      const text = await Clipboard.readText()
      setSearchText(text ?? '')
    })()
  }, [])

  return (
    <List
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="请输入logId"
      enableFiltering={false}
    >
      <List.Section title="链路日志">
        {envList.map(({ name, icon, baseUrl }) => (
          <List.Item
            key={name}
            title={searchText}
            subtitle={name.toUpperCase()}
            icon={icon}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={`${baseUrl}${argosUrl}?logId=${searchText}`} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  )
}
