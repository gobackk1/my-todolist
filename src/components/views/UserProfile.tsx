import React from 'react'
import { PageContainer, ProfileForm, ProfileSetting } from '@/components'
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
            <Tab label="設定" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <ProfileForm />
        </TabPanel>
        <TabPanel value={value} index={1}>
          アクティビティログは準備中です。
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ProfileSetting />
        </TabPanel>
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
      minHeight: 500,
      padding: theme.spacing(5)
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
