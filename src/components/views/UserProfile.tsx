import React from 'react'
import { PageContainer } from '@/components'
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  makeStyles,
  TextField,
  Button
} from '@material-ui/core'
import { theme } from '@/styles'
import { useSelector } from 'react-redux'

export const UserProfile: React.FC = () => {
  const [value, setValue] = React.useState(0)
  const styles = useStyles()
  const currentUser = useSelector(state => state.currentUser)
  const users = useSelector(state => state.users)

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<any>, newValue: number) => {
      setValue(newValue)
    },
    [setValue]
  )

  // doc をアップデートできるようにする

  if (currentUser.user) {
    console.log(currentUser, users.users[currentUser.user!.uid])
  }
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
          {/* 切り出す */}
          <form>
            ユーザー名、
            <TextField />
            email、
            <TextField />
            自己紹介
            <TextField />
            <Button>保存</Button>
          </form>
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
