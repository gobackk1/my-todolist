import React from 'react'
import { PageContainer, ProfileForm } from '@/components'
import { AppBar, Tabs, Tab, Box, makeStyles } from '@material-ui/core'
import { theme } from '@/styles'

export const UserProfile: React.FC = () => {
  const [value, setValue] = React.useState(0)
  const styles = useStyles()

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<any>, newValue: number) => {
      setValue(newValue)
    },
    [setValue]
  )

  return (
    <div className={`AppUserProfile-root ${styles.root}`}>
      <PageContainer>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="プロフィール" />
            <Tab label="アクティビティログ" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <ProfileForm />
        </TabPanel>
        <TabPanel value={value} index={1}>
          アクティビティログは準備中です。
        </TabPanel>
        {/* ユーザー名、email、自己紹介表示、変更できるようにする */}
        {/* アバターを表示して、画像アップロードできるようにする */}
        <ul>
          <li></li>
        </ul>
      </PageContainer>
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    paddingTop: theme.spacing(8),
    height: '100%',
    backgroundColor: '#cccccc',
    '& .MuiBox-root': {
      backgroundColor: '#fff',
      minHeight: 500
    }
  }
})

type TabPanelProps = {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <>{value === index && <Box p={3}>{children}</Box>}</>
)
