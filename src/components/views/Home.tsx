import React from 'react'
import { PageContainer } from '@/components'
import { makeStyles, Typography } from '@material-ui/core'
import { theme } from '@/styles'

export const Home: React.FC = () => {
  const styles = useStyles()
  return (
    <div className={`AppHome-root ${styles.root}`}>
      <PageContainer>
        <section>
          <Typography variant="h2">パッチノート</Typography>
          <Typography>準備中</Typography>
          <Typography variant="h2">このアプリは？</Typography>
          <Typography>
            ポートフォリオ用に React / TypeScript / Material-ui / Firebase
            で作成した、
            <a href="https://trello.com/ja" target="_blank" rel="noreferrer">
              Trello
            </a>
            のクローンアプリです。
          </Typography>
        </section>
      </PageContainer>
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    paddingTop: theme.spacing(10),
    '& .MuiTypography-h2': {
      marginBottom: theme.spacing(2)
    },
    '& .MuiTypography-body1': {
      marginBottom: theme.spacing(3)
    }
  }
})
